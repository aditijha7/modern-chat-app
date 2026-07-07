const Message = require("../models/Message");


// SEND MESSAGE
const sendMessage = async (req, res) => {

    console.log(req.body);


    try {

        const { senderId, receiverId, text } = req.body;

        const newMessage = new Message({
            senderId,
            receiverId,
            text
        });

        await newMessage.save();

        res.status(201).json({
            success: true,
            message: newMessage
        });

    } catch (error) {

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


module.exports = {
    sendMessage,
    getMessages
};