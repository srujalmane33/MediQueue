import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import DashboardLayout from "../layout/DashboardLayout";
import DoctorCard from "../components/DoctorCard";
import { fetchDoctors } from "../store/slices/doctorsSlice";

function Doctors() {
  const dispatch = useDispatch();
  const { doctors, loading, error } = useSelector((state) => state.doctors);

  useEffect(() => {
    dispatch(fetchDoctors());
  }, [dispatch]);

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-blue-900 bg-clip-text text-transparent">
          Our Specialist Doctors
        </h1>
        <p className="text-slate-500 mt-2">
          Browse through registered specialists and book queue appointments.
        </p>
      </div>

      {loading && doctors.length === 0 ? (
        <div className="py-20 text-center text-slate-400">Loading specialist list...</div>
      ) : error ? (
        <div className="py-20 text-center text-red-500 font-semibold">{error}</div>
      ) : doctors.length === 0 ? (
        <div className="py-20 text-center text-slate-400">No doctors registered yet.</div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doctor) => (
            <DoctorCard
              key={doctor._id}
              doctor={doctor}
            />
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}

export default Doctors;