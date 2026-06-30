import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import AuthLayout from "../components/AuthLayout";
import Input from "../components/Input";
import Button from "../components/Button";
import { register, clearError } from "../store/slices/authSlice";

function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, isAuthenticated, role } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    if (isAuthenticated && role === "patient") {
      navigate("/profile");
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

    if (!formData.name || !formData.phone || !formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const resultAction = await dispatch(register(formData));

      if (register.fulfilled.match(resultAction)) {
        toast.success("Registration Successful");
        navigate("/profile");
      } else {
        toast.error(resultAction.payload || "Registration Failed");
      }
    } catch (error) {
      toast.error("An error occurred during registration");
    }
  };

  return (
    <AuthLayout
      title="Create Patient Account"
      subtitle="Register to book appointments"
    >
      <form onSubmit={handleSubmit}>
        <Input
          label="Full Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <Input
          label="Phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
        />

        <Input
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <Input
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <Button loading={loading}>
          Register
        </Button>
      </form>

      <p className="text-center mt-5 text-sm text-slate-500">
        Already have an account?
        <Link
          to="/login"
          className="text-blue-600 ml-2 font-medium hover:underline"
        >
          Login
        </Link>
      </p>
    </AuthLayout>
  );
}

export default Register;