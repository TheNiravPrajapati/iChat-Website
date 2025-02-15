const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');

const app = express();

// Apply CORS middleware (Update origin with deployed frontend URL)
app.use(cors({
    origin: '*',  // Change this to your deployed frontend URL
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true
}));

// Serve static files if needed (for frontend in same project)
app.use(express.static(path.join(__dirname, '../public')));

// Create an HTTP server
const server = http.createServer(app);

// Create a Socket.io instance attached to the HTTP server
const io = socketIo(server, {
    cors: {
        origin: '*', // Change this to your deployed frontend URL
        methods: ["GET", "POST"],
        credentials: true
    }
});

const users = {};

io.on('connection', socket => {
    console.log('A user connected:', socket.id);

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

// Use dynamic port for Render deployment
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
