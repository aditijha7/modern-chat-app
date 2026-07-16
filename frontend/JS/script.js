// =========================
// REGISTER
// =========================

const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        const username = document.getElementById("username").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        if (password !== confirmPassword) {
            alert("Passwords do not match ❌");
            return;
        }

        try {

            await axios.post(
                "http://localhost:5000/api/auth/register",
                {
                    username,
                    email,
                    password
                }
            );

            alert("Registration Successful ✅");
            window.location.href = "login.html";

        } catch (error) {

            console.log(error);
            alert(error.response?.data?.message || "Registration Failed");

        }

    });

}



// =========================
// LOGIN
// =========================

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        const email = document.getElementById("loginEmail").value;
        const password = document.getElementById("loginPassword").value;

        try {

            const response = await axios.post(
                "http://localhost:5000/api/auth/login",
                {
                    email,
                    password
                }
            );

            console.log("LOGIN RESPONSE:", response.data);

            localStorage.setItem("token", response.data.token);
            localStorage.setItem("username", response.data.username);
            localStorage.setItem("userId", response.data._id);

            console.log("Saved UserId:", localStorage.getItem("userId"));

            alert("Login Successful ✅");

            window.location.href = "index.html";

        } catch (error) {

            console.log(error);
            alert(error.response?.data?.message || "Login Failed");

        }

    });

}
// =========================
// CHAT
// =========================

const sendBtn = document.getElementById("sendBtn");
const messageInput = document.getElementById("messageInput");
const messagesDiv = document.getElementById("messages");
const chatList = document.getElementById("chatList");
const searchUser = document.getElementById("searchUser");
const emojiBtn = document.getElementById("emojiBtn");
const emojiPicker = document.getElementById("emojiPicker");
const attachBtn = document.getElementById("attachBtn");
const fileInput = document.getElementById("fileInput");

const socket = io("http://localhost:5000");

const typingStatus = document.getElementById("typingStatus");

socket.on("connect", () => {

    console.log("Connected to Socket.IO:", socket.id);

});

let senderId = localStorage.getItem("userId");

if (senderId) {

    socket.emit("userConnected", senderId);

}

let receiverId = "";

let onlineUsers = [];

socket.on("onlineUsers", (users) => {

    onlineUsers = users;

    loadUsers();

    if (receiverId && typingStatus) {

        typingStatus.innerText = onlineUsers.includes(receiverId)
            ? "Online"
            : "Offline";

    }

});

let typingTimeout;

if (messageInput) {

    messageInput.addEventListener("input", () => {

        if (!receiverId) return;

        socket.emit("typing", {
            senderId,
            receiverId
        });

        clearTimeout(typingTimeout);

        typingTimeout = setTimeout(() => {

            socket.emit("stopTyping", {
                senderId,
                receiverId
            });

        }, 1000);

    });

}

socket.on("typing", (data) => {

    if (data.senderId === receiverId && typingStatus) {

        typingStatus.innerText = "Typing...";

    }

});

socket.on("stopTyping", (data) => {

    if (data.senderId === receiverId && typingStatus) {

        typingStatus.innerText = onlineUsers.includes(receiverId)
            ? "Online"
            : "Offline";

    }

});

console.log("Sender ID:", senderId);

// If userId doesn't exist, go back to login

if (!senderId && window.location.pathname.includes("index.html")) {

    alert("Please login first.");

    window.location.href = "login.html";

}
// =========================
// SHOW LOGGED USER
// =========================

const username = localStorage.getItem("username");

if (document.getElementById("username")) {

    document.getElementById("username").innerText = username;

}



// =========================
// LOAD USERS
// =========================

if (chatList) {

    loadUsers();

}

async function loadUsers() {

    try {

        const response = await axios.get(
            "http://localhost:5000/api/users"
        );

        const users = response.data.users;

        chatList.innerHTML = "";

        users.forEach(user => {

            if (user._id === senderId) return;

            const chatItem = document.createElement("div");

            chatItem.className = "chat-item";

            const status = onlineUsers.includes(user._id)
                ? "🟢 Online"
                : "⚪ Offline";

            chatItem.innerHTML = `
                <img src="https://i.pravatar.cc/150?u=${user._id}">
                <div class="chat-info">
                <h4>${user.username}</h4>
                <small>${status}</small>
                </div>
            `;

            chatItem.onclick = () => {

                receiverId = user._id;
                const topName = document.querySelector(".top-user h3");

            if (topName) {
                topName.innerText = user.username;
            }

            if (typingStatus) {

                typingStatus.innerText = onlineUsers.includes(user._id)
                ? "Online"
                : "Offline";
            }

        // MARK MESSAGES AS SEEN

        axios.put(
            "http://localhost:5000/api/messages/seen",
            {
                senderId: receiverId,
                receiverId: senderId
            }
        );

        socket.emit("messageSeen", {
            senderId: receiverId,
            receiverId: senderId
        });

            loadMessages();
            };

            chatList.appendChild(chatItem);

        });

    } catch (error) {

        console.log(error);

    }

}



// =========================
// LOAD MESSAGES
// =========================

async function loadMessages() {

    if (!receiverId) return;

    try {

        const response = await axios.get(
            `http://localhost:5000/api/messages/${senderId}/${receiverId}`
        );

        messagesDiv.innerHTML = "";

        response.data.messages.forEach(msg => {

            const div = document.createElement("div");

            div.className =
                msg.senderId == senderId
                    ? "message sent"
                    : "message received";

           let messageContent = "";

if (msg.file) {

    const extension = msg.file.split(".").pop().toLowerCase();

    if (["jpg", "jpeg", "png", "gif", "webp"].includes(extension)) {

        messageContent = `
            <img
                src="http://localhost:5000/uploads/${msg.file}"
                style="max-width:220px; border-radius:10px;"
            >
        `;

    } else {

        messageContent = `
            <a
                href="http://localhost:5000/uploads/${msg.file}"
                target="_blank">
                📄 Download File
            </a>
        `;

    }

} else {

    messageContent = msg.text;

}

div.innerHTML = `
    ${messageContent}

    <div class="time">

        ${new Date(msg.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        })}

        ${
            msg.senderId == senderId
                ? (msg.seen
                    ? " ✓✓"
                    : (msg.delivered
                        ? " ✓"
                        : ""))
                : ""
        }

    </div>
`;

            messagesDiv.appendChild(div);

        });

        messagesDiv.scrollTop = messagesDiv.scrollHeight;

    } catch (error) {

        console.log(error);

    }

}



// =========================
// SEND MESSAGE
// =========================

if (sendBtn) {

    sendBtn.addEventListener("click", async () => {

        if (!receiverId) {

            alert("Please select a user first.");

            return;

        }

        const text = messageInput.value.trim();

        if (!text) return;

        console.log({
            senderId,
            receiverId,
            text
        });

        try {

           await axios.post(
                "http://localhost:5000/api/messages/send",
                {
                    senderId,
                    receiverId,
                    text
                }
            );

            // Tell all connected clients a new message arrived
            socket.emit("sendMessage", {
                senderId,
                receiverId,
                text
            });

            messageInput.value = "";
            loadMessages();
            socket.emit("stopTyping", {
                senderId,
                receiverId
            });

        }
        catch (error) {

            console.log(error);

        }

    });
}
// =========================
// LOGOUT
// =========================

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener("click", () => {

        const confirmLogout = confirm(
            "Are you sure you want to logout?"
        );

        if (!confirmLogout) return;

        localStorage.clear();

        window.location.href = "login.html";

    });

}
socket.on("receiveMessage", (message) => {

    // Refresh the chat only if the message belongs to
    // the currently opened conversation

    if (
        (message.senderId === senderId && message.receiverId === receiverId) ||
        (message.senderId === receiverId && message.receiverId === senderId)
    ) {
        loadMessages();
    }

});
socket.on("messageSeen", () => {

    loadMessages();

});
// =========================
// SEARCH USERS
// =========================

if (searchUser) {

    searchUser.addEventListener("keyup", () => {

        const value = searchUser.value.toLowerCase();

        const chats = document.querySelectorAll(".chat-item");

        chats.forEach(chat => {

            const username = chat.querySelector("h4").innerText.toLowerCase();

            if (username.includes(value)) {

                chat.style.display = "flex";

            } else {

                chat.style.display = "none";

            }

        });

    });

}
// =========================
// EMOJI PICKER
// =========================

if (emojiBtn) {

    emojiBtn.addEventListener("click", () => {

        emojiPicker.classList.toggle("show");

    });

}

if (emojiPicker) {

    emojiPicker.addEventListener("click", (e) => {

        if (e.target.tagName !== "SPAN") return;

        messageInput.value += e.target.innerText;

        messageInput.focus();

    });

}
// =========================
// FILE PICKER
// =========================

if (attachBtn) {

    attachBtn.addEventListener("click", () => {

        fileInput.click();

    });

}

// =========================
// FILE PICKER
// =========================

if (attachBtn) {

    attachBtn.addEventListener("click", () => {

        fileInput.click();

    });

}

if (fileInput) {

    fileInput.addEventListener("change", async () => {

        const file = fileInput.files[0];

        if (!file || !receiverId) {

            alert("Please select a user first.");

            return;

        }

        const formData = new FormData();

        formData.append("senderId", senderId);
        formData.append("receiverId", receiverId);
        formData.append("text", "");
        formData.append("file", file);

        try {

            const response = await axios.post(
                "http://localhost:5000/api/messages/send",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }
            );

            socket.emit("sendMessage", response.data.message);

            loadMessages();

            fileInput.value = "";

        } catch (error) {

            console.log(error);

            alert("File upload failed!");

        }

    });

}