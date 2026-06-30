import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import DashboardLayout from "../layout/DashboardLayout";
import { getMyAppointments } from "../store/slices/appointmentsSlice";
import {
  Calendar,
  Clock,
  UserCheck,
  PlusCircle,
  Stethoscope,
  ChevronRight,
  TrendingUp
} from "lucide-react";

function PatientProfile() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { appointments, loading: apptsLoading } = useSelector((state) => state.appointments);

  useEffect(() => {
    dispatch(getMyAppointments());
  }, [dispatch]);

  if (!user) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <h1 className="text-xl font-semibold text-slate-600 animate-pulse">Loading profile...</h1>
      </div>
    );
  }

  // Find next active appointment
  const activeAppts = appointments.filter(
    (appt) => appt.status === "pending" || appt.status === "in-progress"
  );
  
  // Sort by date to get the earliest next one
  const nextAppt = activeAppts.length > 0 
    ? [...activeAppts].sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate))[0]
    : null;

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-blue-900 bg-clip-text text-transparent">
          Welcome, {user.name} 👋
        </h1>
        <p className="text-slate-500 mt-2">
          Monitor your health bookings and active hospital queue status.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {/* Total Appointments */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 transition-all duration-250 hover:shadow-md hover:-translate-y-0.5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Appointments</p>
              <h3 className="text-3xl font-bold mt-2 text-slate-800">{appointments.length}</h3>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <Calendar className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs text-slate-500 gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
            <span>Active: {activeAppts.length} pending</span>
          </div>
        </div>

        {/* Queue Position */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 transition-all duration-250 hover:shadow-md hover:-translate-y-0.5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Queue Position</p>
              <h3 className="text-3xl font-bold mt-2 text-slate-800">
                {nextAppt ? `#${nextAppt.queuePosition}` : "--"}
              </h3>
            </div>
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
              <UserCheck className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 text-xs text-slate-500">
            {nextAppt ? (
              <span>People ahead: <strong className="text-indigo-600">{nextAppt.peopleAhead} patients</strong></span>
            ) : (
              <span>No active bookings</span>
            )}
          </div>
        </div>

        {/* Estimated Wait Time */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 transition-all duration-250 hover:shadow-md hover:-translate-y-0.5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Waiting Time</p>
              <h3 className="text-3xl font-bold mt-2 text-slate-800">
                {nextAppt ? `${nextAppt.estimatedWaitTime} min` : "--"}
              </h3>
            </div>
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
              <Clock className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 text-xs text-slate-500">
            {nextAppt ? (
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                <span>Live crowd calculation</span>
              </span>
            ) : (
              <span>Queue is clear</span>
            )}
          </div>
        </div>

        {/* User Role */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 transition-all duration-250 hover:shadow-md hover:-translate-y-0.5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Account Role</p>
              <h3 className="text-2xl font-bold mt-2 text-slate-800 capitalize">{user.role}</h3>
            </div>
            <div className="p-3 bg-teal-50 text-teal-600 rounded-xl">
              <Stethoscope className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 text-xs text-slate-500">
            <span>Verified patient account</span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 mt-6">
        {/* Profile Details Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 lg:col-span-2">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            Profile Information
          </h2>
          <div className="space-y-4 border-t border-slate-100 pt-4">
            <div className="flex justify-between py-2 border-b border-slate-50 text-sm">
              <span className="text-slate-400 font-medium">Full Name</span>
              <span className="text-slate-800 font-semibold">{user.name}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-50 text-sm">
              <span className="text-slate-400 font-medium">Email Address</span>
              <span className="text-slate-800 font-semibold">{user.email}</span>
            </div>
            <div className="flex justify-between py-2 text-sm">
              <span className="text-slate-400 font-medium">Phone Number</span>
              <span className="text-slate-800 font-semibold">{user.phone || "Not Provided"}</span>
            </div>
          </div>
        </div>

        {/* Quick Action Card */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl p-8 flex flex-col justify-between shadow-lg shadow-blue-500/20">
          <div>
            <h3 className="text-2xl font-bold mb-3">Need a Consultation?</h3>
            <p className="text-blue-100 text-sm leading-relaxed mb-6">
              Search for available specialist doctors, check their live wait times, and reserve your queue slot immediately.
            </p>
          </div>
          <Link
            to="/book"
            className="w-full bg-white text-blue-600 font-semibold py-3 px-4 rounded-xl shadow-md flex items-center justify-center gap-2 transition-all duration-200 hover:bg-blue-50 active:scale-98"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Book Appointment</span>
            <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default PatientProfile;
