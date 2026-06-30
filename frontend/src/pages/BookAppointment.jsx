import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import DashboardLayout from "../layout/DashboardLayout";
import { fetchDoctors } from "../store/slices/doctorsSlice";
import { bookAppointment, resetBookingSuccess } from "../store/slices/appointmentsSlice";
import { Calendar as CalendarIcon, Clock, ChevronRight, Stethoscope, Search, Sparkles, Brain, Award } from "lucide-react";

function BookAppointment() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { doctors, loading: docsLoading } = useSelector((state) => state.doctors);
  const { loading: bookingLoading, bookingSuccess } = useSelector((state) => state.appointments);

  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [specialtyFilter, setSpecialtyFilter] = useState("all");
  
  // AI Symptom analysis states
  const [symptomsInput, setSymptomsInput] = useState("");
  const [aiRecommendation, setAiRecommendation] = useState({ specialty: "", confidence: 0 });

  const [formData, setFormData] = useState({
    appointmentDate: "",
    timeSlot: "",
  });

  useEffect(() => {
    dispatch(fetchDoctors());
  }, [dispatch]);

  useEffect(() => {
    if (bookingSuccess) {
      toast.success("Appointment booked successfully! Redirecting to queue...");
      dispatch(resetBookingSuccess());
      navigate("/appointments");
    }
  }, [bookingSuccess, navigate, dispatch]);

  // Client-side AI symptom scanner
  useEffect(() => {
    const text = symptomsInput.toLowerCase();
    if (!text.trim()) {
      setAiRecommendation({ specialty: "", confidence: 0 });
      return;
    }

    const timer = setTimeout(() => {
      if (text.includes("heart") || text.includes("chest") || text.includes("cardiac") || text.includes("bp")) {
        setAiRecommendation({ specialty: "Cardiologist", confidence: 94 });
      } else if (text.includes("child") || text.includes("kid") || text.includes("baby") || text.includes("pediatric")) {
        setAiRecommendation({ specialty: "Pediatrician", confidence: 98 });
      } else if (text.includes("skin") || text.includes("rash") || text.includes("acne") || text.includes("itch")) {
        setAiRecommendation({ specialty: "Dermatologist", confidence: 90 });
      } else if (text.includes("bone") || text.includes("fracture") || text.includes("joint") || text.includes("jointpain") || text.includes("backpain")) {
        setAiRecommendation({ specialty: "Orthopedist", confidence: 85 });
      } else if (text.includes("brain") || text.includes("nerve") || text.includes("headache") || text.includes("migraine")) {
        setAiRecommendation({ specialty: "Neurologist", confidence: 80 });
      } else {
        setAiRecommendation({ specialty: "General Physician", confidence: 50 });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [symptomsInput]);

  const timeSlots = [
    "09:00 AM",
    "09:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "12:00 PM",
    "02:00 PM",
    "02:30 PM",
    "03:00 PM",
    "03:30 PM",
    "04:00 PM",
    "04:30 PM",
    "05:00 PM",
  ];

  const handleSelectDoctor = (doctor) => {
    setSelectedDoctor(doctor);
  };

  const handleTimeSlotSelect = (slot) => {
    setFormData({ ...formData, timeSlot: slot });
  };

  const handleDateChange = (e) => {
    setFormData({ ...formData, appointmentDate: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedDoctor) {
      toast.error("Please select a doctor first");
      return;
    }
    if (!formData.appointmentDate) {
      toast.error("Please pick a date");
      return;
    }
    if (!formData.timeSlot) {
      toast.error("Please pick a time slot");
      return;
    }

    dispatch(
      bookAppointment({
        doctorId: selectedDoctor._id,
        appointmentDate: formData.appointmentDate,
        timeSlot: formData.timeSlot,
        symptoms: symptomsInput,
      })
    );
  };

  const tomorrowStr = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  // Get unique specialties for filter list
  const specialties = ["all", ...new Set(doctors.map((d) => d.specialization))];

  // Filter and sort doctors: Priority to AI Recommended matches
  const filteredDoctors = doctors
    .filter((doc) => {
      const matchesSearch = doc.user?.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSpecialty = specialtyFilter === "all" || doc.specialization === specialtyFilter;
      return matchesSearch && matchesSpecialty;
    })
    .sort((a, b) => {
      // Sort matching AI specialty to top
      const aMatches = aiRecommendation.specialty && a.specialization.toLowerCase() === aiRecommendation.specialty.toLowerCase();
      const bMatches = aiRecommendation.specialty && b.specialization.toLowerCase() === aiRecommendation.specialty.toLowerCase();
      if (aMatches && !bMatches) return -1;
      if (!aMatches && bMatches) return 1;
      return b.rating - a.rating; // otherwise sort by rating
    });

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-blue-900 bg-clip-text text-transparent">
          Book Appointment
        </h1>
        <p className="text-slate-500 mt-2">
          Reserve your spot in the queue and consultation room with top medical practitioners.
        </p>
      </div>

      {/* AI Symptom Scanner widget */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 shadow-md mb-8 border border-indigo-900/40 relative overflow-hidden">
        <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-6 translate-y-6">
          <Brain className="w-48 h-48" />
        </div>
        
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
          <h3 className="text-lg font-bold tracking-wide">AI Symptom Assistant</h3>
        </div>
        
        <p className="text-sm text-indigo-200 mb-4 max-w-2xl leading-relaxed">
          Type your symptoms below. Our AI assistant will analyze your text, identify probable specialties, and recommend matching practitioners instantly.
        </p>
        
        <div className="grid md:grid-cols-3 gap-4 items-center">
          <div className="md:col-span-2">
            <input
              type="text"
              placeholder="e.g. I have chest tightness and my blood pressure is high..."
              value={symptomsInput}
              onChange={(e) => setSymptomsInput(e.target.value)}
              className="w-full bg-slate-800/80 border border-slate-700/60 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-slate-400"
            />
          </div>
          
          <div className="md:col-span-1">
            {aiRecommendation.specialty ? (
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-3 flex items-center justify-between text-xs animate-fadeIn">
                <div>
                  <p className="text-slate-400 font-semibold uppercase tracking-wider text-[9px]">Match Specialist</p>
                  <p className="font-bold text-white mt-0.5">{aiRecommendation.specialty}</p>
                </div>
                <div className="text-right">
                  <p className="text-slate-400 font-semibold uppercase tracking-wider text-[9px]">Confidence</p>
                  <p className="font-bold text-blue-400 mt-0.5">{aiRecommendation.confidence}%</p>
                </div>
              </div>
            ) : (
              <div className="text-xs text-indigo-300 italic">Waiting for symptom logs...</div>
            )}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Step 1: Select Doctor with filters */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">1</span>
                <span>Select a Doctor</span>
              </h2>

              {/* Filters */}
              <div className="flex gap-2 w-full md:w-auto items-center">
                <div className="relative flex-1 md:w-48">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="Search doctor..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <select
                  value={specialtyFilter}
                  onChange={(e) => setSpecialtyFilter(e.target.value)}
                  className="border border-slate-200 rounded-lg py-1.5 px-3 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 capitalize"
                >
                  {specialties.map((s) => (
                    <option key={s} value={s}>
                      {s === "all" ? "All Specialties" : s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {docsLoading ? (
              <p className="text-center py-10 text-slate-400">Loading doctors...</p>
            ) : filteredDoctors.length === 0 ? (
              <p className="text-center py-10 text-slate-400">No doctors match your query.</p>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {filteredDoctors.map((doc) => {
                  const isSelected = selectedDoctor?._id === doc._id;
                  const isAiRecommended = aiRecommendation.specialty && doc.specialization.toLowerCase() === aiRecommendation.specialty.toLowerCase();
                  
                  return (
                    <div
                      key={doc._id}
                      onClick={() => handleSelectDoctor(doc)}
                      className={`cursor-pointer rounded-xl p-5 border transition-all duration-200 relative ${
                        isSelected
                          ? "border-blue-600 bg-blue-50/50 ring-2 ring-blue-500/20 shadow-sm"
                          : "border-slate-100 bg-white hover:border-slate-200 hover:shadow-sm"
                      } ${isAiRecommended ? "ring-2 ring-indigo-500/10 border-indigo-200" : ""}`}
                    >
                      {/* AI glow match */}
                      {isAiRecommended && (
                        <div className="absolute top-2 right-2 flex items-center gap-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full shadow-sm">
                          <Award className="w-2.5 h-2.5" />
                          <span>AI MATCH</span>
                        </div>
                      )}

                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-slate-800 text-lg">{doc.user?.name}</h4>
                          <p className="text-sm text-blue-600 font-semibold mt-0.5">{doc.specialization}</p>
                        </div>
                        {isSelected && !isAiRecommended && (
                          <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">✓</span>
                        )}
                      </div>
                      
                      <div className="mt-4 space-y-1.5 text-xs text-slate-500">
                        <p><strong>Qualification:</strong> {doc.qualification}</p>
                        <p><strong>Experience:</strong> {doc.experience} Years</p>
                        <p><strong>Consultation Fee:</strong> ₹{doc.consultationFee}</p>
                        <p><strong>Hospital:</strong> {doc.hospital}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Step 2: Date, Slot & Booking Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 sticky top-24">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">2</span>
              <span>Appointment Info</span>
            </h2>

            {selectedDoctor ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Doctor Brief */}
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                    {selectedDoctor.user?.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 text-sm">{selectedDoctor.user?.name}</p>
                    <p className="text-xs text-slate-400 capitalize">{selectedDoctor.specialization}</p>
                  </div>
                </div>

                {/* Date Picker */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
                    <CalendarIcon className="w-4 h-4 text-slate-400" />
                    <span>Select Date *</span>
                  </label>
                  <input
                    type="date"
                    min={tomorrowStr()}
                    value={formData.appointmentDate}
                    onChange={handleDateChange}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    required
                  />
                </div>

                {/* Time Slots */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span>Available Time Slot *</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto p-1 border border-slate-100 rounded-xl scrollbar-thin">
                    {timeSlots.map((slot) => {
                      const isSelected = formData.timeSlot === slot;
                      return (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => handleTimeSlotSelect(slot)}
                          className={`py-1.5 rounded-lg text-center text-xs font-semibold border transition-all duration-150 ${
                            isSelected
                              ? "bg-blue-600 border-blue-600 text-white shadow-sm"
                              : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                          }`}
                        >
                          {slot}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={bookingLoading}
                  className="w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-xl shadow-md flex items-center justify-center gap-2 transition-all duration-200 hover:bg-blue-700 active:scale-98 disabled:opacity-50"
                >
                  {bookingLoading ? "Reserving slot..." : "Confirm Queue Booking"}
                  <ChevronRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <div className="flex flex-col justify-center items-center py-20 text-center text-slate-400">
                <Stethoscope className="w-12 h-12 text-slate-200 mb-4 animate-bounce" />
                <p className="text-sm">Please choose a practitioner from the left list to proceed with booking.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default BookAppointment;