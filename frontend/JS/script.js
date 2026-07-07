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

let senderId = localStorage.getItem("userId");
let receiverId = "";

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

            chatItem.innerHTML = `
                <img src="https://i.pravatar.cc/150?u=${user._id}">
                <div class="chat-info">
                    <h4>${user.username}</h4>
                    <small>Click to chat</small>
                </div>
            `;

            chatItem.onclick = () => {

                receiverId = user._id;

                const topName = document.querySelector(".top-user h3");

                if (topName) {

                    topName.innerText = user.username;

                }

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

            div.innerHTML = `
                ${msg.text}
                <div class="time">
                    ${new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit"
                    })}
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

            messageInput.value = "";

            loadMessages();

        } catch (error) {

            console.log(error);

        }

    });

}