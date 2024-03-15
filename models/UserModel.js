const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "Name required"],
    minlength: 3,
    maxlength: 20,
    validate: {
      validator: (value) => /^[A-Z][a-z]* [A-Z][a-z]*$/.test(value),
      message:
        "Full name must contain a space and start with capitalized first and last name.",
    },
  },

  email: {
    type: String,
    required: [true, "Email required"],
    validate: [validator.isEmail, ""],
  },

  image: {
    type: String,
    default: "default.jpg",
  },

  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },

  gender: {
    type: String,
    enum: ["Male", "Female"],
  },

  phone: {
    type: String,
    validate: {
      validator: function (num) {
        return /^[0-9]{11}$/.test(num);
      },
      message: `phone number is not a valid!`,
    },
  },

  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  },

  password: {
    type: String,
    required: [true, "password required"],
    minlength: 8,
    validate: {
      validator: (value) =>
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/.test(
          value
        ),
      message:
        "Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character.",
    },
  },

  // passwordConfirm: {
  //   type: String,
  //   required: [true, "Please enter passwird again to confirm"],
  // },
});

userSchema.pre("save", async function (next) {
  try {
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
    next();
  } catch (err) {
    console.log(err);
    next(err);
  }
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
