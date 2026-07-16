const Message = require("../models/Message");

// SEND MESSAGE
const sendMessage = async (req, res) => {

    console.log(req.body);

    try {

        const { senderId, receiverId, text } = req.body;

            let file = "";

            if (req.file) {

                file = req.file.filename;

            }
        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            file,
            delivered: true,
            seen: false
        });

        await newMessage.save();
await newMessage.save();

console.log("MESSAGE SAVED:");
console.log(newMessage);

res.status(201).json({
    success: true,
    message: newMessage
});

    }  catch (error) {

    console.log("UPLOAD ERROR:");
    console.log(error);

    res.status(500).json({
        success: false,
        message: error.message
    });

}

};


// GET MESSAGES
const getMessages = async (req, res) => {

    console.log(req.params);

    try {

        const { senderId, receiverId } = req.params;

        const messages = await Message.find({
            $or: [
                {
                    senderId,
                    receiverId
                },
                {
                    senderId: receiverId,
                    receiverId: senderId
                }
            ]
        }).sort({ createdAt: 1 });

        res.status(200).json({
            success: true,
            messages
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


// MARK MESSAGES AS SEEN
const markMessagesSeen = async (req, res) => {

    try {

        const { senderId, receiverId } = req.body;

        await Message.updateMany(
            {
                senderId,
                receiverId,
                seen: false
            },
            {
                seen: true
            }
        );

        res.status(200).json({
            success: true,
            message: "Messages marked as seen"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

// MARK MESSAGES AS SEEN

const markSeen = async (req, res) => {

    try {

        const { senderId, receiverId } = req.body;

        await Message.updateMany(
            {
                senderId,
                receiverId,
                seen: false
            },
            {
                seen: true
            }
        );

        res.json({
            success: true
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

module.exports = {
    sendMessage,
    getMessages,
    markSeen
};