import api from "../utils/axios";

// Book a new appointment
export const bookNewAppointment = async (appointmentData) => {
  const response = await api.post("/appointments/book", appointmentData);
  return response.data;
};

// Get patient's own appointments
export const fetchPatientAppointments = async () => {
  const response = await api.get("/appointments/my");
  return response.data;
};

// Get doctor's own appointments
export const fetchDocAppointments = async () => {
  const response = await api.get("/appointments/doctor");
  return response.data;
};

// Update status of an appointment
export const patchAppointmentStatus = async (id, status) => {
  const response = await api.patch(`/appointments/${id}/status`, { status });
  return response.data;
};
