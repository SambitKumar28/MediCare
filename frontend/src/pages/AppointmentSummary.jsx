import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../services/api";

const AppointmentSummary = () => {
  const { id } = useParams();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAppointment = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await API.get(`/appointments/${id}`);
        setAppointment(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Could not load appointment");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointment();
  }, [id]);

  return (
    <>
      <Navbar />
      <main className="page-container max-w-3xl">
        <div className="page-header">
          <div>
            <p className="eyebrow">Booking summary</p>
            <h1 className="page-title">Appointment details</h1>
            <p className="page-subtitle">
              Keep this summary for your visit and watch notifications for status changes.
            </p>
          </div>
        </div>

        {loading && <p className="empty-state">Loading appointment...</p>}
        {error && <p className="alert alert-error">{error}</p>}

        {!loading && appointment && (
          <section className="card p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-2xl font-black text-slate-950">
                  {appointment.doctorId?.userId?.name || "Doctor"}
                </h2>
                <p className="font-bold text-teal-700">
                  {appointment.doctorId?.specialization || "Specialist"}
                </p>
                <p className="mt-2 text-sm font-semibold text-slate-500">
                  Patient: {appointment.patientId?.name || "Patient"}
                </p>
              </div>
              <span className={`status status-${appointment.status}`}>
                {appointment.status}
              </span>
            </div>

            <div className="meta-grid mt-6">
              <div className="metric">
                <p className="metric-label">Date</p>
                <p className="metric-value">{appointment.date}</p>
              </div>
              <div className="metric">
                <p className="metric-label">Time</p>
                <p className="metric-value">{appointment.time}</p>
              </div>
              <div className="metric">
                <p className="metric-label">Fee</p>
                <p className="metric-value">{appointment.doctorId?.fees || "N/A"}</p>
              </div>
            </div>

            <div className="mt-6 rounded-lg bg-slate-50 p-4">
              <p className="text-sm font-bold text-slate-700">Clinic</p>
              <p className="mt-1 text-sm text-slate-600">
                {appointment.doctorId?.clinicAddress || "Clinic address will be shared by the doctor."}
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <Link to="/appointments" className="btn btn-primary">
                My appointments
              </Link>
              <Link to={`/doctors/${appointment.doctorId?._id}`} className="btn btn-secondary">
                Doctor profile
              </Link>
            </div>
          </section>
        )}
      </main>
    </>
  );
};

export default AppointmentSummary;
