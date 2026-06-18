import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../services/api";

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAppointments = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await API.get("/appointments/doctor");
      setAppointments(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const updateAppointment = async (id, action) => {
    try {
      await API.put(`/appointments/${action}/${id}`);
      window.dispatchEvent(new CustomEvent("booking-notification"));
      fetchAppointments();
    } catch (err) {
      setError(err.response?.data?.message || "Could not update appointment");
    }
  };

  const filteredAppointments = useMemo(() => {
    const query = search.trim().toLowerCase();

    return appointments.filter((appointment) => {
      const matchesStatus = statusFilter === "all" || appointment.status === statusFilter;
      const searchable = [
        appointment.patientId?.name,
        appointment.patientId?.email,
        appointment.date,
        appointment.time
      ].join(" ").toLowerCase();

      return matchesStatus && (!query || searchable.includes(query));
    });
  }, [appointments, search, statusFilter]);

  return (
    <>
      <Navbar />
      <main className="page-container">
        <div className="page-header">
          <div>
            <p className="eyebrow">Doctor workspace</p>
            <h1 className="page-title">Schedule</h1>
            <p className="page-subtitle">
              Review patient bookings, confirm appointment requests, or cancel unavailable slots.
            </p>
          </div>
        </div>

        {loading && <p className="empty-state">Loading appointments...</p>}
        {error && <p className="alert alert-error mb-4">{error}</p>}
        {!loading && appointments.length === 0 && (
          <p className="empty-state">No appointments are booked with you yet.</p>
        )}

        {!loading && appointments.length > 0 && (
          <section className="card mb-5 grid gap-4 p-4 lg:grid-cols-[1fr_auto]">
            <div>
              <label className="field-label" htmlFor="schedule-search">Search schedule</label>
              <input
                id="schedule-search"
                className="field"
                placeholder="Search by patient, email, date, or time"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div>
              <p className="field-label">Status</p>
              <div className="flex flex-wrap gap-2">
                {["all", "pending", "confirmed", "cancelled"].map((status) => (
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
          </section>
        )}

        {!loading && appointments.length > 0 && filteredAppointments.length === 0 && (
          <p className="empty-state">No appointments match your filters.</p>
        )}

        <div className="grid gap-4">
          {filteredAppointments.map((appointment) => (
            <section key={appointment._id} className="card p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-black text-slate-950">{appointment.patientId?.name || "Patient"}</h2>
                  <p className="text-sm font-semibold text-slate-500">{appointment.patientId?.email}</p>
                  <p className="mt-2 text-sm font-semibold text-slate-600">
                    {appointment.date} at {appointment.time}
                  </p>
                  <span className={`status mt-3 status-${appointment.status}`}>
                    {appointment.status}
                  </span>
                </div>

                {appointment.status !== "cancelled" && (
                  <div className="flex gap-2">
                    <Link to={`/appointments/${appointment._id}`} className="btn btn-secondary">
                      Details
                    </Link>
                    {appointment.status !== "confirmed" && (
                      <button
                        type="button"
                        onClick={() => updateAppointment(appointment._id, "confirm")}
                        className="btn btn-success"
                      >
                        Confirm
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => updateAppointment(appointment._id, "cancel")}
                      className="btn btn-danger"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </section>
          ))}
        </div>
      </main>
    </>
  );
};

export default DoctorAppointments;
