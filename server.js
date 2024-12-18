const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

// Initialize Express app and server
const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files from the 'public' folder
app.use(express.static('public'));

// Handle Socket.IO connections
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Handle room join request
    socket.on('join room', ({ username, room }) => {
        socket.join(room); // Join the specified room
        console.log(`${username} joined room: ${room}`);

        // Notify others in the room
        socket.to(room).emit('chat message', {
            username: 'System',
            message: `${username} has joined the room.`,
            timestamp: formatTime(new Date()),
        });
    });

    // Handle chat messages
    socket.on('chat message', ({ username, room, message, timestamp }) => {
        console.log(`Message from ${username} in room ${room}: ${message}`);
        // Broadcast the message to others in the same room
        socket.to(room).emit('chat message', { username, message, timestamp });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id);
    });
});

// Helper function to format time as hh:mm
function formatTime(date) {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
