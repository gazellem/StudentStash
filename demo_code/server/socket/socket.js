
const Server =require('socket.io')
const http = require('http')
const express = require('express')
const Message = require('../models/Message')
const Conversation = require('../models/Chat')
const app = express();
const server = http.createServer(app);
const io = Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});

const getRecipientSocketId = (recipientId) => {
    return userSocketMap[recipientId];
};

const userSocketMap = {}; // userId: socketId

io.on("connection", (socket) => {
    console.log("user connected", socket.id);
    const userId = socket.handshake.query.userId;
    socket.on("disconnect", () => {
        console.log("user disconnected");
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

module.exports = { getRecipientSocketId,io, server, app };