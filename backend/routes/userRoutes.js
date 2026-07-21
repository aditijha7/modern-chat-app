const express = require("express");

const router = express.Router();

const {
    getAllUsers,
    uploadProfilePicture
} = require("../controllers/userController");

const upload = require("../middleware/upload");

// GET ALL USERS
router.get("/", getAllUsers);

// UPLOAD PROFILE PICTURE
router.put(
    "/profile-picture",
    upload.single("profilePic"),
    uploadProfilePicture
);

module.exports = router;