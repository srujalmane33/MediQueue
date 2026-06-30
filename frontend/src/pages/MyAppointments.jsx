import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import DashboardLayout from "../layout/DashboardLayout";
import { getMyAppointments, updateAppointmentStatus } from "../store/slices/appointmentsSlice";
import { Calendar, Clock, UserCheck, Trash2, ArrowRight, User } from "lucide-react";
import { subscribeToDoctorQueue, unsubscribeFromDoctorQueue } from "../utils/socket";

function MyAppointments() {
  const dispatch = useDispatch();
  const { appointments, loading } = useSelector((state) => state.appointments);

  useEffect(() => {
    dispatch(getMyAppointments());
  }, [dispatch]);

  // Real-time socket queue monitoring
  useEffect(() => {
    const activeDoctors = [
      ...new Set(
        appointments
          .filter((a) => a.status === "pending" || a.status === "in-progress")
          .map((a) => a.doctor?._id)
          .filter(Boolean)
      ),
    ];

    activeDoctors.forEach((docId) => {
      subscribeToDoctorQueue(docId, (data) => {
        console.log("Queue shifted live:", data);
        dispatch(getMyAppointments());
      });
    });

    return () => {
      activeDoctors.forEach((docId) => {
        unsubscribeFromDoctorQueue(docId);
      });
    };
  }, [appointments, dispatch]);

  const handleCancelAppointment = async (id) => {
    if (window.confirm("Are you sure you want to cancel this appointment?")) {
      try {
        const actionResult = await dispatch(updateAppointmentStatus({ id, status: "cancelled" }));
        if (updateAppointmentStatus.fulfilled.match(actionResult)) {
          toast.success("Appointment cancelled successfully");
          // Refresh list to update queue positions of other active appointments
          dispatch(getMyAppointments());
        } else {
          toast.error("Failed to cancel appointment");
        }
      } catch (err) {
        toast.error("An error occurred");
      }
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "in-progress":
        return (
          <span className="px-3 py-1 text-xs font-bold uppercase rounded-full bg-amber-50 text-amber-700 border border-amber-200 animate-pulse">
            In Consultation
          </span>
        );
      case "completed":
        return (
          <span className="px-3 py-1 text-xs font-bold uppercase rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            Completed
          </span>
        );
      case "cancelled":
        return (
          <span className="px-3 py-1 text-xs font-bold uppercase rounded-full bg-red-50 text-red-700 border border-red-200">
            Cancelled
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 text-xs font-bold uppercase rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            Pending Queue
          </span>
        );
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-blue-900 bg-clip-text text-transparent">
            My Appointments
          </h1>
          <p className="text-slate-500 mt-2">
            Track your appointments and monitor the active queue positions in real-time.
          </p>
        </div>
        <Link
          to="/book"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-5 rounded-xl shadow-md text-sm transition-all duration-200"
        >
          Book New
        </Link>
      </div>

      {loading && appointments.length === 0 ? (
        <div className="py-20 text-center text-slate-400">Loading appointments...</div>
      ) : appointments.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-2xl p-12 text-center shadow-sm max-w-lg mx-auto mt-10">
          <Calendar className="w-12 h-12 text-blue-100 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-800">No appointments found</h3>
          <p className="text-slate-500 text-sm mt-2 max-w-sm mx-auto">
            You haven't reserved any consultation slots yet. Get started by selecting your preferred doctor now.
          </p>
          <Link
            to="/book"
            className="inline-flex items-center gap-2 mt-6 bg-blue-600 text-white font-semibold py-2.5 px-6 rounded-xl hover:bg-blue-700 transition-colors shadow-md"
          >
            <span>Book First Appointment</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {appointments.map((appt) => {
            const isActive = appt.status === "pending" || appt.status === "in-progress";
            return (
              <div
                key={appt._id}
                className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col justify-between transition-all duration-250 hover:shadow-md hover:-translate-y-0.5"
              >
                {/* Upper Body */}
                <div className="p-6 border-b border-slate-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-slate-800 text-lg">
                        {appt.doctor?.user?.name || "Practitioner"}
                      </h4>
                      <p className="text-sm text-blue-600 font-semibold mt-0.5">
                        {appt.doctor?.specialization || "Specialist"}
                      </p>
                    </div>
                    {getStatusBadge(appt.status)}
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-6 text-xs text-slate-500">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <span>{appt.appointmentDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <span>{appt.timeSlot}</span>
                    </div>
                  </div>

                  {appt.symptoms && (
                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 mt-4 text-xs">
                      <p className="text-slate-400 font-semibold">Symptoms Description:</p>
                      <p className="text-slate-600 mt-1 italic">"{appt.symptoms}"</p>
                    </div>
                  )}
                </div>

                {/* Queue Tracking Area */}
                {isActive && (
                  <div className="bg-blue-50/40 p-5 border-b border-slate-50">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-blue-800 bg-blue-100 px-2.5 py-1 rounded-lg">
                        Token #{appt.queuePosition}
                      </span>
                      <span className="text-slate-500">
                        {appt.peopleAhead === 0 ? (
                          <strong className="text-emerald-600">You are next!</strong>
                        ) : (
                          <span>
                            <strong>{appt.peopleAhead}</strong> patients ahead
                          </span>
                        )}
                      </span>
                    </div>

                    {/* Progress indicator bar */}
                    <div className="w-full bg-slate-200 h-2 rounded-full mt-3.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          appt.status === "in-progress" ? "bg-amber-500 animate-pulse w-full" : "bg-blue-600"
                        }`}
                        style={{
                          width: appt.status === "in-progress" ? "100%" : `${Math.max(10, 100 - appt.peopleAhead * 20)}%`,
                        }}
                      ></div>
                    </div>

                    <div className="mt-3 flex justify-between items-center text-xs text-slate-400">
                      <span>Est. Wait Time:</span>
                      <strong className="text-slate-700">
                        {appt.status === "in-progress" ? "Ongoing consultation" : `${appt.estimatedWaitTime} mins`}
                      </strong>
                    </div>
                  </div>
                )}

                {/* Lower Actions */}
                <div className="p-4 bg-slate-50/50 flex justify-end">
                  {appt.status === "pending" ? (
                    <button
                      onClick={() => handleCancelAppointment(appt._id)}
                      className="flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-700 border border-red-200 hover:bg-red-50 py-2 px-4 rounded-xl transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Cancel Booking</span>
                    </button>
                  ) : (
                    <span className="text-xs text-slate-400 italic py-2">No actions available</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
}

export default MyAppointments;