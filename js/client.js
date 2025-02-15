const socket = io('http://localhost:8000');

const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector(".messages");
const userNameElement = document.getElementById('user-name'); // Get the user name element

var audio = new Audio('message.mp3');

const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);

    // Scroll to the bottom of the container when a new message is added
    messageContainer.scrollTop = messageContainer.scrollHeight;

    if (position === 'left') {
        audio.play();
    }
};

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`, 'right');
    socket.emit('send', message);
    messageInput.value = '';
});

// Get the name from the prompt
const name = prompt("Enter Your Name To Join The Chat");
if (name) {
    userNameElement.textContent = name; // Set the user name in the header
    socket.emit('new-user-joined', name);
}

socket.on('user-joined', name => {
    append(`${name} joined the chat`, 'left');
});

socket.on('receive', data => {
    append(`${data.name}: ${data.message}`, 'left');
});

socket.on('left', name => {
    append(`${name} left the chat`, 'left');
});