
const socket = io();
const messageContainer = document.getElementById("message-container");
const nameInput = document.getElementById("name-input");
const messageForm = document.getElementById("message-form");
const messageInput = document.getElementById("message-input");

const messageTone = new Audio('/public_message-tone.mp3')

messageForm.addEventListener("submit", (e) => {
    // not reload the page  
    e.preventDefault();
    sendMessage();
});

function sendMessage() {
    if (messageInput.value === "") return;
    let date = new Date()
    const data = {
        name: nameInput.value,
        message: messageInput.value,
        dateTime: `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`,
    };
    socket.emit("message", data);
    addMessageToUI(true, data);
    messageInput.value = "";
}

socket.on("chat-message", (data) => {
    document.querySelector('.main').style.boxShadow = '0 0 10px #fff';
    addMessageToUI(false, data);
    messageTone.play()
    setTimeout(() => {
        document.querySelector('.main').style.boxShadow = 'none';
    }, 500);
});

function addMessageToUI(isOwnMessage, data) {
    clearFeedback()
    
    const element = `
    <li class="${isOwnMessage ? "message-right" : "message-left"}">
    <p class="message">
    ${data.message}
    <span>${data.name} ⚪ ${data.dateTime}</span>
    </p>
    </li>`;
    
    messageContainer.innerHTML += element;
    scrollToBottom();
}

function scrollToBottom() {
    messageContainer.scrollTo(0, messageContainer.scrollHeight);
}

socket.on("clients-total", (data) => {
    document.getElementById("clients-total").innerHTML = `Total clients: ${data}`;
});

// messageInput.addEventListener("focus", (e) => {
//     socket.emit("feedback", {
//         feedback: `${nameInput.value} is typing a message `,
//     });
// });
messageInput.addEventListener("keypress", (e) => {
    socket.emit("feedback", {
        feedback: `${nameInput.value} is typing a message`,
    });
});
messageInput.addEventListener("blur", (e) => {
    socket.emit("feedback", {
        feedback: "",
    });
});

socket.on("feedback", (data) => {
    clearFeedback()
    const element = `
        <li class="message-feedback">
            <p class="feedback" id="feedback">${data.feedback}</p>
        </li>
    `;
    messageContainer.innerHTML += element;
});


function clearFeedback(){
    document.querySelectorAll('.message-feedback').forEach((element)=>{
        console.log(element.parentNode);
        element.remove();
    })

}
