const userSchema = require("../models/UserModel");

async function getUsers(req, res) {
  const UsersData = await userSchema.find();
  res.json({
    status: "success",
    data: UsersData,
  });
}

async function getOneUser(req, res, next) {
  try {
    const Userid = req.params.id;
    const UserData = await userSchema.findById(Userid);
    res.json({
      status: "success",
      data: UserData,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
}

/* async function deleteUser(req, res, next) {
  try {
    const Userid = req.params.id;
    const Userdata = await userSchema.findOneAndDelete(Userid);
    res.json({
      status: "success",
      data: Userdata,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
} */

async function deleteUser(req, res, next) {
  try {
    const userId = req.params.id;
    const userData = await userSchema.findByIdAndDelete(userId);

    if (!userData) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }

    res.json({
      status: "success",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
}

async function UpdateUserData(req, res, next) {
  try {
    const Userid = req.params.id;
    const {
      fullName,
      email,
      role,
      gender,
      phone,
      status,
      password,
      passwordConfirm,
    } = req.body;
    const filename = req.filename;
    ///const { path } = req.file;

    const updatedData = {
      fullName,
      email,
      gender,
      phone,
      status,
      role,
      password,
      passwordConfirm,
    };

    if (filename) {
      updatedData.image = filename;
    }

    const Userdata = await userSchema.findByIdAndUpdate(Userid, updatedData, {
      new: true,
    });

    res.status(201).json({
      status: "success",
      data: {
        Userdata,
      },
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
}

module.exports = {
  getOneUser,
  getUsers,
  deleteUser,
  UpdateUserData,
};
