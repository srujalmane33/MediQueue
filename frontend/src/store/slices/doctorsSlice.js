import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getDoctors, getDoctor } from "../../services/DoctorService";

export const fetchDoctors = createAsyncThunk(
  "doctors/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getDoctors();
      return data.doctors;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch doctors");
    }
  }
);

export const fetchDoctorById = createAsyncThunk(
  "doctors/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const data = await getDoctor(id);
      return data.doctor;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch doctor profile");
    }
  }
);

const initialState = {
  doctors: [],
  currentDoctor: null,
  loading: false,
  error: null,
};

const doctorsSlice = createSlice({
  name: "doctors",
  initialState,
  reducers: {
    clearCurrentDoctor: (state) => {
      state.currentDoctor = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Doctors
      .addCase(fetchDoctors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDoctors.fulfilled, (state, action) => {
        state.loading = false;
        state.doctors = action.payload;
      })
      .addCase(fetchDoctors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Doctor By ID
      .addCase(fetchDoctorById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDoctorById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentDoctor = action.payload;
      })
      .addCase(fetchDoctorById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCurrentDoctor } = doctorsSlice.actions;
export default doctorsSlice.reducer;
