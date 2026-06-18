import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import API from "../services/api";

const tabs = ["approvals", "appointments", "doctors", "users"];
const appointmentStatuses = ["all", "pending", "confirmed", "cancelled"];

const AdminDoctors = () => {
  const [dashboard, setDashboard] = useState({
    stats: {},
    users: [],
    doctors: [],
    appointments: [],
  });
  const [activeTab, setActiveTab] = useState("approvals");
  const [statusFilter, setStatusFilter] = useState("all");
  const [appointmentSearch, setAppointmentSearch] = useState("");
  const [doctorSearch, setDoctorSearch] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState("");
  const [error, setError] = useState("");

  const fetchDashboard = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await API.get("/admin/dashboard");
      setDashboard(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load admin dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const pendingDoctors = useMemo(
    () => dashboard.doctors.filter((doctor) => !doctor.approved),
    [dashboard.doctors]
  );

  const filteredAppointments = useMemo(() => {
    const query = appointmentSearch.trim().toLowerCase();

    return dashboard.appointments.filter((appointment) => {
      const matchesStatus = statusFilter === "all" || appointment.status === statusFilter;
      const searchable = [
        appointment.patientId?.name,
        appointment.patientId?.email,
        appointment.doctorId?.userId?.name,
        appointment.doctorId?.specialization,
        appointment.date,
        appointment.time
      ].join(" ").toLowerCase();

      return matchesStatus && (!query || searchable.includes(query));
    });
  }, [appointmentSearch, dashboard.appointments, statusFilter]);

  const filteredDoctors = useMemo(() => {
    const query = doctorSearch.trim().toLowerCase();

    return dashboard.doctors.filter((doctor) => {
      const searchable = [
        doctor.userId?.name,
        doctor.userId?.email,
        doctor.specialization,
        doctor.approved ? "approved" : "pending"
      ].join(" ").toLowerCase();

      return !query || searchable.includes(query);
    });
  }, [dashboard.doctors, doctorSearch]);

  const filteredUsers = useMemo(() => {
    const query = userSearch.trim().toLowerCase();

    return dashboard.users.filter((user) => {
      const searchable = [user.name, user.email, user.role].join(" ").toLowerCase();
      return !query || searchable.includes(query);
    });
  }, [dashboard.users, userSearch]);

  const approveDoctor = async (id) => {
    setActionLoading(id);
    setError("");

    try {
      await API.put(`/doctors/approve/${id}`);
      await fetchDashboard();
    } catch (err) {
      setError(err.response?.data?.message || "Could not approve doctor");
    } finally {
      setActionLoading("");
    }
  };

  const updateAppointmentStatus = async (id, status) => {
    setActionLoading(`${id}-${status}`);
    setError("");

    try {
      await API.put(`/admin/appointments/${id}/status`, { status });
      window.dispatchEvent(new CustomEvent("booking-notification"));
      await fetchDashboard();
    } catch (err) {
      setError(err.response?.data?.message || "Could not update appointment");
    } finally {
      setActionLoading("");
    }
  };

  const statItems = [
    ["Users", dashboard.stats.users || 0],
    ["Patients", dashboard.stats.patients || 0],
    ["Doctors", dashboard.stats.doctors || 0],
    ["Pending doctors", dashboard.stats.pendingDoctors || 0],
    ["Appointments", dashboard.stats.appointments || 0],
    ["Confirmed", dashboard.stats.confirmed || 0],
  ];

  return (
    <>
      <Navbar />
      <main className="page-container">
        <div className="page-header">
          <div>
            <p className="eyebrow">Admin workspace</p>
            <h1 className="page-title">Admin dashboard</h1>
            <p className="page-subtitle">
              Monitor users, doctors, approvals, and appointment activity from one control center.
            </p>
          </div>
        </div>

        {error && <p className="alert alert-error mb-4">{error}</p>}

        <section className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
          {statItems.map(([label, value]) => (
            <div key={label} className="card p-4">
              <p className="metric-label">{label}</p>
              <p className="mt-2 text-2xl font-black text-slate-950">{value}</p>
            </div>
          ))}
        </section>

        <div className="mb-5 flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`btn min-h-0 px-4 py-2 capitalize ${
                activeTab === tab ? "btn-primary" : "btn-secondary"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {loading && <p className="empty-state">Loading admin dashboard...</p>}

        {!loading && activeTab === "approvals" && (
          <section className="grid gap-4">
            {pendingDoctors.length === 0 && (
              <p className="empty-state">No doctors are waiting for approval.</p>
            )}

            {pendingDoctors.map((doctor) => (
              <article key={doctor._id} className="card p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <h2 className="text-lg font-black text-slate-950">{doctor.userId?.name || "Doctor"}</h2>
                    <p className="text-sm font-semibold text-slate-500">{doctor.userId?.email}</p>
                    <p className="mt-2 font-bold text-teal-700">{doctor.specialization}</p>
                    <div className="mt-4 grid gap-2 sm:grid-cols-3">
                      <div className="metric">
                        <p className="metric-label">Experience</p>
                        <p className="metric-value">{doctor.experience} years</p>
                      </div>
                      <div className="metric">
                        <p className="metric-label">Fee</p>
                        <p className="metric-value">{doctor.fees}</p>
                      </div>
                      <div className="metric">
                        <p className="metric-label">Slots</p>
                        <p className="metric-value">{doctor.availability?.length || 0}</p>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => approveDoctor(doctor._id)}
                    disabled={actionLoading === doctor._id}
                    className="btn btn-success"
                  >
                    {actionLoading === doctor._id ? "Approving..." : "Approve"}
                  </button>
                </div>
              </article>
            ))}
          </section>
        )}

        {!loading && activeTab === "appointments" && (
          <section>
            <div className="card mb-4 grid gap-4 p-4 lg:grid-cols-[1fr_auto]">
              <div>
                <label className="field-label" htmlFor="admin-appointment-search">Search appointments</label>
                <input
                  id="admin-appointment-search"
                  className="field"
                  placeholder="Search patient, doctor, specialization, date, or time"
                  value={appointmentSearch}
                  onChange={(e) => setAppointmentSearch(e.target.value)}
                />
              </div>
              <div>
                <p className="field-label">Status</p>
                <div className="flex flex-wrap gap-2">
                  {appointmentStatuses.map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setStatusFilter(status)}
                      className={`btn min-h-0 px-3 py-2 capitalize ${
                        statusFilter === status ? "btn-primary" : "btn-secondary"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              {filteredAppointments.length === 0 && (
                <p className="empty-state">No appointments match this filter.</p>
              )}

              {filteredAppointments.map((appointment) => (
                <article key={appointment._id} className="card p-5">
                  <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-lg font-black text-slate-950">
                          {appointment.patientId?.name || "Patient"}
                        </h2>
                        <span className={`status status-${appointment.status}`}>{appointment.status}</span>
                      </div>
                      <p className="text-sm font-semibold text-slate-500">{appointment.patientId?.email}</p>
                      <p className="mt-2 font-bold text-teal-700">
                        {appointment.doctorId?.userId?.name || "Doctor"} - {appointment.doctorId?.specialization || "Specialist"}
                      </p>
                      <p className="mt-1 text-sm font-semibold text-slate-600">
                        {appointment.date} at {appointment.time}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {appointment.status !== "confirmed" && (
                        <button
                          type="button"
                          onClick={() => updateAppointmentStatus(appointment._id, "confirmed")}
                          disabled={actionLoading === `${appointment._id}-confirmed`}
                          className="btn btn-success"
                        >
                          Confirm
                        </button>
                      )}
                      {appointment.status !== "cancelled" && (
                        <button
                          type="button"
                          onClick={() => updateAppointmentStatus(appointment._id, "cancelled")}
                          disabled={actionLoading === `${appointment._id}-cancelled`}
                          className="btn btn-danger"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {!loading && activeTab === "doctors" && (
          <section className="grid gap-4">
            <div className="card p-4">
              <label className="field-label" htmlFor="admin-doctor-search">Search doctors</label>
              <input
                id="admin-doctor-search"
                className="field"
                placeholder="Search by name, email, specialization, or approval status"
                value={doctorSearch}
                onChange={(e) => setDoctorSearch(e.target.value)}
              />
            </div>

            {filteredDoctors.length === 0 && (
              <p className="empty-state">No doctors match your search.</p>
            )}

            {filteredDoctors.map((doctor) => (
              <article key={doctor._id} className="card p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-lg font-black text-slate-950">{doctor.userId?.name || "Doctor"}</h2>
                    <p className="text-sm font-semibold text-slate-500">{doctor.userId?.email}</p>
                    <p className="mt-2 font-bold text-teal-700">{doctor.specialization}</p>
                  </div>
                  <span className={`status ${doctor.approved ? "status-approved" : "status-waiting"}`}>
                    {doctor.approved ? "Approved" : "Pending"}
                  </span>
                </div>
              </article>
            ))}
          </section>
        )}

        {!loading && activeTab === "users" && (
          <section className="grid gap-4">
            <div className="card p-4">
              <label className="field-label" htmlFor="admin-user-search">Search users</label>
              <input
                id="admin-user-search"
                className="field"
                placeholder="Search by name, email, or role"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
              />
            </div>

            {filteredUsers.length === 0 && (
              <p className="empty-state">No users match your search.</p>
            )}

            <div className="card overflow-hidden">
              <div className="grid grid-cols-[1.2fr_1.4fr_0.7fr] gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3 text-sm font-black text-slate-600">
                <span>Name</span>
                <span>Email</span>
                <span>Role</span>
              </div>
              {filteredUsers.map((user) => (
                <div
                  key={user._id}
                  className="grid grid-cols-[1.2fr_1.4fr_0.7fr] gap-3 border-b border-slate-100 px-4 py-3 text-sm last:border-0"
                >
                  <span className="font-bold text-slate-950">{user.name}</span>
                  <span className="text-slate-600">{user.email}</span>
                  <span className="font-bold capitalize text-teal-700">{user.role}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </>
  );
};

export default AdminDoctors;
