import { useState } from "react";
import { Link } from "react-router-dom";

import AuthLayout from "../components/AuthLayout";
import Input from "../components/Input";
import Button from "../components/Button";

function DoctorLogin() {
  const [formData, setFormData] = useState({
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
        />

        <Input
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />

        <Button>Login</Button>
      </form>

      <p className="text-center mt-5">
        Don't have an account?

        <Link
          to="/doctor/register"
          className="text-blue-600 ml-2"
        >
          Register
        </Link>
      </p>
    </AuthLayout>
  );
}

export default DoctorLogin;