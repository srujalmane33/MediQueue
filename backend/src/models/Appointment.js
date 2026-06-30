import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    appointmentDate: {
      type: String, // Stored as YYYY-MM-DD for easy daily grouping
      required: true,
    },
    timeSlot: {
      type: String, // e.g. "10:00 AM", "11:30 AM"
      required: true,
    },
    symptoms: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed", "cancelled"],
      default: "pending",
    },
    queuePosition: {
      type: Number,
      required: true,
    },
    queueNumber: {
      type: Number,
    },
    hospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospital",
    },
    estimatedWaitingTime: {
      type: Number,
      default: 0,
    },
    checkedIn: {
      type: Boolean,
      default: false,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Appointment", appointmentSchema);
