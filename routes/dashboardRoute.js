const express = require("express");
const router = express.Router();

const usersController = require("../controllers/usersController");
const booksController = require("../controllers/booksController");
const authMW = require("../middlewares/authMW");
const uplaodUserImgMW = require("../middlewares/uploadUserImgMW");
const uploadBookImgMW = require("../middlewares/uploadBookImgMW");

router
  .route("/books")
  .get(
    /* authMW.protect, authMW.restrictTo("admin"), */ booksController.getBook
  )
  .post(
    /* authMW.protect,
    authMW.restrictTo("admin"), */
    uploadBookImgMW.single("image"),
    booksController.createNewBook
  );

router
  .route("/books/:id")
  .get(
    /* authMW.protect, authMW.restrictTo("admin"), */ booksController.getOneBook
  )
  .put(
    /* authMW.protect,
    authMW.restrictTo("admin"), */
    uploadBookImgMW.single("image"),
    booksController.UpdateBookData
  )
  .delete(
    /* authMW.protect,
    authMW.restrictTo("admin"), */
    booksController.deleteBook
  );

router
  .route("/users")
  .get(
    /* authMW.protect, authMW.restrictTo("admin"), */ usersController.getUsers
  );

router
  .route("/users/:id")
  .get(
    /* authMW.protect, authMW.restrictTo("admin"), */ usersController.getOneUser
  )
  .put(
    /* authMW.protect,
    authMW.restrictTo("admin"), */
    uplaodUserImgMW.single("image"),
    usersController.UpdateUserData
  )
  .delete(
    /* authMW.protect,
    authMW.restrictTo("admin"), */
    usersController.deleteUser
  );

module.exports = router;
