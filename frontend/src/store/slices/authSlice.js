import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginUser, registerUser, getProfile } from "../../services/authService";
import { loginDoctor, registerDoctor, getDoctorProfile } from "../../services/DoctorService";

export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await loginUser(credentials);
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", "patient");
      return { user: data.user, token: data.token, role: "patient" };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const data = await registerUser(userData);
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", "patient");
      return { user: data.user, token: data.token, role: "patient" };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Registration failed");
    }
  }
);

export const loginDoc = createAsyncThunk(
  "auth/loginDoc",
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await loginDoctor(credentials);
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", "doctor");
      return { user: data.user, doctor: data.doctor, token: data.token, role: "doctor" };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Doctor login failed");
    }
  }
);

export const registerDoc = createAsyncThunk(
  "auth/registerDoc",
  async (doctorData, { rejectWithValue }) => {
    try {
      const data = await registerDoctor(doctorData);
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", "doctor");
      return { user: data.user, doctor: data.doctor, token: data.token, role: "doctor" };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Doctor registration failed");
    }
  }
);

export const loadUser = createAsyncThunk(
  "auth/loadUser",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");
      if (!token) return null;

      if (role === "doctor") {
        const data = await getDoctorProfile(token);
        return { user: data.doctor.user, doctor: data.doctor, role: "doctor", token };
      } else {
        const data = await getProfile(token);
        return { user: data.user, doctor: null, role: "patient", token };
      }
    } catch (err) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      return rejectWithValue(err.response?.data?.message || "Failed to load session");
    }
  }
);

const initialState = {
  user: null,
  doctor: null,
  token: localStorage.getItem("token") || null,
  role: localStorage.getItem("role") || null,
  isAuthenticated: false,
  loading: true,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      state.user = null;
      state.doctor = null;
      state.token = null;
      state.role = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Patient Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.role = action.payload.role;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Patient Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.role = action.payload.role;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Doctor Login
      .addCase(loginDoc.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginDoc.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.doctor = action.payload.doctor;
        state.token = action.payload.token;
        state.role = action.payload.role;
      })
      .addCase(loginDoc.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Doctor Register
      .addCase(registerDoc.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerDoc.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.doctor = action.payload.doctor;
        state.token = action.payload.token;
        state.role = action.payload.role;
      })
      .addCase(registerDoc.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Load User Session
      .addCase(loadUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.isAuthenticated = true;
          state.user = action.payload.user;
          state.doctor = action.payload.doctor;
          state.role = action.payload.role;
          state.token = action.payload.token;
        } else {
          state.isAuthenticated = false;
          state.user = null;
          state.doctor = null;
          state.role = null;
          state.token = null;
        }
      })
      .addCase(loadUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.doctor = null;
        state.role = null;
        state.token = null;
        state.error = action.payload;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
