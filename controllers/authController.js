const { promisify } = require("util");
const emailValidator = require("email-validator");
const validator = require("validator");

const User = require("../models/UserModel");
const jwt = require("jsonwebtoken");
const expressAsync = require("express-async-handler");
const AppError = require("../utils/appError");
const { error } = require("console");

const signToken = (id, fullName, email, image, role, status, password) => {
  return jwt.sign(
    { id, fullName, email, image, role, status, password },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );
};

exports.signUp = expressAsync(async (req, res, next) => {
  const existingUser = await User.findOne({ email: req.body.email });
  if (existingUser) {
    return res.status(400).json({
      message: new AppError(
        "Email is already in use. Please choose a different email.",
        400
      ),
    });
  }

  const {
    fullName,
    email,
    role,
    status,
    phone,
    password /* , passwordConfirm */,
  } = req.body;
  const filename = req.filename;

  // const { path } = req.file;

  if (!fullName || !email || !password /* || !passwordConfirm */) {
    return res.status(400).json({
      message: new AppError("Fields is required", 400),
    });
  }

  if (!/^[A-Z][a-z]* [A-Z][a-z]*$/.test(fullName)) {
    return res.status(400).json({
      message: new AppError(
        "Full name must contain a space and start with capitalized first and last name.",
        400
      ),
    });
  }

  if (!emailValidator.validate(email)) {
    return res.status(400).json({
      message: new AppError("Email format is not match", 400),
    });
  }

  if (
    !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/.test(
      password
    )
  ) {
    return res.status(400).json({
      message: new AppError(
        "Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character.",
        400
      ),
    });
  }

  const newUser = await User.create({
    fullName: fullName,
    email: email,
    image: filename,
    role: role,
    status: status,
    phone: phone,
    password: password,
    // passwordConfirm: passwordConfirm,
  });

  const token = signToken(
    newUser._id,
    newUser.fullName,
    newUser.email,
    newUser.image,
    newUser.role,
    newUser.status,
    newUser.phone,
    newUser.password
  );

  res.status(201).json({
    status: "success",
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = expressAsync(async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: new AppError("Please provide email and password!", 400),
      });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        message: new AppError("User not found", 401),
      });
    }

    const correct = await user.correctPassword(password, user.password);

    if (!correct) {
      return res.status(401).json({
        message: new AppError("Incorrect email or password!", 401),
      });
    }

    const token = signToken(
      user._id,
      user.fullName,
      user.email,
      user.image,
      user.role,
      user.status,
      user.phone,
      user.password
    );
    res.status(200).json({
      status: "success",
      token,
    });
  } catch (error) {
    console.log(error);

    if (error.name === "ValidationError") {
      const errorMessage = Object.values(error.errors).map(
        (err) => err.message
      );
      return next(new AppError(errorMessage, 400));
    } else {
      return next(error);
    }
  }
});
