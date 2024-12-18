const socket = io();
let username = '', room = '';

// Join Room
document.getElementById('join-room').onclick = () => {
    username = document.getElementById('username').value.trim();
    room = document.getElementById('room').value.trim();
    if (username && room) {
        socket.emit('join room', { username, room }); // Join room event
        document.getElementById('join-room').disabled = true;
        document.getElementById('send').disabled = false;
    }
};

// Send Message
document.getElementById('send').onclick = sendMessage;

document.getElementById('input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

function sendMessage() {
    const message = document.getElementById('input').value.trim();
    if (message) {
        const timestamp = formatTime(new Date());
        socket.emit('chat message', { username, room, message, timestamp }); // Send message with room
        appendMessage(`You: ${message}`, 'self', timestamp);
        document.getElementById('input').value = '';
    }
}

// Listen for Messages
socket.on('chat message', ({ username: sender, message, timestamp }) => {
    appendMessage(`${sender}: ${message}`, 'other', timestamp);
});

// Append Message to UI
function appendMessage(text, type, timestamp) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add(type);
    messageDiv.innerHTML = `
        ${text}
        <span class="timestamp">${timestamp}</span>
    `;
    document.getElementById('messages').appendChild(messageDiv);
    document.getElementById('messages').scrollTop = document.getElementById('messages').scrollHeight;
}

// Helper: Format Time
function formatTime(date) {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}
