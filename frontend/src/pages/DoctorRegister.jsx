import { useState } from "react";
import { Link } from "react-router-dom";

import AuthLayout from "../components/AuthLayout";
import Input from "../components/Input";
import Button from "../components/Button";

function DoctorRegister() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(formData);
  };

  return (
    <AuthLayout
      title="Doctor Registration"
      subtitle="Join MediQueue as a doctor"
    >
      <form onSubmit={handleSubmit}>
        <Input
          label="Full Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />

        <Input
          label="Phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
        />

        <Input
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />

        <Input
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />

        <Button>Register</Button>
      </form>

      <p className="text-center mt-5">
        Already have an account?

        <Link
          to="/doctor/login"
          className="text-blue-600 ml-2"
        >
          Login
        </Link>
      </p>
    </AuthLayout>
  );
}

export default DoctorRegister;