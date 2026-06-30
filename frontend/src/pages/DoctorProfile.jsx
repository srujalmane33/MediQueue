import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import DashboardLayout from "../layout/DashboardLayout";
import { getDoctorAppointments, updateAppointmentStatus } from "../store/slices/appointmentsSlice";
import { getDoctorProfile } from "../services/DoctorService";
import { subscribeToDoctorQueue, unsubscribeFromDoctorQueue } from "../utils/socket";
import {
  Users,
  Activity,
  CheckCircle2,
  AlertCircle,
  Play,
  Check,
  X,
  Stethoscope,
  MapPin,
  IndianRupee,
  Briefcase
} from "lucide-react";

function DoctorProfile() {
  const dispatch = useDispatch();
  const { user, doctor } = useSelector((state) => state.auth);
  const { appointments, loading } = useSelector((state) => state.appointments);

  useEffect(() => {
    dispatch(getDoctorAppointments());
  }, [dispatch]);

  // Real-time Socket updates for doctor's own patient queue
  useEffect(() => {
    if (doctor?._id) {
      subscribeToDoctorQueue(doctor._id, (data) => {
        console.log("Live queue action detected:", data);
        dispatch(getDoctorAppointments());
      });
    }

    return () => {
      if (doctor?._id) {
        unsubscribeFromDoctorQueue(doctor._id);
      }
    };
  }, [doctor, dispatch]);

  const handleUpdateStatus = async (id, status) => {
    try {
      const actionResult = await dispatch(updateAppointmentStatus({ id, status }));
      if (updateAppointmentStatus.fulfilled.match(actionResult)) {
        toast.success(`Patient marked as ${status}`);
        // Refresh doctor's appointments to compute updated queue numbers
        dispatch(getDoctorAppointments());
      } else {
        toast.error("Failed to update status");
      }
    } catch (err) {
      toast.error("An error occurred");
    }
  };

  // Get local date string YYYY-MM-DD
  const todayDateStr = new Date().toLocaleDateString("en-CA");

  // Filters for stats
  const todayAppointments = appointments.filter((a) => a.appointmentDate === todayDateStr);
  const pendingCount = todayAppointments.filter((a) => a.status === "pending").length;
  const inProgressCount = todayAppointments.filter((a) => a.status === "in-progress").length;
  const completedCount = todayAppointments.filter((a) => a.status === "completed").length;

  // Group appointments into Today vs Upcoming
  const todayQueue = appointments.filter((a) => a.appointmentDate === todayDateStr);
  const upcomingQueue = appointments.filter((a) => a.appointmentDate !== todayDateStr && a.status === "pending");

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-blue-900 bg-clip-text text-transparent">
          Doctor Dashboard
        </h1>
        <p className="text-slate-500 mt-2">
          Manage your queue, view live statistics, and start patient consultations.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Patients Today</p>
            <h3 className="text-3xl font-bold mt-2 text-slate-800">{todayAppointments.length}</h3>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider">In Queue</p>
            <h3 className="text-3xl font-bold mt-2 text-slate-800">{pendingCount}</h3>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Activity className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider">In Progress</p>
            <h3 className="text-3xl font-bold mt-2 text-slate-800">{inProgressCount}</h3>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <Stethoscope className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Completed</p>
            <h3 className="text-3xl font-bold mt-2 text-slate-800">{completedCount}</h3>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left: Active Queue */}
        <div className="lg:col-span-2 space-y-8">
          {/* Today's Queue Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-ping"></span>
              <span>Today's Live Queue ({todayDateStr})</span>
            </h2>

            {loading && appointments.length === 0 ? (
              <p className="text-center py-10 text-slate-400">Loading queue...</p>
            ) : todayQueue.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <AlertCircle className="w-10 h-10 mx-auto text-slate-200 mb-3" />
                <p className="text-sm">No appointments scheduled for today.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {todayQueue.map((appt) => (
                  <div
                    key={appt._id}
                    className={`rounded-xl border p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all duration-200 ${
                      appt.status === "in-progress"
                        ? "border-indigo-200 bg-indigo-50/20 shadow-sm"
                        : appt.status === "completed"
                        ? "border-slate-100 bg-slate-50/50 opacity-60"
                        : "border-slate-100 bg-white"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Token badge */}
                      <span className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 font-extrabold flex flex-col justify-center items-center text-sm shadow-sm shrink-0 border border-blue-100">
                        <span className="text-[10px] uppercase font-semibold text-slate-400">Token</span>
                        <span className="mt-[-2px] text-base font-bold">#{appt.queuePosition}</span>
                      </span>

                      <div>
                        <h4 className="font-bold text-slate-800">{appt.patient?.name}</h4>
                        <div className="flex gap-4 text-xs text-slate-500 mt-1">
                          <span>Phone: {appt.patient?.phone}</span>
                          <span>Time: {appt.timeSlot}</span>
                        </div>
                        {appt.symptoms && (
                          <p className="text-xs mt-2 bg-slate-50 py-1.5 px-3 rounded-lg text-slate-600 border border-slate-100">
                            <strong>Symptoms:</strong> {appt.symptoms}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 self-end md:self-center">
                      {appt.status === "pending" && (
                        <>
                          <button
                            onClick={() => handleUpdateStatus(appt._id, "in-progress")}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-1.5 px-4 rounded-xl text-xs flex items-center gap-1 shadow-sm transition-all"
                          >
                            <Play className="w-3.5 h-3.5" />
                            <span>Start Consult</span>
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(appt._id, "cancelled")}
                            className="border border-red-200 text-red-600 hover:bg-red-50 font-semibold py-1.5 px-4 rounded-xl text-xs flex items-center gap-1 transition-all"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Cancel</span>
                          </button>
                        </>
                      )}

                      {appt.status === "in-progress" && (
                        <button
                          onClick={() => handleUpdateStatus(appt._id, "completed")}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-1.5 px-4 rounded-xl text-xs flex items-center gap-1 shadow-sm transition-all"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Complete Consultation</span>
                        </button>
                      )}

                      {appt.status === "completed" && (
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                          Completed
                        </span>
                      )}

                      {appt.status === "cancelled" && (
                        <span className="text-xs font-bold text-red-600 bg-red-50 px-3 py-1 rounded-full">
                          Cancelled
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upcoming Bookings */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-slate-400" />
              <span>Upcoming Appointments ({upcomingQueue.length})</span>
            </h2>

            {upcomingQueue.length === 0 ? (
              <p className="text-center py-6 text-slate-400 text-sm">No upcoming appointments.</p>
            ) : (
              <div className="divide-y divide-slate-100">
                {upcomingQueue.map((appt) => (
                  <div key={appt._id} className="py-4 flex justify-between items-center text-sm">
                    <div>
                      <p className="font-semibold text-slate-800">{appt.patient?.name}</p>
                      <p className="text-xs text-slate-400 mt-0.5">Date: {appt.appointmentDate} | Slot: {appt.timeSlot}</p>
                    </div>
                    <span className="px-2.5 py-1 text-[10px] font-bold uppercase rounded-lg bg-blue-50 text-blue-700">
                      Token #{appt.queuePosition}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar: Doctor Profile Details */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h3 className="text-xl font-bold text-slate-800 mb-6">Doctor Details</h3>

            {doctor ? (
              <div className="space-y-6">
                {/* Initial circle and brief */}
                <div className="flex flex-col items-center pb-6 border-b border-slate-100">
                  <div className="w-20 h-20 rounded-full bg-blue-600 text-white flex items-center justify-center font-extrabold text-3xl shadow-md mb-3">
                    {user?.name ? user.name.charAt(0).toUpperCase() : "Dr"}
                  </div>
                  <h4 className="font-bold text-slate-800 text-lg">Dr. {user?.name}</h4>
                  <p className="text-sm text-blue-600 font-semibold mt-0.5 capitalize">{doctor.specialization}</p>
                </div>

                {/* Details List */}
                <div className="space-y-4 text-sm text-slate-600">
                  <div className="flex items-center gap-3">
                    <Briefcase className="w-5 h-5 text-slate-400" />
                    <div>
                      <p className="text-[10px] uppercase font-semibold text-slate-400">Experience</p>
                      <p className="font-medium text-slate-800">{doctor.experience} Years Practice</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Stethoscope className="w-5 h-5 text-slate-400" />
                    <div>
                      <p className="text-[10px] uppercase font-semibold text-slate-400">Qualification</p>
                      <p className="font-medium text-slate-800">{doctor.qualification}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <IndianRupee className="w-5 h-5 text-slate-400" />
                    <div>
                      <p className="text-[10px] uppercase font-semibold text-slate-400">Consultation Fee</p>
                      <p className="font-medium text-slate-800">₹{doctor.consultationFee}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-slate-400" />
                    <div>
                      <p className="text-[10px] uppercase font-semibold text-slate-400">Clinic / Hospital</p>
                      <p className="font-medium text-slate-800">{doctor.hospital}</p>
                    </div>
                  </div>
                </div>

                {doctor.about && (
                  <div className="pt-4 border-t border-slate-100">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">About Professional</p>
                    <p className="text-xs text-slate-500 leading-relaxed italic">"{doctor.about}"</p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-slate-400">Loading doctor details...</p>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default DoctorProfile;