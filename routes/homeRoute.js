const express = require("express");
const router = express.Router();

const bookController = require("../controllers/booksController");
const authMW = require("../middlewares/authMW");

router.route("/").get(authMW.protect, bookController.getBook);

router.route("/:id").get(authMW.protect, bookController.getOneBook);

module.exports = router;
