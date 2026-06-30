import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import AuthLayout from "../components/AuthLayout";
import Input from "../components/Input";
import Button from "../components/Button";
import { registerDoc, clearError } from "../store/slices/authSlice";

function DoctorRegister() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { loading, error, isAuthenticated, role } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    specialization: "",
    qualification: "",
    experience: "",
    consultationFee: "",
    about: "",
  });

  useEffect(() => {
    if (isAuthenticated && role === "doctor") {
      navigate("/doctor/profile");
    }
  }, [isAuthenticated, role, navigate]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.phone ||
      !formData.specialization ||
      !formData.qualification
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const resultAction = await dispatch(
        registerDoc({
          ...formData,
          experience: Number(formData.experience) || 0,
          consultationFee: Number(formData.consultationFee) || 0,
        })
      );

      if (registerDoc.fulfilled.match(resultAction)) {
        toast.success("Doctor Registered successfully!");
        navigate("/doctor/profile");
      } else {
        toast.error(resultAction.payload || "Registration failed");
      }
    } catch (err) {
      toast.error("An error occurred during registration");
    }
  };

  return (
    <AuthLayout
      title="Doctor Registration"
      subtitle="Join MediQueue as a doctor"
    >
      <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto px-1 scrollbar-thin">
        <Input
          label="Full Name *"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Phone *"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
          <Input
            label="Email *"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <Input
          label="Password *"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Specialization *"
            name="specialization"
            placeholder="e.g. Cardiologist"
            value={formData.specialization}
            onChange={handleChange}
            required
          />
          <Input
            label="Qualification *"
            name="qualification"
            placeholder="e.g. MBBS, MD"
            value={formData.qualification}
            onChange={handleChange}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Experience (Years)"
            type="number"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
          />
          <Input
            label="Consultation Fee (₹)"
            type="number"
            name="consultationFee"
            value={formData.consultationFee}
            onChange={handleChange}
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-semibold text-slate-700 mb-1">About Profile</label>
          <textarea
            name="about"
            rows="3"
            value={formData.about}
            onChange={handleChange}
            placeholder="Tell patients about your medical background..."
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          ></textarea>
        </div>

        <Button loading={loading}>Register</Button>
      </form>

      <p className="text-center mt-5 text-sm text-slate-500">
        Already have an account?
        <Link
          to="/doctor/login"
          className="text-blue-600 ml-2 font-medium hover:underline"
        >
          Login
        </Link>
      </p>
    </AuthLayout>
  );
}

export default DoctorRegister;