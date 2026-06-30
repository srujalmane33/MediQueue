import User from "../models/User.js";
import Doctor from "../models/Doctor.js";
import generateToken from "../utils/generateToken.js";

export const registerDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      specialization,
      qualification,
      experience,
      consultationFee,
      about,
    } = req.body;

    const exists = await User.findOne({ email });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Doctor already exists",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: "doctor",
    });

    const doctor = await Doctor.create({
      user: user._id,
      specialization,
      qualification,
      experience,
      consultationFee,
      about,
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: "Doctor registered successfully",
      token,
      user,
      doctor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const doctorLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user || user.role !== "doctor") {
      return res.status(401).json({
        success: false,
        message: "Doctor not found",
      });
    }

    const match = await user.comparePassword(password);

    if (!match) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const doctor = await Doctor.findOne({
      user: user._id,
    });

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
       
      message:"doctor Login successfull"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



export const doctorProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({
      user: req.user._id,
    }).populate("user", "-password");

    res.json({
      success: true,
      doctor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};