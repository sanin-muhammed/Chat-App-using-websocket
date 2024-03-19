const path = require("path");
const express = require("express");

const app = express();
const PORT = process.env.PORT || 4005;
const server = app.listen(PORT, () => console.log(`🗯️   sever on port ${PORT}`));

const io = require("socket.io")(server);

app.use(express.static("public"));

let socketsConnected = new Set();

io.on("connection", onConnected);

function onConnected(socket) {
    console.log(`Connected id = ${socket.id}`);
    socketsConnected.add(socket.id);

    io.emit("clients-total", socketsConnected.size);

    socket.on("disconnect", () => {
        console.log(`Disconnected id = ${socket.id}`);
        socketsConnected.delete(socket.id);
        io.emit("clients-total", socketsConnected.size);
    });

    socket.on("message", (data) => {
        socket.broadcast.emit("chat-message", data);
    });

    socket.on('feedback',(data)=>{
        socket.broadcast.emit('feedback', data);
    })
}
