import React, { useEffect, useState } from 'react';
import PubNub from 'pubnub';
import './App.css';

const pubnub = new PubNub({
  publishKey: 'YOUR_PUBLISH_KEY_HERE',
  subscribeKey: 'YOUR_SUBSCRIBE_KEY_HERE',
});
// var box = document.getElementById("box"), input = document.getElementById("input"), channel = 'chat';

// input.addEventListener('keypress', function (e) {
//   (e.keyCode || e.charCode) === 13 && pubnub.publish({ // Publish new message when enter is pressed.
//     channel: channel, message: input.value, x: (input.value = '')
//   });
// });

const channel = 'chat';

function App() {
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const listener = {
      message: function (m) {
        // box.innerHTML = ('' + m.message).replace(/[<>]/g, '') + '<br>' + box.innerHTML; // Add message to page.
        console.log(m);
      },
    };
    pubnub.subscribe({ channels: [channel] }); // Subscribe to a channel.
    pubnub.addListener(listener);
    return () => {
      pubnub.unsubscribe({ channels: [channel] });
      pubnub.removeListener(listener);
    };
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <p>
          <input type="text" value={message} onChange={(e) => {
            setMessage(e.target.value);
          }} />
          <button>Send</button>
        </p>
      </header>
    </div>
  );
}

export default App;
