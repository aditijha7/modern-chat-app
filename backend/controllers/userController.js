const User = require("../models/User");

// GET ALL USERS
const getAllUsers = async (req, res) => {

    try {

        const users = await User.find().select("-password");

        res.status(200).json({
            success: true,
            users
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


// UPLOAD PROFILE PICTURE
const uploadProfilePicture = async (req, res) => {

    try {

        const { userId } = req.body;

        if (!req.file) {

            return res.status(400).json({
                success: false,
                message: "No image selected"
            });

        }

        const user = await User.findById(userId);

        if (!user) {

            return res.status(404).json({
                success: false,
                message: "User not found"
            });

        }

        user.profilePic = req.file.filename;

        await user.save();

        res.status(200).json({
            success: true,
            profilePic: user.profilePic
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


// EXPORTS
module.exports = {
    getAllUsers,
    uploadProfilePicture
};