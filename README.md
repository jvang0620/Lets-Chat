# Real-Time Chat App

<p align="center">
  <img src="/imgs/letChat.PNG" alt="Let-Chat">
</p>

![Chat-Snippit](/imgs/chat-snippit.PNG)

# Table of Contents

1. [Overview](#overview)
2. [Key Features](#key-features)
3. [Technologies Used](#technologies-used)
   - [React Usage](#how-is-react-used-in-the-chat-application)
   - [Socket.IO Usage](#how-is-socketio-used-in-the-chat-application)
   - [Express Usage](#how-is-express-used-in-the-chat-application)
4. [Getting Started](#getting-started)

## Overview

The Chat App is designed to provide users with an engaging and dynamic platform for real-time conversations. Leveraging state-of-the-art technologies, the application seamlessly unites users in interactive chat rooms, fostering a strong sense of community and facilitating smooth communication. With an emphasis on user experience, the app boasts a user-friendly interface that ensures a seamless and enjoyable chatting experience for individuals of all skill levels.

## Key Features:

- **Instant Messaging:** Send and receive messages in real-time within dedicated chat rooms.
- **User-Friendly:** Simple and intuitive user interface for a smooth chatting experience.
- **Join Chat Rooms:** Enter specific chat rooms by providing a username and room ID.
- **Time Stamps:** Messages display accurate timestamps for better conversation tracking.
- **Dynamic Styling:** Interactive design with dynamic styling based on the message sender.

## Technologies Used:

[![React](https://img.shields.io/badge/library-React-blue.svg?style=for-the-badge&logo=react)](https://reactjs.org/)
Building a responsive and dynamic user interface.

[![Socket.IO](https://img.shields.io/badge/library-Socket.IO-green.svg?style=for-the-badge&logo=socket.io)](https://socket.io/)
Enabling real-time bidirectional communication between clients and the server.

[![Express](https://img.shields.io/badge/framework-Express-orange.svg?style=for-the-badge)](https://expressjs.com/)
Powering the server-side application for handling socket connections.

## How is React Used In The Chat-Application

1. Component-Based Architecture:

- React follows a component-based architecture where the UI is divided into reusable components.
- In the app, components like `Chat`, `ScrollToBottom`, and others are created to encapsulate specific functionalities and UI elements.

2. UI Rendering:

- React is responsible for rendering the UI based on the application's state.
- In the app, state variables like `currentMessage`, `messageList`, and others are managed using React's `useState` hook.
- UI elements are updated dynamically based on changes in state, providing a responsive and interactive user experience.

3. Event Handling:

- React handles user interactions and events easily.
- In the app, the `sendMessage` function is triggered when the user clicks the send button or presses Enter, updating the state and emitting a message to the Socket.IO server.

4. Efficient DOM Updates:

- React uses a virtual DOM to efficiently update the actual DOM by only rendering and updating the components that have changed.
- This ensures optimal performance, especially in real-time applications like where messages are frequently updated.

5. Use of Hooks:

- React hooks, such as`useEffect`, are used to perform side effects in function components.
- In the app, `useEffect` is utilized to subscribe to the "receive_message" event from the Socket.IO server, updating the message list when new messages are received.

6. Conditional Rendering:

- React supports conditional rendering based on state or props.
- In the app, the rendering logic is controlled based on whether the user is in the chat room or needs to join a room.

7. Separation of Concerns:

- React promotes a clear separation of concerns by keeping UI logic separate from business logic.
- Components like `Chat` handle UI rendering and user interactions, while the Socket.IO server handles real-time communication.

Overall, React enhances the development of the Chat App by providing a declarative and efficient way to build UI components and manage the application's state. It facilitates a smooth and responsive user experience, making it well-suited for real-time communication scenarios.

## How is Socket.io Used In The Chat-Application

In the Chat App, Socket.IO is used to enable real-time bidirectional communication between clients and the server.

1. Connection Establishment:

- In the server-side code (index.js in the server directory), Socket.IO is configured to listen for incoming connections when clients connect to the server:

  ```javascript
  io.on("connection", (socket) => {
    // Handle events when a new client connects
  });
  ```

2. Joining Chat Rooms:

- When a user joins a specific chat room, the client emits a `join_room` event to the server. This is handled in the server code:

  ```javascript
  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });
  ```

- The server joins the client to the specified room, allowing communication within that room.

3. Sending Messages:

- When a user sends a message, the client emits a `send_message` event to the server. This event includes the message data:

  ```javascript
  socket.emit("send_message", messageData);
  ```

- On the server side, the received message is broadcasted to all clients in the same room using the `socket.to(room).emit` method:

  ```javascript
  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });
  ```

4. Receiving Messages:

- Clients are subscribed to the `receive_message` event, and when a new message is received, the UI is updated to display the incoming message:

  ```javascript
  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
    });
  }, [socket]);
  ```

- The `useEffect` hook is used to handle side effects, in this case, listening for incoming messages.

5. Disconnect Handling:

- When a client disconnects, the server logs a message:

  ```javascript
  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
  ```

Overall, Socket.IO facilitates real-time communication by providing an abstraction over traditional WebSocket connections and handling various events seamlessly. It's a crucial component in enabling chat functionality, ensuring that messages are delivered and displayed in real-time across connected clients.

## How is Express Used In The Chat-Application

- Express is used as the backend framework to handle HTTP requests and manage the Socket.IO connections. Here's a brief explanation:

1. Server Setup:

- In the server/index.js file, an Express app was created and set up with a basic HTTP server using http.createServer(app), and then it was instantiated with a Socket.IO server by passing the HTTP server to new Server(httpServer).

  ```javascript
  const express = require("express");
  const app = express();
  const http = require("http").createServer(app);
  const { Server } = require("socket.io");
  const io = new Server(http);
  ```

2. Socket.IO Connection:

- Express provides the HTTP server that Socket.IO needs.
- When a client connects (io.on("connection", (socket) => {...}), the Express app handles the initial HTTP handshake, and then Socket.IO manages the WebSocket connection for real-time communication.

  ```javascript
  io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);

    socket.on("join_room", (data) => {
      socket.join(data);
      console.log(`User with ID: ${socket.id} joined room: ${data}`);
    });

    socket.on("send_message", (data) => {
      socket.to(data.room).emit("receive_message", data);
    });

    socket.on("disconnect", () => {
      console.log("User Disconnected", socket.id);
    });
  });
  ```

3, Express as HTTP Server:

- By passing the http server to Socket.IO, it integrated Socket.IO into the existing Express application. Express serves as the HTTP server, and Socket.IO adds WebSocket functionality.

  ```javascript
  const server = http.listen(3001, () => {
    console.log("SERVER RUNNING");
  });
  ```

In summary, Express is used to set up an HTTP server, handle the initial HTTP requests, and serve as a foundation for Socket.IO to establish and manage WebSocket connections for real-time communication.

## Getting Started:

1. Clone the repository to your local machine using one of the following:

   - HTTPS: `git clone https://github.com/jvang0620/React-Chat-App`
   - SSH: `git clone git@github.com:jvang0620/React-Chat-App`

2. **Run the Server:**

   - Change directory to the server: `cd server`
   - Install the necessary dependencies: `npm install`
   - Start the server: `npm start`

3. **Run the Client while Server is running:**

   - Open a new terminal and change directory to the client: `cd client`
   - Install the necessary dependencies: `npm install`
   - Launch the React app: `npm start`

4. A new window should open. If not, navigate to `http://localhost:3000`. Open another window and start chatting in real-time with your friends or colleagues.

5. Happy chatting! 📱💬🤔🗨️🤗👥🌐
