const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

// Create an Express application
const app = express();

// Apply the CORS middleware
app.use(cors({
    origin: 'http://127.0.0.1:5500',
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true
}));

// Create an HTTP server and pass the app as the handler
const server = http.createServer(app);

// Create a Socket.io instance attached to the HTTP server
const io = socketIo(server, {
    cors: {
        origin: 'http://127.0.0.1:5500',
        methods: ["GET", "POST"],
        credentials: true
    }
});

const users = {};

io.on('connection', socket => {
    socket.on('new-user-joined', name => {
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });

    socket.on('send', message => {
        socket.broadcast.emit('receive', { message: message, name: users[socket.id] });
    });

    socket.on('disconnect', () => {
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    });
});

// Start the server
const PORT = 8000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});