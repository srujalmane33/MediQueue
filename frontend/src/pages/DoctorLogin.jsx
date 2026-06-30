import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import AuthLayout from "../components/AuthLayout";
import Input from "../components/Input";
import Button from "../components/Button";
import { loginDoc, clearError } from "../store/slices/authSlice";

function DoctorLogin() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, isAuthenticated, role } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
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

    if (!formData.email || !formData.password) {
      toast.error("Please enter email and password");
      return;
    }

    try {
      const resultAction = await dispatch(loginDoc(formData));

      if (loginDoc.fulfilled.match(resultAction)) {
        toast.success("Doctor Login Successful");
        navigate("/doctor/profile");
      } else {
        toast.error(resultAction.payload || "Login Failed");
      }
    } catch (error) {
      toast.error("An error occurred during login");
    }
  };

  return (
    <AuthLayout
      title="Doctor Login"
      subtitle="Login to your doctor dashboard"
    >
      <form onSubmit={handleSubmit}>
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
          Login
        </Button>
      </form>

      <p className="text-center mt-5 text-sm text-slate-500">
        Don't have an account?
        <Link
          to="/doctor/register"
          className="text-blue-600 ml-2 font-medium hover:underline"
        >
          Register
        </Link>
      </p>
    </AuthLayout>
  );
}

export default DoctorLogin;