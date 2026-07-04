// =========================
// REGISTER
// =========================

const registerForm =
    document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener(
        "submit",
        async (e) => {

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

                const response =
                    await fetch(
                        "http://localhost:5000/api/auth/register",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({

                                username,
                                email,
                                password

                            })
                        }
                    );

                const data =
                    await response.json();

                if (response.ok) {

                    alert("Registration Successful ✅");

                    window.location.href = "login.html";

                    // SAVE TOKEN

                    localStorage.setItem(
                        "token",
                        data.token
                    );

                    localStorage.setItem(
                        "username",
                        data.username
                    );

                    // REDIRECT

                    window.location.href =
                        "index.html";

                } else {

                    alert(data.message);
                }

            } catch (error) {

                console.log(error);

                alert("Something went wrong ❌");
            }
        }
    );
}

// =========================
// LOGIN
// =========================

const loginForm =
    document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async (e) => {

            e.preventDefault();

            const email =
                document.getElementById("loginEmail").value;

            const password =
                document.getElementById("loginPassword").value;

            try {

                const response =
                    await fetch(
                        "http://localhost:5000/api/auth/login",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({

                                email,
                                password

                            })
                        }
                    );

                const data =
                    await response.json();

                if (response.ok) {
                    localStorage.setItem("token", data.token);
                    localStorage.setItem("username", data.username);

                   alert("Login Successful ✅");
                    
                   window.location.href = "index.html";

                    // SAVE TOKEN

                    localStorage.setItem(
                        "token",
                        data.token
                    );

                    localStorage.setItem(
                        "username",
                        data.username
                    );

                    // REDIRECT

                    window.location.href =
                        "index.html";

                } else {

                    alert(data.message);
                }

            } catch (error) {

                console.log(error);

                alert("Something went wrong ❌");
            }
        }
    );
}