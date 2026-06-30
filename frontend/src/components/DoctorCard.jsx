import { Link } from "react-router-dom";
import { Stethoscope, Clock, IndianRupee, MapPin } from "lucide-react";

function DoctorCard({ doctor }) {
  if (!doctor || !doctor.user) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex flex-col justify-between transition-all duration-250 hover:shadow-md hover:-translate-y-0.5">
      <div>
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Dr. {doctor.user.name}
            </h2>
            <p className="text-blue-600 font-semibold text-xs mt-1 uppercase tracking-wider">
              {doctor.specialization}
            </p>
          </div>
          <span
            className={`px-2.5 py-1 text-[10px] font-bold rounded-lg uppercase ${
              doctor.available
                ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                : "bg-rose-50 text-rose-700 border border-rose-100"
            }`}
          >
            {doctor.available ? "Available" : "Away"}
          </span>
        </div>

        <div className="mt-6 space-y-2.5 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Stethoscope className="w-4 h-4 text-slate-400" />
            <span>{doctor.qualification}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400" />
            <span>{doctor.experience} Years Experience</span>
          </div>
          <div className="flex items-center gap-2">
            <IndianRupee className="w-4 h-4 text-slate-400" />
            <span className="font-semibold text-slate-700">₹{doctor.consultationFee} Consultation Fee</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-slate-400" />
            <span>{doctor.hospital}</span>
          </div>
        </div>
      </div>

      <Link
        to="/book"
        className="block text-center mt-6 bg-blue-600 text-white font-semibold py-2.5 rounded-xl hover:bg-blue-700 transition-colors shadow-md text-sm"
      >
        Book Consultation
      </Link>
    </div>
  );
}

export default DoctorCard;