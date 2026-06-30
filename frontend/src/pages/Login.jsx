import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import AuthLayout from "../components/AuthLayout";
import Input from "../components/Input";
import Button from "../components/Button";
import { login, loginDoc, clearError } from "../store/slices/authSlice";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, isAuthenticated, role } = useSelector((state) => state.auth);

  const [loginRole, setLoginRole] = useState("patient"); // "patient" or "doctor"
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (isAuthenticated) {
      if (role === "doctor") {
        navigate("/doctor/profile");
      } else if (role === "admin") {
        navigate("/admin/profile");
      } else {
        navigate("/profile");
      }
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
      let resultAction;
      if (loginRole === "doctor") {
        resultAction = await dispatch(loginDoc(formData));
      } else {
        resultAction = await dispatch(login(formData));
      }

      if (login.fulfilled.match(resultAction) || loginDoc.fulfilled.match(resultAction)) {
        toast.success(`${loginRole === "doctor" ? "Doctor" : "Patient"} Login Successful`);
        if (loginRole === "doctor") {
          navigate("/doctor/profile");
        } else {
          const userRole = resultAction.payload?.role;
          if (userRole === "admin") {
            navigate("/admin/profile");
          } else {
            navigate("/profile");
          }
        }
      } else {
        toast.error(resultAction.payload || "Login Failed");
      }
    } catch (error) {
      toast.error("An error occurred during login");
    }
  };

  return (
    <AuthLayout
      title="Sign In"
      subtitle="Access your secure medical queue portal"
    >
      {/* Role Toggle Selector */}
      <div className="flex bg-slate-100 border border-slate-200/30 p-1 rounded-2xl mb-8">
        <button
          type="button"
          onClick={() => setLoginRole("patient")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all duration-200 ${
            loginRole === "patient"
              ? "bg-white text-[#4f46e5] shadow-sm border border-slate-200/20"
              : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <span>👤 Patient</span>
        </button>
        <button
          type="button"
          onClick={() => setLoginRole("doctor")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all duration-200 ${
            loginRole === "doctor"
              ? "bg-white text-[#4f46e5] shadow-sm border border-slate-200/20"
              : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <span>🩺 Doctor</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Email Address"
          type="email"
          name="email"
          placeholder="sachin@gmail.com"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <Input
          label="Password"
          type="password"
          name="password"
          placeholder="••••••"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <Button loading={loading}>
          Sign In as {loginRole === "doctor" ? "Doctor" : "Patient"}
        </Button>
      </form>

      <p className="text-center mt-8 text-xs text-slate-400 font-semibold">
        Don't have an account?
        <Link
          to={loginRole === "doctor" ? "/doctor/register" : "/register"}
          className="text-[#4f46e5] font-bold hover:underline ml-1.5"
        >
          Register here
        </Link>
      </p>
    </AuthLayout>
  );
}

export default Login;