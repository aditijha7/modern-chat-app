const multer = require("multer");
const path = require("path");

// Storage
const storage = multer.diskStorage({

    destination: (req, file, cb) => {

        cb(null, "uploads/");

    },

    filename: (req, file, cb) => {

        cb(
            null,
            Date.now() + path.extname(file.originalname)
        );

    }

});

// File Filter
const fileFilter = (req, file, cb) => {

    cb(null, true);

};

const upload = multer({

    storage,
    fileFilter

});

module.exports = upload;