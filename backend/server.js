const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { Server } = require("socket.io");

const connectDB = require("./config/db");

dotenv.config();

connectDB();

const app = express();

// MIDDLEWARES

app.use(cors());
app.use(express.json());

// ROUTES

app.use(
    "/api/auth",
    require("./routes/authRoutes")
);
app.use(
    "/api/users",
    require("./routes/userRoutes")
);
app.use(
    "/api/messages",
    require("./routes/messageRoutes")
);

// TEST ROUTE

app.get("/", (req, res) => {
    res.send("Chat Server Running 🚀");
});

// SERVER

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

io.on("connection", (socket) => {

    console.log("User Connected:", socket.id);
    
    socket.on("sendMessage", (message) => {

    io.emit("receiveMessage", message);

});

    socket.on("disconnect", () => {

        console.log("User Disconnected:", socket.id);

    });

});