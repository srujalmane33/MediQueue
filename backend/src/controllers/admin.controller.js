import User from "../models/User.js";
import Doctor from "../models/Doctor.js";
import Appointment from "../models/Appointment.js";
import Hospital from "../models/Hospital.js";

// Guard helper to check if user is admin
const verifyAdmin = (req, res) => {
  if (!req.user || req.user.role !== "admin") {
    res.status(403).json({
      success: false,
      message: "Forbidden: Admin access only",
    });
    return false;
  }
  return true;
};

// Get admin dashboard stats
export const getAdminStats = async (req, res) => {
  if (!verifyAdmin(req, res)) return;

  try {
    const totalUsers = await User.countDocuments();
    const patientCount = await User.countDocuments({ role: "patient" });
    const doctorCount = await Doctor.countDocuments();
    const hospitalCount = await Hospital.countDocuments();
    const appointmentCount = await Appointment.countDocuments();
    
    // Status counts
    const completedAppts = await Appointment.countDocuments({ status: "completed" });
    const cancelledAppts = await Appointment.countDocuments({ status: "cancelled" });
    const activeAppts = await Appointment.countDocuments({ status: { $in: ["pending", "in-progress"] } });

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        patients: patientCount,
        doctors: doctorCount,
        hospitals: hospitalCount,
        appointments: appointmentCount,
        completed: completedAppts,
        cancelled: cancelledAppts,
        active: activeAppts,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all users
export const getAllUsers = async (req, res) => {
  if (!verifyAdmin(req, res)) return;

  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Suspend or unsuspend user
export const toggleSuspendUser = async (req, res) => {
  if (!verifyAdmin(req, res)) return;

  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.role === "admin") {
      return res.status(400).json({
        success: false,
        message: "Admins cannot be suspended",
      });
    }

    user.isSuspended = !user.isSuspended;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User account successfully ${user.isSuspended ? "suspended" : "activated"}`,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Create a new hospital
export const createHospital = async (req, res) => {
  if (!verifyAdmin(req, res)) return;

  try {
    const { name, address, departments } = req.body;
    
    if (!name || !address) {
      return res.status(400).json({
        success: false,
        message: "Please fill in hospital name and address",
      });
    }

    const hospital = await Hospital.create({
      name,
      address,
      departments: departments || [],
    });

    res.status(201).json({
      success: true,
      message: "Hospital created successfully",
      hospital,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all hospitals
export const getHospitals = async (req, res) => {
  try {
    const hospitals = await Hospital.find().sort({ name: 1 });
    res.status(200).json({
      success: true,
      hospitals,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update hospital departments
export const addDepartment = async (req, res) => {
  if (!verifyAdmin(req, res)) return;

  try {
    const { id } = req.params;
    const { department } = req.body;

    if (!department) {
      return res.status(400).json({
        success: false,
        message: "Department name is required",
      });
    }

    const hospital = await Hospital.findById(id);
    if (!hospital) {
      return res.status(404).json({
        success: false,
        message: "Hospital not found",
      });
    }

    if (hospital.departments.includes(department)) {
      return res.status(400).json({
        success: false,
        message: "Department already exists in this hospital",
      });
    }

    hospital.departments.push(department);
    await hospital.save();

    res.status(200).json({
      success: true,
      message: "Department added successfully",
      hospital,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
