import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";

import DoctorLogin from "../pages/DoctorLogin";
import DoctorRegister from "../pages/DoctorRegister";

import PatientProfile from "../pages/PatientProfile";
import DoctorProfile from "../pages/DoctorProfile";

import Doctors from "../pages/Doctors";
import BookAppointment from "../pages/BookAppointment";
import MyAppointments from "../pages/MyAppointments";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/doctor/login" element={<DoctorLogin />} />
      <Route path="/doctor/register" element={<DoctorRegister />} />

      <Route path="/profile" element={<PatientProfile />} />
      <Route path="/doctor/profile" element={<DoctorProfile />} />

      <Route path="/doctors" element={<Doctors />} />

      <Route path="/book" element={<BookAppointment />} />

      <Route path="/appointments" element={<MyAppointments />} />
    </Routes>
  );
}

export default AppRoutes;
