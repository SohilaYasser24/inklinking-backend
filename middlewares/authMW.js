const { promisify, log } = require("util");
const emailValidator = require("email-validator");
const validator = require("validator");

const User = require("../models/UserModel");
const jwt = require("jsonwebtoken");
const expressAsync = require("express-async-handler");
const AppError = require("../utils/appError");
const { error } = require("console");

/* const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
}; */

exports.protect = expressAsync(async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return next(
        new AppError("You're not logged in! please login to get access", 401)
      );
    }

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    console.log(decoded);

    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(
        new AppError(
          "The user belonging to this token does no longer exist",
          401
        )
      );
    }

    if (currentUser.status === "inactive") {
      return next(
        new AppError("Your account is inactive. Please contact support", 401)
      );
    }

    req.user = currentUser;
    next();
  } catch (error) {
    if (error.name == "JsonWebTokenError") {
      return next(new AppError("Invalid token. Please log in again.", 401));
    } else {
      return next(error);
    }
  }
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        res.status(403).json({
          status: "fail",
          message: "You don't have permission to perform this action",
        })
      );
    }
    next();
  };
};
