import path from "path";
import { Server } from 'socket.io';
import express from 'express';
import { createServer } from 'http';

import bodyParser from "body-parser";
import morgan from "morgan";

import { chatRead, newChat } from "./controller/chat.js";
import {deleteRoom, joinRoom } from "./controller/room.js"
import { db } from "./config/db.js"

const app = express();
db();
const port = process.env.PORT || 3400;
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//==================================================
// Setting up Cross Origin Resource Sharing
//==================================================
app.use( ( req, res, next ) => {
  res.header( "Access-Control-Allow-Origin", "*" );
  res.header( "Access-Control-Allow-Credentials", true );
  res.header( "Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH" );
  res.header( 'Access-Control-Allow-Headers', 'Origin, X-Requested-With, Authorization, Content-Type, Accept, X-Auth-Token' );

  next();
} );

app.get("/", (req, res) => {
  res.json({ message: "Hello Express API" });
});

const server = createServer(app)
const io = new Server(server, {
  handlePreflightRequest: (req, res) => {
    const headers = {
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Origin": req.get('origin'), //or the specific origin you want to give access to,
        "Access-Control-Allow-Credentials": true
    };
    res.writeHead(200, headers);
    res.end();
  }
});


io.on("connection", (socket) => {
  let roomId;
  socket.on("join", async (data) => {
    const { room } = data;
    const result = await joinRoom(room);
    if (result && result.newRoom) {
      roomId = result.newRoom._id;
      const newRoom = result.newRoom
    
      socket.join(newRoom.name);
    }
    
  });

  socket.on("send-chat", async (data) => {
    
    const chat = await newChat(data);
    const message = chat.message
    io.to(data.room).emit("message", message);
  });
  socket.on("disconnect", async() => {
    await deleteRoom(roomId);
  });
});

server.listen(port, () => console.log(`Server is up and running on port ${port}`));