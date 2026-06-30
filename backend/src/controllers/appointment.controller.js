import Appointment from "../models/Appointment.js";
import Doctor from "../models/Doctor.js";
import { emitQueueUpdate } from "../utils/socket.js";

// Book a new appointment
export const bookAppointment = async (req, res) => {
  try {
    const { doctorId, appointmentDate, timeSlot, symptoms, hospitalId } = req.body;

    if (!doctorId || !appointmentDate || !timeSlot) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    // Verify doctor exists
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    // Calculate queue position: number of appointments for this doctor on this day
    const appointmentCount = await Appointment.countDocuments({
      doctor: doctorId,
      appointmentDate: appointmentDate,
    });

    const queuePosition = appointmentCount + 1;

    const appointment = await Appointment.create({
      patient: req.user._id,
      doctor: doctorId,
      appointmentDate,
      timeSlot,
      symptoms,
      queuePosition,
      queueNumber: queuePosition,
      hospital: hospitalId || null,
    });

    // Real-time broadcast: inform listeners that queue has changed
    emitQueueUpdate(doctorId, {
      action: "appointment-booked",
      doctorId,
      queuePosition,
    });

    res.status(201).json({
      success: true,
      message: "Appointment booked successfully",
      appointment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get appointments for the logged-in patient
export const getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient: req.user._id })
      .populate({
        path: "doctor",
        populate: {
          path: "user",
          select: "name email phone",
        },
      })
      .sort({ createdAt: -1 });

    // For each appointment, calculate live queue status
    const enrichedAppointments = await Promise.all(
      appointments.map(async (appt) => {
        const docAppt = appt.toObject();
        
        if (docAppt.status === "pending" || docAppt.status === "in-progress") {
          // Count active appointments ahead of this one
          const peopleAhead = await Appointment.countDocuments({
            doctor: docAppt.doctor._id,
            appointmentDate: docAppt.appointmentDate,
            status: { $in: ["pending", "in-progress"] },
            queuePosition: { $lt: docAppt.queuePosition },
          });
          
          docAppt.peopleAhead = peopleAhead;
          docAppt.estimatedWaitTime = peopleAhead * 15; // 15 mins per patient
        } else {
          docAppt.peopleAhead = 0;
          docAppt.estimatedWaitTime = 0;
        }
        
        return docAppt;
      })
    );

    res.status(200).json({
      success: true,
      appointments: enrichedAppointments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get appointments for the logged-in doctor
export const getDoctorAppointments = async (req, res) => {
  try {
    // Find the doctor profile associated with logged in user
    const doctor = await Doctor.findOne({ user: req.user._id });
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor profile not found",
      });
    }

    const appointments = await Appointment.find({ doctor: doctor._id })
      .populate("patient", "name email phone")
      .sort({ appointmentDate: 1, queuePosition: 1 });

    res.status(200).json({
      success: true,
      appointments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update appointment status (for Patients, Doctors, and Admins)
export const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["pending", "in-progress", "completed", "cancelled"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    // Role-based permissions validation
    if (req.user.role === "patient") {
      // Patients can only cancel their own bookings
      if (appointment.patient.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: "Forbidden: You do not own this appointment",
        });
      }
      if (status !== "cancelled") {
        return res.status(403).json({
          success: false,
          message: "Forbidden: Patients can only cancel appointments",
        });
      }
    } else if (req.user.role === "doctor") {
      // Verify doctor owns the appointment
      const doctor = await Doctor.findOne({ user: req.user._id });
      if (!doctor || appointment.doctor.toString() !== doctor._id.toString()) {
        return res.status(403).json({
          success: false,
          message: "Forbidden: You are not the assigned doctor for this appointment",
        });
      }
    } else if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Unauthorized access role",
      });
    }

    appointment.status = status;
    if (status === "completed") {
      appointment.completed = true;
    }
    await appointment.save();

    // Broadcast queue update to all watching patients
    emitQueueUpdate(appointment.doctor, {
      action: "queue-updated",
      doctorId: appointment.doctor,
      status,
      appointmentId: id,
    });

    res.status(200).json({
      success: true,
      message: `Appointment status updated to ${status}`,
      appointment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
