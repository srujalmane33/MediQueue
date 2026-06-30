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
    }).populate("user", "-password");

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isSuspended: user.isSuspended,
      },
      doctor,
      message: "doctor Login successfull"
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





// import Doctor from "../models/Doctor.js";

// Get all doctors
export const getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find().populate(
      "user",
      "name email phone"
    );

    res.status(200).json({
      success: true,
      count: doctors.length,
      doctors,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get single doctor
export const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate(
      "user",
      "name email phone"
    );

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    res.status(200).json({
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

// Update doctor availability (real-time broadcast)
import { emitDoctorAvailability } from "../utils/socket.js";

export const updateDoctorAvailability = async (req, res) => {
  try {
    const { available } = req.body;

    const doctor = await Doctor.findOne({ user: req.user._id });
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor profile not found",
      });
    }

    doctor.available = available;
    await doctor.save();

    // Broadcast live availability change
    emitDoctorAvailability(doctor._id, available);

    res.status(200).json({
      success: true,
      message: `Availability updated to ${available ? "online" : "offline"}`,
      doctor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update doctor profile (timings, fee, details)
export const updateDoctorProfile = async (req, res) => {
  try {
    const { specialization, qualification, experience, consultationFee, about, timings, maxPatients } = req.body;

    const doctor = await Doctor.findOne({ user: req.user._id });
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor profile not found",
      });
    }

    if (specialization) doctor.specialization = specialization;
    if (qualification) doctor.qualification = qualification;
    if (experience !== undefined) doctor.experience = Number(experience);
    if (consultationFee !== undefined) doctor.consultationFee = Number(consultationFee);
    if (about !== undefined) doctor.about = about;
    if (timings) doctor.timings = timings;
    if (maxPatients !== undefined) doctor.maxPatients = Number(maxPatients);

    await doctor.save();

    res.status(200).json({
      success: true,
      message: "Doctor profile updated successfully",
      doctor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};