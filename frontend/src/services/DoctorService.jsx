import api from "../utils/axios";

// Register Doctor
export const registerDoctor = async (doctorData) => {
  const response = await api.post("/doctors/register", doctorData);
  return response.data;
};

// Login Doctor
export const loginDoctor = async (loginData) => {
  const response = await api.post("/doctors/login", loginData);
  return response.data;
};

// Doctor Profile
export const getDoctorProfile = async (token) => {
  const response = await api.get("/doctors/profile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// Get all doctors
export const getDoctors = async () => {
  const response = await api.get("/doctors");
  return response.data;
};

// Get single doctor
export const getDoctor = async (id) => {
  const response = await api.get(`/doctors/${id}`);
  return response.data;
};