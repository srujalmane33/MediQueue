import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";

import DoctorLogin from "../pages/DoctorLogin";
import DoctorRegister from "../pages/DoctorRegister";

import PatientProfile from "../pages/PatientProfile";
import DoctorProfile from "../pages/DoctorProfile";
import AdminProfile from "../pages/AdminProfile";

import Doctors from "../pages/Doctors";
import BookAppointment from "../pages/BookAppointment";
import MyAppointments from "../pages/MyAppointments";

import ProtectedRoute from "../components/ProtectedRoute";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/doctor/login" element={<DoctorLogin />} />
      <Route path="/doctor/register" element={<DoctorRegister />} />

      {/* Patient Protected Routes */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute allowedRoles={["patient"]}>
            <PatientProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctors"
        element={
          <ProtectedRoute allowedRoles={["patient"]}>
            <Doctors />
          </ProtectedRoute>
        }
      />
      <Route
        path="/book"
        element={
          <ProtectedRoute allowedRoles={["patient"]}>
            <BookAppointment />
          </ProtectedRoute>
        }
      />
      <Route
        path="/appointments"
        element={
          <ProtectedRoute allowedRoles={["patient"]}>
            <MyAppointments />
          </ProtectedRoute>
        }
      />

      {/* Doctor Protected Routes */}
      <Route
        path="/doctor/profile"
        element={
          <ProtectedRoute allowedRoles={["doctor"]}>
            <DoctorProfile />
          </ProtectedRoute>
        }
      />

      {/* Admin Protected Routes */}
      <Route
        path="/admin/profile"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminProfile />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default AppRoutes;
