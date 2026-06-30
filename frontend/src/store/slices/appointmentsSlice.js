import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  bookNewAppointment,
  fetchPatientAppointments,
  fetchDocAppointments,
  patchAppointmentStatus,
} from "../../services/appointmentService";

export const getMyAppointments = createAsyncThunk(
  "appointments/fetchMy",
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchPatientAppointments();
      return data.appointments;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch your appointments");
    }
  }
);

export const getDoctorAppointments = createAsyncThunk(
  "appointments/fetchDoctor",
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchDocAppointments();
      return data.appointments;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch doctor appointments");
    }
  }
);

export const bookAppointment = createAsyncThunk(
  "appointments/book",
  async (appointmentData, { rejectWithValue }) => {
    try {
      const data = await bookNewAppointment(appointmentData);
      return data.appointment;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to book appointment");
    }
  }
);

export const updateAppointmentStatus = createAsyncThunk(
  "appointments/updateStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const data = await patchAppointmentStatus(id, status);
      return data.appointment;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update appointment status");
    }
  }
);

const initialState = {
  appointments: [],
  loading: false,
  error: null,
  bookingSuccess: false,
};

const appointmentsSlice = createSlice({
  name: "appointments",
  initialState,
  reducers: {
    resetBookingSuccess: (state) => {
      state.bookingSuccess = false;
    },
    clearAppointmentsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Patient Appointments
      .addCase(getMyAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments = action.payload;
      })
      .addCase(getMyAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Doctor Appointments
      .addCase(getDoctorAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDoctorAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments = action.payload;
      })
      .addCase(getDoctorAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Book Appointment
      .addCase(bookAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.bookingSuccess = false;
      })
      .addCase(bookAppointment.fulfilled, (state, action) => {
        state.loading = false;
        state.bookingSuccess = true;
        state.appointments.unshift(action.payload);
      })
      .addCase(bookAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.bookingSuccess = false;
      })

      // Update Appointment Status
      .addCase(updateAppointmentStatus.fulfilled, (state, action) => {
        const updated = action.payload;
        state.appointments = state.appointments.map((appt) =>
          appt._id === updated._id ? { ...appt, status: updated.status } : appt
        );
      });
  },
});

export const { resetBookingSuccess, clearAppointmentsError } = appointmentsSlice.actions;
export default appointmentsSlice.reducer;
