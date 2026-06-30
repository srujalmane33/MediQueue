import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/slices/authSlice";
import {
  LayoutDashboard,
  Calendar,
  CalendarPlus,
  Users,
  LogOut,
  User,
  Activity,
  HeartPulse,
  Sliders,
  Menu,
  X
} from "lucide-react";

function DashboardLayout({ children }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  
  const { user, role } = useSelector((state) => state.auth);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  // Define sidebar links based on role
  const patientLinks = [
    { path: "/profile", label: "Dashboard", icon: LayoutDashboard },
    { path: "/book", label: "Book Appointment", icon: CalendarPlus },
    { path: "/appointments", label: "My Appointments", icon: Calendar },
    { path: "/doctors", label: "Doctors", icon: Users },
  ];

  const doctorLinks = [
    { path: "/doctor/profile", label: "Dashboard & Queue", icon: Activity },
  ];

  const adminLinks = [
    { path: "/admin/profile", label: "Admin Console", icon: Sliders },
  ];

  const links = role === "admin" ? adminLinks : role === "doctor" ? doctorLinks : patientLinks;

  const SidebarContent = () => (
    <>
      <div>
        {/* Logo */}
        <div className="flex items-center gap-3 mb-10 px-2">
          <HeartPulse className="w-8 h-8 text-blue-500 animate-pulse" />
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            MediQueue
          </span>
        </div>

        {/* User Preview */}
        <div className="bg-slate-800/50 backdrop-blur-md rounded-xl p-4 mb-8 border border-slate-700/30 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white shadow-md shrink-0">
            {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
          </div>
          <div className="overflow-hidden">
            <p className="font-semibold truncate text-sm text-slate-100">{user?.name || "User"}</p>
            <p className="text-xs text-blue-400 capitalize">{role}</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          {links.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-250 group ${
                  active
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30 font-medium"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <Icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${active ? "text-white" : "text-slate-400 group-hover:text-blue-400"}`} />
                <span className="text-sm">{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Logout Button at bottom */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-slate-400 hover:bg-red-950/30 hover:text-red-400 transition-all duration-250 group mt-auto text-left"
      >
        <LogOut className="w-5 h-5 group-hover:translate-x-0.5 transition-transform text-slate-400 group-hover:text-red-400" />
        <span className="text-sm font-medium">Sign Out</span>
      </button>
    </>
  );

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-800 font-sans">
      {/* 1. Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-slate-900 text-white flex-col justify-between p-6 shadow-xl border-r border-slate-800 shrink-0">
        <SidebarContent />
      </aside>

      {/* 2. Mobile Drawer Navigation Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* 3. Mobile Side Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-slate-900 text-white flex flex-col justify-between p-6 z-50 shadow-2xl border-r border-slate-800 md:hidden transition-transform duration-300 transform ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Close Button inside Drawer */}
        <button
          onClick={() => setIsMobileOpen(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
        >
          <X className="w-5 h-5" />
        </button>
        <SidebarContent />
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen overflow-y-auto">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200/80 h-16 flex items-center justify-between px-6 md:px-8 shadow-sm shrink-0">
          <div className="flex items-center gap-3">
            {/* Hamburger Trigger Menu (Mobile only) */}
            <button
              onClick={() => setIsMobileOpen(true)}
              className="p-1 text-slate-500 hover:bg-slate-100 rounded-lg md:hidden"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-lg font-bold text-slate-800">
              {role === "admin" ? "Admin Portal" : role === "doctor" ? "Doctor Portal" : "Patient Portal"}
            </h2>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-xs md:text-sm text-slate-500">
              Role: <strong className="capitalize text-slate-700">{role}</strong>
            </span>
          </div>
        </header>

        {/* Body Container */}
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;