import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../services/api";

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [reschedulingId, setReschedulingId] = useState("");
  const [rescheduleForm, setRescheduleForm] = useState({ date: "", time: "" });
  const [actionLoading, setActionLoading] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAppointments = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await API.get("/appointments/my");
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

  const cancelAppointment = async (id) => {
    setActionLoading(`${id}-cancel`);
    setError("");

    try {
      await API.put(`/appointments/cancel/${id}`);
      window.dispatchEvent(new CustomEvent("booking-notification"));
      fetchAppointments();
    } catch (err) {
      setError(err.response?.data?.message || "Could not cancel appointment");
    } finally {
      setActionLoading("");
    }
  };

  const startReschedule = (appointment) => {
    setReschedulingId(appointment._id);
    setRescheduleForm({
      date: appointment.date,
      time: appointment.time,
    });
    setError("");
  };

  const cancelReschedule = () => {
    setReschedulingId("");
    setRescheduleForm({ date: "", time: "" });
  };

  const submitReschedule = async (e, appointmentId) => {
    e.preventDefault();
    setActionLoading(`${appointmentId}-reschedule`);
    setError("");

    try {
      await API.put(`/appointments/reschedule/${appointmentId}`, rescheduleForm);
      window.dispatchEvent(new CustomEvent("booking-notification"));
      cancelReschedule();
      fetchAppointments();
    } catch (err) {
      setError(err.response?.data?.message || "Could not reschedule appointment");
    } finally {
      setActionLoading("");
    }
  };

  const filteredAppointments = useMemo(() => {
    const query = search.trim().toLowerCase();

    return appointments.filter((appointment) => {
      const matchesStatus = statusFilter === "all" || appointment.status === statusFilter;
      const searchable = [
        appointment.doctorId?.userId?.name,
        appointment.doctorId?.specialization,
        appointment.date,
        appointment.time
      ].join(" ").toLowerCase();

      return matchesStatus && (!query || searchable.includes(query));
    });
  }, [appointments, search, statusFilter]);

  const today = new Date().toISOString().split("T")[0];

  return (
    <>
      <Navbar />
      <main className="page-container">
        <div className="page-header">
          <div>
            <p className="eyebrow">Patient workspace</p>
            <h1 className="page-title">My appointments</h1>
            <p className="page-subtitle">Track upcoming visits and cancel bookings when plans change.</p>
          </div>
        </div>

        {loading && <p className="empty-state">Loading appointments...</p>}
        {error && <p className="alert alert-error mb-4">{error}</p>}
        {!loading && appointments.length === 0 && (
          <p className="empty-state">You have not booked any appointments yet.</p>
        )}

        {!loading && appointments.length > 0 && (
          <section className="card mb-5 grid gap-4 p-4 lg:grid-cols-[1fr_auto]">
            <div>
              <label className="field-label" htmlFor="appointment-search">Search appointments</label>
              <input
                id="appointment-search"
                className="field"
                placeholder="Search by doctor, specialization, date, or time"
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
                  <h2 className="text-lg font-black text-slate-950">
                    {appointment.doctorId?.userId?.name || "Doctor"}
                  </h2>
                  <p className="text-sm font-bold text-teal-700">
                    {appointment.doctorId?.specialization || "Specialist"}
                  </p>
                  <p className="mt-2 text-sm font-semibold text-slate-600">
                    {appointment.date} at {appointment.time}
                  </p>
                  <span className={`status mt-3 status-${appointment.status}`}>
                    {appointment.status}
                  </span>
                </div>

                {appointment.status !== "cancelled" && (
                  <div className="flex flex-wrap gap-2">
                    <Link to={`/appointments/${appointment._id}`} className="btn btn-secondary">
                      Summary
                    </Link>
                    <button
                      type="button"
                      onClick={() => startReschedule(appointment)}
                      className="btn btn-secondary"
                    >
                      Reschedule
                    </button>
                    <button
                      type="button"
                      onClick={() => cancelAppointment(appointment._id)}
                      disabled={actionLoading === `${appointment._id}-cancel`}
                      className="btn btn-danger"
                    >
                      {actionLoading === `${appointment._id}-cancel` ? "Cancelling..." : "Cancel"}
                    </button>
                  </div>
                )}
              </div>

              {reschedulingId === appointment._id && (
                <form
                  onSubmit={(e) => submitReschedule(e, appointment._id)}
                  className="mt-5 grid gap-3 rounded-lg bg-slate-50 p-3 sm:grid-cols-[1fr_1fr_auto_auto]"
                >
                  <input
                    className="field"
                    type="date"
                    min={today}
                    value={rescheduleForm.date}
                    required
                    onChange={(e) => setRescheduleForm((current) => ({ ...current, date: e.target.value }))}
                  />

                  {appointment.doctorId?.availability?.length ? (
                    <select
                      className="field"
                      value={rescheduleForm.time}
                      required
                      onChange={(e) => setRescheduleForm((current) => ({ ...current, time: e.target.value }))}
                    >
                      {appointment.doctorId.availability.map((slot) => (
                        <option key={slot} value={slot}>{slot}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      className="field"
                      type="time"
                      value={rescheduleForm.time}
                      required
                      onChange={(e) => setRescheduleForm((current) => ({ ...current, time: e.target.value }))}
                    />
                  )}

                  <button
                    disabled={actionLoading === `${appointment._id}-reschedule`}
                    className="btn btn-primary"
                  >
                    {actionLoading === `${appointment._id}-reschedule` ? "Saving..." : "Save"}
                  </button>
                  <button type="button" onClick={cancelReschedule} className="btn btn-secondary">
                    Close
                  </button>
                </form>
              )}
            </section>
          ))}
        </div>
      </main>
    </>
  );
};

export default MyAppointments;
