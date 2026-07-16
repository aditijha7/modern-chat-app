const express = require("express");

const router = express.Router();
const upload = require("../middleware/upload");

const {
    sendMessage,
    getMessages,
    markSeen
} = require("../controllers/messageController");


// SEND MESSAGE
router.post("/send", (req, res, next) => {

    upload.single("file")(req, res, function (err) {

        if (err) {
            console.log("MULTER ERROR:", err);
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        console.log("REQ.FILE:", req.file);

        next();

    });

}, sendMessage);

// GET MESSAGES
router.get("/:senderId/:receiverId", getMessages);


// MARK MESSAGES AS SEEN
router.put("/seen", markSeen);

router.put("/seen", markSeen);
module.exports = router;