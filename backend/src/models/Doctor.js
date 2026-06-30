import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    specialization: {
      type: String,
      required: true,
    },

    qualification: {
      type: String,
      required: true,
    },

    experience: {
      type: Number,
      default: 0,
    },

    consultationFee: {
      type: Number,
      default: 0,
    },

    hospital: {
      type: String,
      default: "MediQueue Hospital",
    },

    available: {
      type: Boolean,
      default: true,
    },

    about: {
      type: String,
    },

    currentPatients: {
      type: Number,
      default: 0,
    },

    maxPatients: {
      type: Number,
      default: 20,
    },

    rating: {
      type: Number,
      default: 4.8,
    },

    totalReviews: {
      type: Number,
      default: 1,
    },

    timings: {
      type: [String],
      default: ["09:00 AM - 12:00 PM", "02:00 PM - 05:00 PM"],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Doctor", doctorSchema);