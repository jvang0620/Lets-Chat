/* Entry piont to server */

const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");

//import interface called "Server" from socket.io library
const { Server } = require("socket.io");

//use cors middleware
app.use(cors()); 

//create server
const server = http.createServer(app);

//instantiate server
const io = new Server(server, {
  //adding object cors
  cors: {
    //origin tells our server which url is making the call to socket.io server  ->  React is on localhost:3000
    origin: "http://localhost:3000",
    //accept these methods
    methods: ["GET", "POST"],
  },
});

//enables real-time, bidirectional and event-based communication between clients and servers
io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  //when a client emits a "join_room" event to the server, these lines of code handle the process of making the client join a specific room. 
  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  //when a client emits a "send_message" event to the server, these lines ensure that the message is broadcasted to all clients in the same room, allowing real-time communication between clients in a specific chat room.
  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  //when a client disconnects from the Socket.IO server, it logs a message indicating the user's disconnection along with their socket ID
  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

//listen on this port
server.listen(3001, () => {
  console.log("SERVER RUNNING");
});