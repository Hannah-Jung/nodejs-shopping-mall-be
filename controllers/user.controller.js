const User = require("../models/User");
const bcrypt = require("bcryptjs");

const userController = {};
userController.createUser = async (req, res) => {
  try {
    const { email, password, name, level } = req.body;
    if (!email || !password || !name) {
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
    if (password.length < 6) {
      return res
        .status(400)
        .json({
          status: "fail",
          error: "Password must be at least 6 characters",
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
      name,
      level: level || "customer",
    });
    await newUser.save();
    return res.status(200).json({ status: "success", data: newUser.toJSON() });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

module.exports = userController;
