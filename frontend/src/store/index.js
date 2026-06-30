import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import doctorsReducer from "./slices/doctorsSlice";
import appointmentsReducer from "./slices/appointmentsSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    doctors: doctorsReducer,
    appointments: appointmentsReducer,
  },
});

export default store;
