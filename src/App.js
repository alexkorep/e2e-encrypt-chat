import React, { useEffect, useState, useReducer } from 'react';
import PubNub from 'pubnub';
import { GiftedChat, GiftedAvatar } from 'react-web-gifted-chat';

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

const getAvatar = (id) => (`https://i.pravatar.cc/36?u=${id}`);

function App() {
  const [messages, setMessages] = useState([]);
  const [users, dispatchUsers] = useReducer((state, presenceEvent) => {
    const { action, uuid } = presenceEvent;
    if (action === 'join') {
      state[uuid] = {
        id: uuid,
      };
      return { ...state };
    } else if (action === 'leave' || action === 'timeout') {
      console.log('Deleting user', uuid);
      delete state[uuid];
      console.log('state', state);
      return { ...state };
    }
    return state;
  }, {});

  useEffect(() => {
    const listener = {
      message: function (m) {
        console.log(m);
        const { message } = m;
        const { messages } = message;
        const newMessages = messages.filter(msg => {
          return msg.user.id !== userId
        })
        setMessages((oldMessages) =>
          (GiftedChat.append(oldMessages, newMessages)));
      },
      presence: function (presenceEvent) {
        console.log('presence', presenceEvent);
        dispatchUsers(presenceEvent);
      }
    };
    pubnub.subscribe({ channels: [channel], withPresence: true });
    pubnub.addListener(listener);
    pubnub.hereNow({ channels: [channel], includeState: true },
      (status, response) => {
        const { occupants } = response.channels[channel];
        occupants.forEach(user => {
          dispatchUsers({
            action: 'join',
            uuid: user.uuid,
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
    pubnub.publish({
      channel: channel,
      message: {
        messages: newMessages
      }
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
                <GiftedAvatar user={{
                  id: user.id,
                  avatar: getAvatar(user.id),
                }} />
                {user.id === userId ? 'Me: ' : ''}
                {user.id}
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
      <div style={styles.converationDetails}>
        Conversation details
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
  converationDetails: {
    display: 'flex',
    flex: 1,
  },
  userrec: {
    padding: '8px',
  }
}

export default App;
