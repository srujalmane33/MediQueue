import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";

import DoctorLogin from "../pages/DoctorLogin";
import DoctorRegister from "../pages/DoctorRegister";

import PatientProfile from "../pages/PatientProfile";
import DoctorProfile from "../pages/DoctorProfile";

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
    </Routes>
  );
}

export default AppRoutes;