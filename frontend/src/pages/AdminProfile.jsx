import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import DashboardLayout from "../layout/DashboardLayout";
import api from "../utils/axios";
import {
  Users,
  Activity,
  Calendar,
  ShieldAlert,
  Building,
  PlusCircle,
  Search,
  Filter,
  UserCheck,
  Power,
  Sliders,
  MapPin,
  ListPlus
} from "lucide-react";

function AdminProfile() {
  const { user } = useSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState("analytics");
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters and search states
  const [userSearch, setUserSearch] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState("all");

  // Form states
  const [newHospital, setNewHospital] = useState({ name: "", address: "", departments: "" });
  const [addDeptInput, setAddDeptInput] = useState({});

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch stats
      const statsRes = await api.get("/admin/stats");
      setStats(statsRes.data.stats);

      // Fetch users
      const usersRes = await api.get("/admin/users");
      setUsers(usersRes.data.users);

      // Fetch hospitals
      const hospitalsRes = await api.get("/admin/hospitals");
      setHospitals(hospitalsRes.data.hospitals);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load admin controls");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggleSuspend = async (id) => {
    try {
      const res = await api.patch(`/admin/users/${id}/suspend`);
      toast.success(res.data.message);
      // Refresh user lists
      const usersRes = await api.get("/admin/users");
      setUsers(usersRes.data.users);
      
      // Refresh stats
      const statsRes = await api.get("/admin/stats");
      setStats(statsRes.data.stats);
    } catch (error) {
      toast.error(error.response?.data?.message || "Action failed");
    }
  };

  const handleCreateHospital = async (e) => {
    e.preventDefault();
    if (!newHospital.name || !newHospital.address) {
      toast.error("Please fill in all hospital details");
      return;
    }

    try {
      const deptsArray = newHospital.departments
        ? newHospital.departments.split(",").map((d) => d.trim()).filter(Boolean)
        : [];
      
      await api.post("/admin/hospitals", {
        name: newHospital.name,
        address: newHospital.address,
        departments: deptsArray,
      });

      toast.success("Hospital registered successfully");
      setNewHospital({ name: "", address: "", departments: "" });
      
      // Refresh hospitals list
      const hospitalsRes = await api.get("/admin/hospitals");
      setHospitals(hospitalsRes.data.hospitals);

      // Refresh stats
      const statsRes = await api.get("/admin/stats");
      setStats(statsRes.data.stats);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create hospital");
    }
  };

  const handleAddDepartment = async (hospitalId) => {
    const deptName = addDeptInput[hospitalId];
    if (!deptName) {
      toast.error("Enter a department name");
      return;
    }

    try {
      await api.patch(`/admin/hospitals/${hospitalId}/department`, { department: deptName });
      toast.success("Department added successfully");
      setAddDeptInput({ ...addDeptInput, [hospitalId]: "" });

      // Refresh hospitals list
      const hospitalsRes = await api.get("/admin/hospitals");
      setHospitals(hospitalsRes.data.hospitals);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add department");
    }
  };

  // Filtered users list
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      (u.phone && u.phone.includes(userSearch));
    const matchesRole = userRoleFilter === "all" || u.role === userRoleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-blue-900 bg-clip-text text-transparent">
            Admin Administration
          </h1>
          <p className="text-slate-500 mt-2">
            Configure clinic registers, review analytics, and manage patient/doctor access credentials.
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex bg-slate-100 p-1 rounded-xl gap-1 shrink-0">
          <button
            onClick={() => setActiveTab("analytics")}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === "analytics"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Analytics
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === "users"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            User Controls
          </button>
          <button
            onClick={() => setActiveTab("hospitals")}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === "hospitals"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Hospital configs
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-400 animate-pulse font-semibold">
          Synchronizing database statistics...
        </div>
      ) : (
        <>
          {/* TAB 1: ANALYTICS */}
          {activeTab === "analytics" && stats && (
            <div className="space-y-8 animate-fadeIn">
              {/* Analytics grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Members</p>
                      <h3 className="text-3xl font-bold mt-2 text-slate-800">{stats.totalUsers}</h3>
                    </div>
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                      <Users className="w-5 h-5" />
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 mt-4">Patients: {stats.patients}</p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Registered Doctors</p>
                      <h3 className="text-3xl font-bold mt-2 text-slate-800">{stats.doctors}</h3>
                    </div>
                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                      <Activity className="w-5 h-5" />
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 mt-4">Practitioners verify rate: 100%</p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Bookings</p>
                      <h3 className="text-3xl font-bold mt-2 text-slate-800">{stats.appointments}</h3>
                    </div>
                    <div className="p-3 bg-teal-50 text-teal-600 rounded-xl">
                      <Calendar className="w-5 h-5" />
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 mt-4">Completed: {stats.completed} consults</p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Hospital Clinics</p>
                      <h3 className="text-3xl font-bold mt-2 text-slate-800">{stats.hospitals}</h3>
                    </div>
                    <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                      <Building className="w-5 h-5" />
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 mt-4">Active Queue Rooms: {stats.active}</p>
                </div>
              </div>

              {/* Analytics visual block */}
              <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Queue Activity Breakdown</h3>
                <div className="grid grid-cols-3 gap-4 text-center mt-6">
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <p className="text-xs text-slate-400 font-semibold uppercase">Pending Queues</p>
                    <p className="text-2xl font-extrabold text-blue-600 mt-1">{stats.active}</p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <p className="text-xs text-slate-400 font-semibold uppercase">Finished Consults</p>
                    <p className="text-2xl font-extrabold text-emerald-600 mt-1">{stats.completed}</p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <p className="text-xs text-slate-400 font-semibold uppercase">Cancellations</p>
                    <p className="text-2xl font-extrabold text-red-600 mt-1">{stats.cancelled}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: USER CONTROLS */}
          {activeTab === "users" && (
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm animate-fadeIn space-y-6">
              {/* Filter controls */}
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:max-w-md">
                  <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by name, email, or phone..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>

                <div className="flex items-center gap-2 self-end md:self-auto">
                  <Filter className="w-4 h-4 text-slate-400" />
                  <select
                    value={userRoleFilter}
                    onChange={(e) => setUserRoleFilter(e.target.value)}
                    className="border border-slate-200 bg-white rounded-xl py-2 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Roles</option>
                    <option value="patient">Patients</option>
                    <option value="doctor">Doctors</option>
                    <option value="admin">Admins</option>
                  </select>
                </div>
              </div>

              {/* Users table */}
              <div className="overflow-x-auto rounded-xl border border-slate-100">
                <table className="min-w-full divide-y divide-slate-100 text-left text-sm">
                  <thead className="bg-slate-50 text-slate-400 uppercase tracking-wider text-[10px] font-bold">
                    <tr>
                      <th className="px-6 py-4">User Info</th>
                      <th className="px-6 py-4">Contact</th>
                      <th className="px-6 py-4">Role</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {filteredUsers.map((u) => (
                      <tr key={u._id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-semibold text-slate-800">{u.name}</div>
                          <div className="text-xs text-slate-400">{u.email}</div>
                        </td>
                        <td className="px-6 py-4 text-slate-500">{u.phone || "--"}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-0.5 rounded-lg text-xs font-bold capitalize ${
                            u.role === "admin"
                              ? "bg-purple-100 text-purple-700"
                              : u.role === "doctor"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-slate-100 text-slate-600"
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {u.isSuspended ? (
                            <span className="flex items-center gap-1 text-xs text-red-600 font-bold">
                              <ShieldAlert className="w-3.5 h-3.5" />
                              <span>Suspended</span>
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-xs text-emerald-600 font-bold">
                              <UserCheck className="w-3.5 h-3.5" />
                              <span>Active</span>
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          {u.role !== "admin" ? (
                            <button
                              onClick={() => handleToggleSuspend(u._id)}
                              className={`inline-flex items-center gap-1 text-xs font-bold py-1.5 px-3 rounded-lg border transition-all ${
                                u.isSuspended
                                  ? "bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100"
                                  : "bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
                              }`}
                            >
                              <Power className="w-3 h-3" />
                              <span>{u.isSuspended ? "Unsuspend" : "Suspend"}</span>
                            </button>
                          ) : (
                            <span className="text-xs text-slate-400 italic">Protected</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: HOSPITALS */}
          {activeTab === "hospitals" && (
            <div className="grid lg:grid-cols-3 gap-8 animate-fadeIn">
              {/* List Hospitals */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                  <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <Building className="w-5 h-5 text-slate-400" />
                    <span>Registered Hospital Clinics ({hospitals.length})</span>
                  </h3>

                  <div className="space-y-6 divide-y divide-slate-100">
                    {hospitals.map((h, index) => (
                      <div key={h._id} className={`${index > 0 ? "pt-6" : ""} space-y-4`}>
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-bold text-slate-800 text-lg">{h.name}</h4>
                            <p className="text-slate-400 text-xs flex items-center gap-1 mt-1">
                              <MapPin className="w-3.5 h-3.5" />
                              <span>{h.address}</span>
                            </p>
                          </div>
                        </div>

                        {/* Departments badges */}
                        <div>
                          <p className="text-[10px] uppercase font-bold text-slate-400 mb-2">Departments Configured:</p>
                          {h.departments.length === 0 ? (
                            <p className="text-xs text-slate-400 italic">No departments listed yet</p>
                          ) : (
                            <div className="flex flex-wrap gap-2">
                              {h.departments.map((dept) => (
                                <span key={dept} className="bg-slate-100 text-slate-600 font-semibold px-2.5 py-1 rounded-lg text-xs">
                                  {dept}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Add department form */}
                        <div className="flex items-center gap-2 max-w-sm pt-2">
                          <input
                            type="text"
                            placeholder="Add department (e.g. Cardiology)"
                            value={addDeptInput[h._id] || ""}
                            onChange={(e) => setAddDeptInput({ ...addDeptInput, [h._id]: e.target.value })}
                            className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <button
                            onClick={() => handleAddDepartment(h._id)}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1.5 px-3 rounded-lg text-xs flex items-center gap-1"
                          >
                            <ListPlus className="w-3.5 h-3.5" />
                            <span>Add</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Register New Hospital */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm sticky top-24">
                  <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <PlusCircle className="w-5 h-5 text-blue-600" />
                    <span>Register Hospital</span>
                  </h3>

                  <form onSubmit={handleCreateHospital} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1.5">Hospital Name *</label>
                      <input
                        type="text"
                        placeholder="e.g. City General Hospital"
                        value={newHospital.name}
                        onChange={(e) => setNewHospital({ ...newHospital, name: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1.5">Address *</label>
                      <input
                        type="text"
                        placeholder="e.g. 123 Main St, New York"
                        value={newHospital.address}
                        onChange={(e) => setNewHospital({ ...newHospital, address: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                        Initial Departments (comma separated)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Cardiology, Pediatrics, ICU"
                        value={newHospital.departments}
                        onChange={(e) => setNewHospital({ ...newHospital, departments: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl shadow-md flex items-center justify-center gap-1 text-sm mt-6"
                    >
                      <Building className="w-4 h-4" />
                      <span>Register Location</span>
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </DashboardLayout>
  );
}

export default AdminProfile;
