import { Link } from "react-router-dom";

function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen flex">

      {/* Sidebar */}
      <aside className="w-64 bg-blue-700 text-white p-6">

        <h1 className="text-3xl font-bold mb-10">
          MediQueue
        </h1>

        <nav className="space-y-4">

          <Link
            to="/profile"
            className="block hover:bg-blue-600 p-3 rounded-lg"
          >
            Dashboard
          </Link>

          <Link
            to="/appointments"
            className="block hover:bg-blue-600 p-3 rounded-lg"
          >
            My Appointments
          </Link>

          <Link
            to="/book"
            className="block hover:bg-blue-600 p-3 rounded-lg"
          >
            Book Appointment
          </Link>

          <Link
            to="/doctors"
            className="block hover:bg-blue-600 p-3 rounded-lg"
          >
            Doctors
          </Link>

        </nav>

      </aside>

      {/* Main Content */}

      <main className="flex-1 bg-gray-100 p-8">

        {children}

      </main>

    </div>
  );
}

export default DashboardLayout;