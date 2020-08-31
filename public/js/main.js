const chatForm = document.getElementById("chat-form");
const socket = io();
const chatMessages = document.querySelector(".chat-messages");

//get username and room from url
let url = new URL(window.location.href);
const username = url.searchParams.get("username");
const room = url.searchParams.get("room");

//join chat room
socket.emit("joinRoom", { username, room });

//get room info
socket.on("roomUsers", ({ roomname, roomusers }) => {
  outputUsers(roomname, roomusers);
});

//message from server
socket.on("message", (message) => {
  outputMessage(message);

  //scroll chat messages
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// message submit
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const msg = e.target.elements.msg;

  socket.emit("chatMessage", msg.value);

  msg.value = "";
  msg.focus();
});

//functions

function outputUsers(roomname, roomuser) {
  document.getElementById("room-name").textContent = roomname;

  document.getElementById("users").innerHTML = `
        ${roomuser.map((user) => `<li> ${user.username} </li>`).join("")}
    `;
}

function outputMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `
    <p class="meta">${message.username} <span>${message.time}</span></p>
            <p class="text">
              ${message.text}
            </p>
    `;
  document.querySelector(".chat-messages").appendChild(div);
}
