const socket = io();

const submitBtn = document.getElementById('submitBtn');
const messageInput = document.getElementById('messageInput');
const userName = document.getElementById('userName');
const messagesContainer = document.getElementById('messagesContainer');

// let newMessages = [];

function loadMessages(messages) {
  messagesContainer.innerHTML = '';
  messages.forEach((msg) => {
    const messageBox = document.createElement('div');
    messageBox.className = 'messageBox';
    messageBox.innerHTML = `
								<p class="messageUser" id="messageUser">${msg.user.firstName} ${msg.user.lastName} </p>
								<p class="messageText" id="messageText">${msg.message}</p>
								<small class="messageDate" id="messageText">${msg.createdAt}</small>
								`;
    messagesContainer.appendChild(messageBox);
  });
}

function printMessage(message) {
  messagesContainer.innerHTML += `
								<div class="messageBox">
								<p class="messageUser" id="messageUser">${message.user.firstName} ${message.user.lastName}</p>
								<p class="messageText" id="messageText">${message.message}</p>
								<small class="messageDate" id="messageText">${message.createdAt}</small>
	`;
}

function sendMessage(userID, message) {
  socket.emit('newMessage', {
    user: userID,
    message,
  });
  /* axios({
    method: 'POST',
    url: '/api/chat/new',
    data: {
      user: userID,
      message,
    },
  }).then((res) => {
    printMessage(res.data.message);
  }); */
}

function getMessage() {
  const messageText = messageInput.value.trim();
  messageInput.value = '';
  return messageText;
}

function getMessages(data) {
  return new Promise((res, rej) => {
    if (data) {
      res(data);
    } else {
      rej(new Error('Error getting messages'));
    }
  });
}

socket.on('connect', () => {
  console.log('Connection successful');
  if (submitBtn && messageInput && userName) {
    const auxStorage = document.getElementById('auxStorage');
    let userData = auxStorage.dataset.user;
    let userName = userData.split('-')[0];
    let userID = userData.split('-')[1];

    submitBtn.addEventListener('click', (e) => {
      e.preventDefault();
      sendMessage(userID, getMessage());
    });

    document.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        sendMessage(userID, getMessage());
      }
    });

    socket.on('welcome', async (data) => {
      try {
        const response = await getMessages(data);
        if (response.messages.length > 0) {
          loadMessages(response.messages);
        }
        socket.emit('newUser', userName);
      } catch (err) {
        console.log(err);
      }
    });

    socket.on('newUser', (newUser) => {
      Swal.fire({
        text: `${newUser} has joined the chat!`,
        toast: true,
        position: 'top-right',
      });
    });

    socket.on('newMessage', (message) => {
      printMessage(message);
    });
  }
});
