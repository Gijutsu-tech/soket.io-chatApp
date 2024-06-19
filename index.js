const express = require("express");
const { createServer } = require("node:http")
const { join } = require('node:path');
const { Server } = require("socket.io");


const app = express();
const server = createServer(app);
const io = new Server(server)

const users = {}

app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'index.html'));
})
 
io.on('connection', (socket)=>{
    console.log("new user connected")

    socket.on('new-user-joined', (name) =>{
        users[socket.id] = name
        socket.broadcast.emit('user-joined', (name))
        console.log("New user:", name)
    })

    // socket.on('chat message', (msg) => {
    //     socket.broadcast.emit('chat message', msg);
    // });

    socket.on('chat message', (message) => {
        socket.broadcast.emit('chat message', {message: message, name: users[socket.id]});
    });

    socket.on('disconnect', (name)=>{
        console.log("user disconnected")
    })
})

server.listen(3000, () => {
    console.log('server running at http://localhost:3000');
  });