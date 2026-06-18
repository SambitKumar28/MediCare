import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import BookAppointment from "../components/BookAppointment";
import { AuthContext } from "../context/AuthContextValue";
import API from "../services/api";

const today = new Date().toISOString().split("T")[0];

const PublicDoctorProfile = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [selectedDate, setSelectedDate] = useState(today);
  const [doctor, setDoctor] = useState(null);
  const [availability, setAvailability] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDoctor = async (date = selectedDate) => {
    setLoading(true);
    setError("");

    try {
      const res = await API.get(`/doctors/${id}`, {
        params: { date },
      });
      setDoctor(res.data.doctor);
      setAvailability(res.data.availability);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load doctor profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctor(selectedDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, selectedDate]);

  return (
    <>
      <Navbar />
      <main className="page-container">
        {loading && <p className="empty-state">Loading doctor profile...</p>}
        {error && <p className="alert alert-error">{error}</p>}

        {!loading && doctor && availability && (
          <>
            <div className="page-header">
              <div>
                <p className="eyebrow">Doctor profile</p>
                <h1 className="page-title">{doctor.userId?.name || "Doctor"}</h1>
                <p className="page-subtitle">
                  Review availability, consultation fee, and slots left before booking.
                </p>
              </div>
              <Link to="/doctors" className="btn btn-secondary">
                Back to doctors
              </Link>
            </div>

            <section className="grid gap-5 lg:grid-cols-[1fr_360px]">
              <div className="card p-5">
                <div className="flex items-start gap-4">
                  <img
                    src={
                      doctor.photoUrl ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.userId?.name || "Doctor")}&background=0f766e&color=fff&size=160`
                    }
                    alt={doctor.userId?.name || "Doctor"}
                    className="h-20 w-20 rounded-lg object-cover"
                  />
                  <div>
                    <h2 className="text-2xl font-black text-slate-950">
                      {doctor.userId?.name || "Doctor"}
                    </h2>
                    <p className="font-bold text-teal-700">{doctor.specialization}</p>
                    <p className="mt-2 text-sm font-semibold text-slate-500">
                      {doctor.degree || "Verified doctor"} - {doctor.experience} years experience
                    </p>
                  </div>
                </div>

                <div className="meta-grid mt-6">
                  <div className="metric">
                    <p className="metric-label">Consultation fee</p>
                    <p className="metric-value">{doctor.fees}</p>
                  </div>
                  <div className="metric">
                    <p className="metric-label">Mode</p>
                    <p className="metric-value capitalize">{doctor.consultationMode}</p>
                  </div>
                  <div className="metric">
                    <p className="metric-label">Slots left</p>
                    <p className="metric-value">{availability.slotsLeft}</p>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <div className="rounded-lg bg-slate-50 p-4">
                    <p className="metric-label">Clinic address</p>
                    <p className="mt-2 text-sm font-semibold text-slate-700">
                      {doctor.clinicAddress || "Clinic address will be shared after booking."}
                    </p>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-4">
                    <p className="metric-label">Languages</p>
                    <p className="mt-2 text-sm font-semibold text-slate-700">
                      {doctor.languages?.length ? doctor.languages.join(", ") : "Not added"}
                    </p>
                  </div>
                </div>

                {doctor.bio && (
                  <p className="mt-5 text-sm leading-6 text-slate-600">{doctor.bio}</p>
                )}

                <div className="mt-6">
                  <label className="field-label" htmlFor="profile-date">
                    Check availability date
                  </label>
                  <input
                    id="profile-date"
                    className="field max-w-xs"
                    type="date"
                    min={today}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-lg bg-green-50 p-4">
                    <p className="text-sm font-black text-green-800">
                      Available on {availability.date}
                    </p>
                    <p className="mt-2 text-sm font-semibold text-green-700">
                      {availability.remainingSlots.length
                        ? availability.remainingSlots.join(", ")
                        : "No slots left for this day"}
                    </p>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-4">
                    <p className="text-sm font-black text-slate-700">
                      Already booked
                    </p>
                    <p className="mt-2 text-sm font-semibold text-slate-600">
                      {availability.bookedSlots.length
                        ? availability.bookedSlots.join(", ")
                        : "No bookings yet"}
                    </p>
                  </div>
                </div>
              </div>

              <aside className="card p-5">
                <p className="eyebrow">Book appointment</p>
                <h2 className="mt-2 text-xl font-black text-slate-950">
                  Choose a remaining slot
                </h2>

                {user?.role === "patient" ? (
                  <BookAppointment
                    doctor={doctor}
                    selectedDate={selectedDate}
                    availableSlots={availability.remainingSlots}
                    onDateChange={setSelectedDate}
                    onBooked={() => fetchDoctor(selectedDate)}
                  />
                ) : (
                  <div className="mt-5 rounded-lg bg-slate-50 p-4">
                    <p className="text-sm font-semibold text-slate-600">
                      Login as a patient to book this doctor.
                    </p>
                    <Link to="/login" className="btn btn-primary mt-4">
                      Login to book
                    </Link>
                  </div>
                )}
              </aside>
            </section>
          </>
        )}
      </main>
    </>
  );
};

export default PublicDoctorProfile;
