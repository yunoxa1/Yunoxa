
const socket = io('https://your-heroku-app.herokuapp.com');

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors'); // Import cors package

const app = express();
const server = http.createServer(app);

// Enable CORS for your frontend URL (GitHub Pages URL)
app.use(cors({
    origin: 'https://yunoxa1.github.io',  // Allow only this origin
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
}));

const io = new Server(server, {
    cors: {
        origin: 'https://yunoxa1.github.io',  // Allow only this origin
        methods: ['GET', 'POST'],
    }
});

// Your Socket.IO logic here
io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});



let meetings = {}; // Store meetings with ID and password

io.on('connection', (socket) => {
    console.log('A user connected');

    // Listen for 'start-call' to generate meeting ID and password
    socket.on('start-call', (meetingId, meetingPassword) => {
        meetings[meetingId] = { password: meetingPassword }; // Store meeting info
        console.log(`Meeting created with ID: ${meetingId} and Password: ${meetingPassword}`);
    });

    // Listen for 'join-call' when a user tries to join
    socket.on('join-call', (enteredId, enteredPassword) => {
        console.log(`Receiver trying to join with ID: ${enteredId} and Password: ${enteredPassword}`);
        if (meetings[enteredId] && meetings[enteredId].password === enteredPassword) {
            socket.emit('join-success', `Successfully joined meeting: ${enteredId}`);
        } else {
            socket.emit('join-failure', 'Invalid Meeting ID or Password');
        }
    });

    // Disconnecting a user
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});
