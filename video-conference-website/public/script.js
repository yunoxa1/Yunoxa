const localVideo = document.getElementById('local-video');
const remoteVideo = document.getElementById('remote-video');
const startButton = document.getElementById('start-button');
const endButton = document.getElementById('end-button');
const meetingInfoButton = document.getElementById('meeting-info-button');
const joinButton = document.getElementById('join-button');
const joinForm = document.getElementById('join-form');
const joinIdInput = document.getElementById('join-id');
const joinPasswordInput = document.getElementById('join-password');
const joinSubmitButton = document.getElementById('join-submit-button');

let localStream;
let remoteStream;
let peerConnection;

const configuration = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' }
    ]
};

const socket = io('https://your-app-name.herokuapp.com');  // Use the actual deployed URL of your backend


let meetingId = null;
let meetingPassword = null;

startButton.onclick = startCall;
endButton.onclick = endCall;
meetingInfoButton.onclick = showMeetingInfo;
joinButton.onclick = showJoinForm;
joinSubmitButton.onclick = joinMeeting;

async function startCall() {
    console.log('Start Call button clicked');
    try {
        if (meetingId) {
            alert('Meeting already created!'); // If the meeting already has an ID and password
            return;
        }
        
        // Generate unique meeting ID and password only once per call
        meetingId = generateMeetingId();
        meetingPassword = generatePassword();

        // Show the meeting ID and password button
        meetingInfoButton.style.display = 'inline-block';

        // Get local media stream
        console.log('Requesting user media...');
        localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        console.log('User media accessed successfully');
        localVideo.srcObject = localStream;

        // Create RTCPeerConnection
        console.log('Creating RTCPeerConnection...');
        peerConnection = new RTCPeerConnection(configuration);

        // Add local stream tracks to the peer connection
        localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

        peerConnection.ontrack = event => {
            remoteVideo.srcObject = event.streams[0];
        };

        peerConnection.onicecandidate = event => {
            if (event.candidate) {
                socket.emit('candidate', event.candidate);
            }
        };

        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        socket.emit('offer', offer);

        // Emit start call to the server with meeting ID and password
        socket.emit('start-call', meetingId, meetingPassword);
        console.log(`Meeting created with ID: ${meetingId} and Password: ${meetingPassword}`);

    } catch (error) {
        console.error('Error starting call:', error);
    }
}

function endCall() {
    console.log('End Call button clicked');
    if (peerConnection) {
        peerConnection.close();
        peerConnection = null;
    }
    if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
        localStream = null;
    }
    localVideo.srcObject = null;
    remoteVideo.srcObject = null;

    // Reset meeting info
    meetingId = null;
    meetingPassword = null;
    meetingInfoButton.style.display = 'none';
}

function generateMeetingId() {
    return Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
}

function generatePassword() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < 5; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
}

function showMeetingInfo() {
    alert(`Meeting ID: ${meetingId}\nPassword: ${meetingPassword}`);
}

// Join Meeting Logic
function showJoinForm() {
    joinForm.style.display = 'flex';
}

function joinMeeting() {
    const enteredId = joinIdInput.value;
    const enteredPassword = joinPasswordInput.value;

    console.log(`Receiver entered Meeting ID: ${enteredId} and Password: ${enteredPassword}`);

    socket.emit('join-call', enteredId, enteredPassword);

    // Listen for join response from server
    socket.on('join-success', (message) => {
        alert(message);
        joinForm.style.display = 'none'; // Hide the join form
        startCall(); // Start the call (join the existing one)
    });

    socket.on('join-failure', (message) => {
        alert(message); // Invalid meeting ID or password
    });
}

// Listen for incoming offers and handle them
socket.on('offer', async (offer) => {
    if (!peerConnection) return;
    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    socket.emit('answer', answer);
});

socket.on('answer', async (answer) => {
    if (!peerConnection) return;
    await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
});

socket.on('candidate', async (candidate) => {
    if (!peerConnection) return;
    await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
});
