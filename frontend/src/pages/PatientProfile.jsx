import { useEffect, useState } from "react";
import { getProfile } from "../services/authService";

function PatientProfile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const token = localStorage.getItem("token");

        const data = await getProfile(token);

        setUser(data.user);
      } catch (error) {
        console.log(error);
      }
    }

    fetchProfile();
  }, []);

  if (!user) {
    return <h2 className="text-center mt-10">Loading...</h2>;
  }

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white shadow-lg rounded-lg p-8">
      <h1 className="text-3xl font-bold mb-6">Patient Profile</h1>

      <p><strong>Name:</strong> {user.name}</p>

      <p><strong>Email:</strong> {user.email}</p>

      <p><strong>Phone:</strong> {user.phone}</p>

      <p><strong>Role:</strong> {user.role}</p>
    </div>
  );
}

export default PatientProfile;