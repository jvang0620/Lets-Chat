import React, { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";

function Chat({ socket, username, room }) {
  //represent current message
  const [currentMessage, setCurrentMessage] = useState("");
  //represent message list
  const [messageList, setMessageList] = useState([]);

  //handle the sending of messages in a real-time chat application using Socket.IO
  const sendMessage = async () => {
    if (currentMessage !== "") {

      //get current date
      const currentDate = new Date();
      //format date
      const formattedTime = currentDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });

      //object messageData
      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        time: formattedTime
      };

      //handle the process of sending a message from the client to the server
      await socket.emit("send_message", messageData);
      //updating the local state to display the sent message 
      setMessageList((list) => [...list, messageData]);
      //clear the input field for a new message.
      setCurrentMessage("");
    }
  };

  //subscribe to the "receive_message" event from the Socket.IO server
  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
    });
  }, [socket]);

  return (
    <div className="chat-window">

      {/* Chat Header */}
      <div className="chat-header">
        <div className="dot"></div>
        <p>Live Chat</p>
      </div>

      {/* Chat Body */}
      <div className="chat-body">
        <ScrollToBottom className="message-container">
          {/* loop through messge and display each message received in socket server  */}
          {messageList.map((messageContent) => {
            return (
              <div
                className="message"
                // if the user name that's currently in the chat is equal to the user name in the message, then apply 'you' css, if not apply 'other' css
                id={username === messageContent.author ? "you" : "other"}
              >
                <div>
                  <div className="message-content">
                    <p>{messageContent.message}</p>
                  </div>
                  <div className="message-meta">
                    <p id="time">{messageContent.time}</p>
                    <p id="author">{messageContent.author}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </ScrollToBottom>
      </div>

      {/* Chat Footer */}
      <div className="chat-footer">
        <input
          type="text"
          value={currentMessage}
          placeholder="Hey..."
          onChange={(event) => {
            setCurrentMessage(event.target.value);
          }}
          //enable user to send message by pressing 'Enter' on keyboard instead of click the "send" arrow
          onKeyDown={(event) => {
            event.key === "Enter" && sendMessage();
          }}
        />
        
        {/* on click, pass in the sendMessage function */}
        {/* &#9658 is a HTML entity code for a right-pointing triangle/arrow symbols.  It is used to represent a play or forward button icon in this context.*/}
        <button onClick={sendMessage}>&#9658;</button>
      </div>

    </div>
  );
}

export default Chat;