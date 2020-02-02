import React, { useEffect, useState, useReducer } from 'react';
import PubNub from 'pubnub';
import { GiftedChat, GiftedAvatar } from 'react-web-gifted-chat';
import nacl from 'tweetnacl'
import naclUtil from 'tweetnacl-util';

import './App.css';

const channel = 'chat';
const userId = localStorage.getItem('userId') ||
  Math.random().toString(10).slice(2);
localStorage.setItem('userId', userId);

const pubnub = new PubNub({
  publishKey: 'pub-c-5e44bacc-d9b4-4d11-9462-089626f7f2e6',
  subscribeKey: 'sub-c-347badce-45ed-11ea-aea8-722f8d3d4603',
  uuid: userId,
});

const keyPair = nacl.box.keyPair();

const getAvatar = (id) => (`https://i.pravatar.cc/36?u=${id}`);

const encrypt = (userToPublicKey, text) => {
  const nonce = nacl.randomBytes(24)
  const box = nacl.box(
    naclUtil.decodeUTF8(text),
    nonce,
    new Uint8Array(userToPublicKey),
    keyPair.secretKey
  )
  return {
    box: Array.from(box),
    nonce: Array.from(nonce)
  }
}

const decrypt = (userFromPublicKey, message) => {
  const payload = nacl.box.open(
    new Uint8Array(message.box),
    new Uint8Array(message.nonce),
    new Uint8Array(userFromPublicKey),
    keyPair.secretKey
  );
  return naclUtil.encodeUTF8(payload)
}

const keyToStr = (key) => {
  if (!key) {
    return 'none';
  }
  return key.map(val => val.toString(10)).join('-');
}

function App() {
  const [messages, setMessages] = useState([]);
  const [users, dispatchUsers] = useReducer((state, presenceEvent) => {
    const { action, uuid } = presenceEvent;
    if (action === 'join' || action === 'state-change' || action === 'here-now') {
      if (uuid === userId) {
        // Ignore myself
        return state;
      }
      state[uuid] = {
        ...state[uuid],
        id: uuid,
      };
      const publicKey = presenceEvent.state ? presenceEvent.state.publicKey : null;
      if (publicKey) {
        state[uuid].publicKey = publicKey;
      }
      return { ...state };
    } else if (action === 'leave' || action === 'timeout') {
      delete state[uuid];
      return { ...state };
    }
    return state;
  }, {});

  useEffect(() => {
    const listener = {
      message: function (m) {
        const { message } = m;
        const { messages } = message;
        console.log('Incoming messages', messages)
        const newMessages = messages.filter(msg => {
          console.log('msg.to === userId', msg.to, userId);
          return msg.user.id !== userId && // Message is not sent from me
            users[msg.user.id] && // I know the sender
            msg.to === userId; // Message is sent to me
        }).map(msg => {
          const userFrom = users[msg.user.id];
          const userFromPublicKey = userFrom.publicKey;
          const { encrypted } = msg;
          return {
            ...msg,
            text: decrypt(userFromPublicKey, encrypted),
          };
        })

        setMessages((oldMessages) =>
          (GiftedChat.append(oldMessages, newMessages)));
      },
      presence: function (presenceEvent) {
        dispatchUsers(presenceEvent);
      }
    };
    pubnub.subscribe({ channels: [channel], withPresence: true });
    pubnub.addListener(listener);

    // Publish my public key
    const keyArray = Array.from(keyPair.publicKey)
    pubnub.setState({
      channels: [channel],
      state: {
        publicKey: keyArray,
      }
    });

    pubnub.hereNow({ channels: [channel], includeState: true },
      (status, response) => {
        const { occupants } = response.channels[channel];
        occupants.forEach(user => {
          dispatchUsers({
            action: 'here-now',
            uuid: user.uuid,
            state: {
              publicKey: user.state ? user.state.publicKey : null,
            }
          });
        })
      }
    );
    return () => {
      pubnub.unsubscribe({ channels: [channel] });
      pubnub.removeListener(listener);
    };
  }, []);

  const sendMessage = (newMessages) => {
    setMessages((oldMessages) =>
      (GiftedChat.append(oldMessages, newMessages)));

    Object.values(users).forEach(user => {
      const { publicKey } = user;
      const messagesToPublish = newMessages.map(message => {
        const { createdAt, text, id } = message;
        const encrypted = encrypt(publicKey, text);
        return {
          createdAt,
          user: message.user,
          encrypted,
          id,
          to: user.id
        }
      });
      pubnub.publish({
        channel: channel,
        message: {
          messages: messagesToPublish
        }
      });
    });
  };

  return (
    <div className="App" style={styles.container}>
      <div style={styles.conversationList}>
        <h2>Participants</h2>
        {
          Object.values(users).map(user => {
            return (
              <div key={user.id} style={styles.userrec}>
                <div>
                  <GiftedAvatar user={{
                    id: user.id,
                    avatar: getAvatar(user.id),
                  }} />
                </div>
                <div>{user.id}</div>
                <div>Public key: {keyToStr(user.publicKey)}</div>
              </div>
            )
          })
        }
      </div>
      <div style={styles.chat}>
        <GiftedChat
          messages={messages}
          onSend={(newMessages) => sendMessage(newMessages)}
          user={{
            id: userId,
            name: userId.toString(),
            avatar: getAvatar(userId),
          }}
        />
      </div>
    </div>
  )
};


const styles = {
  container: {
    flex: 1,
    display: "flex",
    flexDirection: "row",
    height: "100vh",
  },
  conversationList: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    padding: '12px',
    overflowY: 'scroll',
  },
  chat: {
    display: "flex",
    flex: 3,
    flexDirection: "column",
    borderWidth: "1px",
    borderColor: "#ccc",
    borderRightStyle: "solid",
    borderLeftStyle: "solid",
  },
  userrec: {
    padding: '8px',
  }
}

export default App;
