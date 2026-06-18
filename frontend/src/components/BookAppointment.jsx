import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const BookAppointment = ({
  doctor,
  selectedDate = "",
  availableSlots,
  onDateChange,
  onBooked,
}) => {
  const navigate = useNavigate();
  const slots = useMemo(
    () => availableSlots ?? doctor.availability ?? [],
    [availableSlots, doctor.availability]
  );
  const [date, setDate] = useState(selectedDate);
  const [time, setTime] = useState(slots[0] || "");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setDate(selectedDate);
  }, [selectedDate]);

  useEffect(() => {
    if (!slots.includes(time)) {
      setTime(slots[0] || "");
    }
  }, [slots, time]);

  const book = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const res = await API.post("/appointments", {
        doctorId: doctor._id,
        date,
        time
      });
      setMessage("Appointment booked successfully.");
      window.dispatchEvent(new CustomEvent("booking-notification"));
      onBooked?.();
      navigate(`/appointments/${res.data.appointment._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Could not book appointment");
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <form onSubmit={book} className="mt-5 grid gap-3 rounded-lg bg-slate-50 p-3 sm:grid-cols-[1fr_1fr_auto]">
      <input
        className="field"
        type="date"
        min={today}
        value={date}
        required
        onChange={(e) => {
          setDate(e.target.value);
          onDateChange?.(e.target.value);
        }}
      />

      {slots.length ? (
        <select
          className="field"
          value={time}
          required
          onChange={(e) => setTime(e.target.value)}
        >
          {slots.map((slot) => (
            <option key={slot} value={slot}>{slot}</option>
          ))}
        </select>
      ) : (
        <select className="field" value="" disabled>
          <option>No slots left</option>
        </select>
      )}

      <button disabled={loading || !slots.length} className="btn btn-success">
        {loading ? "Booking..." : "Book"}
      </button>

      {message && <p className="text-sm font-bold text-green-700 sm:col-span-3">{message}</p>}
      {error && <p className="text-sm font-bold text-red-700 sm:col-span-3">{error}</p>}
    </form>
  );
};

export default BookAppointment;
