import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto h-16 flex items-center justify-between px-6">

        <Link
          to="/"
          className="text-2xl font-bold text-blue-600"
        >
          MediQueue
        </Link>

        <div className="flex gap-6 items-center">

          <Link
            to="/"
            className="hover:text-blue-600"
          >
            Home
          </Link>

          <Link
            to="/login"
            className="hover:text-blue-600"
          >
            Patient Login
          </Link>

          <Link
            to="/doctor/login"
            className="hover:text-blue-600"
          >
            Doctor Login
          </Link>

          <Link
            to="/register"
            className="bg-blue-600 text-white px-5 py-2 rounded-lg"
          >
            Register
          </Link>

        </div>

      </div>
    </nav>
  );
}

export default Navbar;