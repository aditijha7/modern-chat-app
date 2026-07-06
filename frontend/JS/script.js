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