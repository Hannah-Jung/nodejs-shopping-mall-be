const User = require("../models/User");
const bcrypt = require("bcryptjs");
const userController = {};

userController.createUser = async (req, res) => {
  try {
    const email = req.body.email?.trim?.() ?? "";
    const password = req.body.password ?? "";
    const firstName = req.body.firstName?.trim?.() ?? "";
    const lastName = req.body.lastName?.trim?.() ?? "";
    const level = req.body.level;

    if (!email || !password || !firstName || !lastName) {
      return res
        .status(400)
        .json({ status: "fail", error: "All fields are required" });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ status: "fail", error: "Invalid email format" });
    }
    if (password.length < 3) {
      return res.status(400).json({
        status: "fail",
        error: "Password must be at least 3 characters",
      });
    }
    const user = await User.findOne({ email });
    if (user) {
      throw new Error("Email already exists");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      level: level ? level.trim() || "customer" : "customer",
    });
    await newUser.save();
    return res.status(200).json({ status: "success", data: newUser.toJSON() });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};
userController.getUser = async (req, res) => {
  try {
    const { userId } = req;
    const user = await User.findById(userId);
    if (user) {
      return res.status(200).json({ status: "success", user });
    }
    throw new Error("Invalid Token");
  } catch (error) {
    res.status(400).json({ status: "error", error: error.message });
  }
};

module.exports = userController;
