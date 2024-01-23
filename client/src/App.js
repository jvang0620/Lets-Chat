import "./App.css";
import io from "socket.io-client";
import { useState } from "react";
import Chat from "./Chat";

//establish connection
const socket = io.connect("http://localhost:3001");

function App() {
  //represent username
  const [username, setUsername] = useState("");
  //represent room
  const [room, setRoom] = useState("");
  //represent chat
  const [showChat, setShowChat] = useState(false);

  //establish connection between user who logs in and the socket.io room they want to enter
  const joinRoom = () => {
    if (username !== "" && room !== "") {
      //send data to back-end (in index.js in server directory)
      socket.emit("join_room", room);
      //when user join chat, set ShowChat to true to display chat room
      setShowChat(true);
    }
  };

  return (
    <div className="App">
      {!showChat ? (
        <div className="joinChatContainer">
          <h3>Let's Chat</h3>
          <input
            type="text"
            placeholder="Jack..."
            onChange={(event) => {
              //set uer name based on the vaule of the input (ex: Jack)
              setUsername(event.target.value);
            }}
          />
          <input
            type="text"
            placeholder="Room ID..."
            onChange={(event) => {
              //set room # based on the value of the input (ex: 1)
              setRoom(event.target.value);
            }}
          />
          {/* on click, pass in the joinroom function */}
          <button onClick={joinRoom}>Join A Room</button>
        </div>
      ) : (
        <Chat socket={socket} username={username} room={room} />
      )}
    </div>
  );
}

export default App;