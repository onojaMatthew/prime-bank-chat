import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import "../App.css"

const url = "http://localhost:3400";
const App = () => {
  const [ messages, setMessages ] = useState([]);
  const [ chat, setChat ] = useState("");
  const socket = useRef();
  const username = "Onoja";
  const room = "dkfj439jdkf03934okkr";

  useEffect(() => {
    const connectionOptions =  {
      "force new connection" : true,
      "reconnectionAttempts": "Infinity", //avoid having user reconnect manually in order to prevent dead clients after a server restart
      "timeout" : 10000,                  //before connect_error and connect_timeout are emitted.
      "transports" : ["websocket"]
    };
    socket.current = io.connect(url, connectionOptions)
    const data = { room }
    socket.current.emit("join", data);
  }, [])


  const handleChat = () => {
    socket.current.emit("send-chat", { chat, username, room }, () =>{ setChat("")})
  }

  useEffect(() => {
    socket.current.on("message", (message) => {
      console.log(message, " the new message")
      setMessages([...messages, message ]);
    });
  }, [ messages ]);

  return (
    <div className="App" style={{ marginTop: "30%"}}>
      <h1>React chat application</h1>
      {messages.map(message => (<p key={message._id}>{message.message}</p>))}
      <input type="text" value={chat} onChange={(e) => setChat(e.target.value)} style={{  height: "50px"}} />
      <button onClick={handleChat} style={{ background: "black", color: "white", height: "55px"}}>Send a chat</button>
    </div>
  );
}

export default App;
