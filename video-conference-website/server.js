const io = require('socket.io')(server);

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
