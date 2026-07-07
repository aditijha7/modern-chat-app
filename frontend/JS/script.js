// =========================
// REGISTER
// =========================

const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        const username =
            document.getElementById("username").value;

        const email =
            document.getElementById("email").value;

        const password =
            document.getElementById("password").value;

        const confirmPassword =
            document.getElementById("confirmPassword").value;

        // CHECK PASSWORD MATCH
        if (password !== confirmPassword) {

            alert("Passwords do not match ❌");

            return;
        }

        try {

            const response = await axios.post(
                "http://localhost:5000/api/auth/register",
                {
                    username,
                    email,
                    password
                }
            );

            alert("Registration Successful ✅");

            console.log(response.data);

            // REDIRECT TO LOGIN PAGE
            window.location.href = "login.html";

        } catch (error) {

            console.log(error);

            alert(error.response.data.message);

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

        const email =
            document.getElementById("loginEmail").value;

        const password =
            document.getElementById("loginPassword").value;

        try {

            const response = await axios.post(
                "http://localhost:5000/api/auth/login",
                {
                    email,
                    password
                }
            );

            alert("Login Successful ✅");

            console.log(response.data);

            // SAVE TOKEN
            localStorage.setItem(
                "token",
                response.data.token
            );

            localStorage.setItem(
                "username",
                response.data.username
            );

            // REDIRECT
            window.location.href = "index.html";

        } catch (error) {

            console.log(error);

            alert(error.response.data.message);

        }

    });

}
// =========================
// CHAT
// =========================

// Elements
const sendBtn = document.getElementById("sendBtn");
const messageInput = document.getElementById("messageInput");
const messagesDiv = document.getElementById("messages");

// Temporary IDs (replace later with logged-in users)
const senderId = "64a8efeb7256617ad7c2a870";
const receiverId = "64a8f60cc22b0551bed05d4d";


// LOAD MESSAGES

async function loadMessages() {

    if (!messagesDiv) return;

    try {

        const response = await axios.get(

            `http://localhost:5000/api/messages/${senderId}/${receiverId}`

        );

        messagesDiv.innerHTML = "";

        response.data.messages.forEach((msg) => {

            const div = document.createElement("div");

            if (msg.senderId === senderId) {

                div.className = "message sent";

            } else {

                div.className = "message received";

            }

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


// SEND MESSAGE

if (sendBtn) {

    sendBtn.addEventListener("click", async () => {

        const text = messageInput.value.trim();

        if (!text) return;

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


// LOAD CHAT WHEN PAGE OPENS

if (messagesDiv) {

    loadMessages();

}