import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/slices/authSlice";
import { HeartPulse } from "lucide-react";

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, role } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <nav className="bg-white border-b border-slate-100 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto h-16 flex items-center justify-between px-6">
        <Link
          to="/"
          className="text-2xl font-bold flex items-center gap-2 text-blue-600"
        >
          <HeartPulse className="w-7 h-7 animate-pulse" />
          <span>MediQueue</span>
        </Link>

        <div className="flex gap-6 items-center">
          <Link
            to="/"
            className="text-slate-600 hover:text-blue-600 font-medium text-sm transition-colors"
          >
            Home
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                to={role === "doctor" ? "/doctor/profile" : "/profile"}
                className="text-slate-600 hover:text-blue-600 font-medium text-sm transition-colors"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold px-5 py-2 rounded-xl text-sm transition-all"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-slate-600 hover:text-blue-600 font-medium text-sm transition-colors"
              >
                Sign In
              </Link>

              <Link
                to="/register"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-xl text-sm transition-all shadow-md shadow-blue-500/10"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;