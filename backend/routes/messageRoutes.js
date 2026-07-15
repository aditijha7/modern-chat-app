const express = require("express");

const router = express.Router();

const {
    sendMessage,
    getMessages,
    markSeen
} = require("../controllers/messageController");


// SEND MESSAGE
router.post("/send", sendMessage);


// GET MESSAGES
router.get("/:senderId/:receiverId", getMessages);


// MARK MESSAGES AS SEEN
router.put("/seen", markSeen);

router.put("/seen", markSeen);
module.exports = router;