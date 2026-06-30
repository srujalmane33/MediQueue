import { useEffect, useState } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import { getProfile } from "../services/authService";

function PatientProfile() {

  const [user, setUser] = useState(null);

  useEffect(() => {

    async function loadProfile() {

      try {

        const token = localStorage.getItem("token");

        const data = await getProfile(token);

        setUser(data.user);

      } catch (error) {

        console.log(error);

      }

    }

    loadProfile();

  }, []);

  if (!user) {

    return <h1 className="text-center mt-20">Loading...</h1>;

  }

  return (

    <DashboardLayout>

      <h1 className="text-4xl font-bold mb-10">

        Welcome,
        {" "}
        {user.name}

      </h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

        <div className="bg-white rounded-xl shadow-md p-6">

          <h2 className="text-gray-500">
            Appointments
          </h2>

          <p className="text-4xl font-bold mt-3">
            0
          </p>

        </div>

        <div className="bg-white rounded-xl shadow-md p-6">

          <h2 className="text-gray-500">
            Queue Position
          </h2>

          <p className="text-4xl font-bold mt-3">
            --
          </p>

        </div>

        <div className="bg-white rounded-xl shadow-md p-6">

          <h2 className="text-gray-500">
            Waiting Time
          </h2>

          <p className="text-4xl font-bold mt-3">
            --
          </p>

        </div>

        <div className="bg-white rounded-xl shadow-md p-6">

          <h2 className="text-gray-500">
            Role
          </h2>

          <p className="text-2xl font-bold mt-3 capitalize">
            {user.role}
          </p>

        </div>

      </div>

      <div className="bg-white rounded-xl shadow-md p-8 mt-10">

        <h2 className="text-2xl font-bold mb-5">

          Profile Information

        </h2>

        <p>
          <strong>Name:</strong> {user.name}
        </p>

        <p>
          <strong>Email:</strong> {user.email}
        </p>

        <p>
          <strong>Phone:</strong> {user.phone}
        </p>

      </div>

    </DashboardLayout>

  );
}

export default PatientProfile;