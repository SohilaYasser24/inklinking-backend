const authController = require("../controllers/authController");
const authMW = require("../middlewares/authMW");
const uploadUserImgMW = require("../middlewares/uploadUserImgMW");

const express = require("express");
const router = express.Router();

router.post("/signup", uploadUserImgMW.single("image"), authController.signUp);
router.post("/login", /* authMW.protect, */ authController.login);

module.exports = router;
