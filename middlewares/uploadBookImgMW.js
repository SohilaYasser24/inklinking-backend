const express = require("express");
const multer = require("multer");
const router = express.Router();

const path = require("path");
const storage = multer.diskStorage({
  destination: function (req, res, cb) {
    cb(null, path.join(__dirname, "../Uploads/booksImgs"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    // store fullFileName in the request body:
    let filename = file.fieldname + "-" + uniqueSuffix + ".jpg";
    req.filename = filename;
    cb(null, filename);
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    const error = new AppError("Please upload an image", 400);
    error.statusCode = 400;
    cb(error, false);
  }
};

const upload = multer({ storage, fileFilter: multerFilter });

module.exports = upload;
