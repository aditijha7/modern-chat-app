const express = require("express");

const router = express.Router();

const {
    sendMessage,
    getMessages
} = require("../controllers/messageController");


// SEND MESSAGE
router.post("/send", sendMessage);


// GET MESSAGES
router.get("/:senderId/:receiverId", getMessages);


module.exports = router;