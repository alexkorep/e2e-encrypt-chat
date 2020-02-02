import React, { useEffect, useState } from 'react';
import PubNub from 'pubnub';
import { GiftedChat } from 'react-web-gifted-chat';

import './App.css';

const pubnub = new PubNub({
  publishKey: 'pub-c-5e44bacc-d9b4-4d11-9462-089626f7f2e6',
  subscribeKey: 'sub-c-347badce-45ed-11ea-aea8-722f8d3d4603',
});
// var box = document.getElementById("box"), input = document.getElementById("input"), channel = 'chat';

// input.addEventListener('keypress', function (e) {
//   (e.keyCode || e.charCode) === 13 && pubnub.publish({ // Publish new message when enter is pressed.
//     channel: channel, message: input.value, x: (input.value = '')
//   });
// });

const channel = 'chat';
const userId = Math.random().toString(10).slice(2);
console.log(userId)

function App() {
  const [messages, setMessages] = useState([
    // {
    //   id: 1,
    //   text: 'Hello developer',
    //   createdAt: new Date(),
    //   user: {
    //     id: 2,
    //     name: 'React',
    //     avatar: 'https://facebook.github.io/react/img/logo_og.png',
    //   },
    // },
  ]);

  useEffect(() => {
    const listener = {
      message: function (m) {
        // box.innerHTML = ('' + m.message).replace(/[<>]/g, '') + '<br>' + box.innerHTML; // Add message to page.
        console.log(m);
        const { message } = m;
        const { messages } = message;
        const newMessages = messages.filter(msg => {
          return msg.user.id !== userId
        })
        setMessages((oldMessages) =>
          (GiftedChat.append(oldMessages, newMessages)));
      },
    };
    pubnub.subscribe({ channels: [channel] }); // Subscribe to a channel.
    pubnub.addListener(listener);
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
        Converstions
        </div>
      <div style={styles.chat}>
        <GiftedChat
          messages={messages}
          onSend={(newMessages) => sendMessage(newMessages)}
          user={{
            id: userId,
            name: userId.toString(),
            avatar: `https://i.pravatar.cc/36?u=${userId}`,
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
  }
}

export default App;
