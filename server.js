const path = require("path");
const express = require("express");
const app = express();
const formatMessage = require("./utils/messages");
const {
  userJoin,
  getCurrentUser,
  userLeft,
  getRoomUsers,
} = require("./utils/users");
const http = require("http");
const socket = require("socket.io");
const server = http.createServer(app);
const io = socket(server);

app.use(express.static(path.join(__dirname, "public")));

//sockets

io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);
    console.log(user);
    socket.join(user.room);

    socket.emit(
      "message",
      formatMessage("CoderSpot Bot", `Welcome to CoderSpot, ${user.username}`)
    );

    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage("CoderSpot Bot", `${user.username} has joined the chat`)
      );

    io.to(user.room).emit("roomUsers", {
      roomname: user.room,
      roomusers: getRoomUsers(user.room),
    });
  });

  socket.on("disconnect", () => {
    const user = userLeft(socket.id);

    if (user) {
      io.to(user.room).emit(
        "message",
        formatMessage("CoderSpot Bot", `${user.username} has left the chat`)
      );

      io.to(user.room).emit("roomUsers", {
        room: user.room,
        roomusers: getRoomUsers(user.room),
      });
    }
  });

  socket.on("chatMessage", (msg) => {
    let user = getCurrentUser(socket.id);

    io.to(user.room).emit("message", formatMessage(user.username, msg));
  });
});

server.listen(process.env.PORT || 3000);
