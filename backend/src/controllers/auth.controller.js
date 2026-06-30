import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

export const register = async (req, res) => {
  try {
    console.log("Body:", req.body);

    const { name, email, password, phone } = req.body;

    const existingUser = await User.findOne({ email });
    console.log("Checked existing user");

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    console.log("Creating user...");

    const user = await User.create({
      name,
      email,
      password,
      phone,
    });

    console.log("User created");

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user,
    });
  } catch (error) {
    console.error("REGISTER ERROR:");
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
      stack: error.stack,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: "Login successful",
      token,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const profile = async (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
};