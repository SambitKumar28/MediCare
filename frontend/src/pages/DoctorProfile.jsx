import { useCallback, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import API from "../services/api";

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const emptyWeeklyAvailability = () =>
  days.reduce((slots, day) => ({ ...slots, [day]: "" }), {});

const DoctorProfile = () => {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({
    specialization: "",
    degree: "",
    experience: "",
    fees: "",
    clinicAddress: "",
    photoUrl: "",
    languages: "",
    consultationMode: "clinic",
    bio: "",
    availability: "",
    weeklyAvailability: emptyWeeklyAvailability(),
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const slotsToText = (slots = []) => slots.join(", ");
  const textToSlots = (value) =>
    value
      .split(",")
      .map((slot) => slot.trim())
      .filter(Boolean);

  const fillForm = useCallback((doctor) => {
    const weekly = emptyWeeklyAvailability();
    doctor.weeklyAvailability?.forEach((item) => {
      weekly[item.day] = slotsToText(item.slots);
    });

    setForm({
      specialization: doctor.specialization || "",
      degree: doctor.degree || "",
      experience: doctor.experience ?? "",
      fees: doctor.fees ?? "",
      clinicAddress: doctor.clinicAddress || "",
      photoUrl: doctor.photoUrl || "",
      languages: doctor.languages?.join(", ") || "",
      consultationMode: doctor.consultationMode || "clinic",
      bio: doctor.bio || "",
      availability: slotsToText(doctor.availability),
      weeklyAvailability: weekly,
    });
  }, []);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const res = await API.get("/doctors/me");
      setProfile(res.data);
      fillForm(res.data);
    } catch (err) {
      if (err.response?.status !== 404) {
        setError(err.response?.data?.message || "Could not load profile");
      }
    } finally {
      setLoading(false);
    }
  }, [fillForm]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleChange = (e) => {
    setForm((current) => ({ ...current, [e.target.name]: e.target.value }));
  };

  const handleWeeklyChange = (day, value) => {
    setForm((current) => ({
      ...current,
      weeklyAvailability: {
        ...current.weeklyAvailability,
        [day]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const payload = {
        specialization: form.specialization,
        degree: form.degree,
        experience: Number(form.experience),
        fees: Number(form.fees),
        clinicAddress: form.clinicAddress,
        photoUrl: form.photoUrl,
        languages: textToSlots(form.languages),
        consultationMode: form.consultationMode,
        bio: form.bio,
        availability: textToSlots(form.availability),
        weeklyAvailability: days.map((day) => ({
          day,
          slots: textToSlots(form.weeklyAvailability[day] || ""),
        })),
      };

      const res = profile
        ? await API.put("/doctors/me", payload)
        : await API.post("/doctors/create", payload);

      setProfile(res.data.doctor);
      fillForm(res.data.doctor);
      setEditing(false);
      setMessage(profile ? "Profile updated successfully" : "Profile submitted for admin approval");
    } catch (err) {
      setError(err.response?.data?.message || "Could not save profile");
    } finally {
      setSaving(false);
    }
  };

  const startEditing = () => {
    if (profile) fillForm(profile);
    setEditing(true);
    setMessage("");
    setError("");
  };

  const cancelEditing = () => {
    if (profile) fillForm(profile);
    setEditing(false);
    setError("");
  };

  const showForm = !loading && (!profile || editing);

  return (
    <>
      <Navbar />
      <main className="page-container max-w-5xl">
        <div className="page-header">
          <div>
            <p className="eyebrow">Doctor workspace</p>
            <h1 className="page-title">Doctor profile</h1>
            <p className="page-subtitle">
              Manage your profile, clinic details, consultation mode, and weekly appointment slots.
            </p>
          </div>
        </div>

        {loading && <p className="empty-state">Loading profile...</p>}
        {message && <p className="alert alert-success mb-4">{message}</p>}
        {error && <p className="alert alert-error mb-4">{error}</p>}

        {profile && !editing ? (
          <section className="card p-5">
            <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
              <div className="flex gap-4">
                <img
                  src={
                    profile.photoUrl ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.userId?.name || "Doctor")}&background=0f766e&color=fff&size=160`
                  }
                  alt={profile.userId?.name || "Doctor"}
                  className="h-24 w-24 rounded-lg object-cover"
                />
                <div>
                  <h2 className="text-2xl font-black text-slate-950">
                    {profile.userId?.name || "My profile"}
                  </h2>
                  <p className="font-bold text-teal-700">{profile.specialization}</p>
                  <p className="mt-1 text-sm font-semibold text-slate-600">{profile.degree}</p>
                  <span className={`status mt-3 ${profile.approved ? "status-approved" : "status-waiting"}`}>
                    {profile.approved ? "Approved" : "Waiting for admin approval"}
                  </span>
                </div>
              </div>

              <button type="button" onClick={startEditing} className="btn btn-primary">
                Edit profile
              </button>
            </div>

            <div className="meta-grid mt-6">
              <div className="metric">
                <p className="metric-label">Experience</p>
                <p className="metric-value">{profile.experience} years</p>
              </div>
              <div className="metric">
                <p className="metric-label">Consultation fee</p>
                <p className="metric-value">{profile.fees}</p>
              </div>
              <div className="metric">
                <p className="metric-label">Mode</p>
                <p className="metric-value capitalize">{profile.consultationMode}</p>
              </div>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div className="rounded-lg bg-slate-50 p-4">
                <p className="metric-label">Clinic address</p>
                <p className="mt-2 text-sm font-semibold text-slate-700">
                  {profile.clinicAddress || "Not added"}
                </p>
              </div>
              <div className="rounded-lg bg-slate-50 p-4">
                <p className="metric-label">Languages</p>
                <p className="mt-2 text-sm font-semibold text-slate-700">
                  {profile.languages?.length ? profile.languages.join(", ") : "Not added"}
                </p>
              </div>
            </div>

            {profile.bio && (
              <p className="mt-5 text-sm leading-6 text-slate-600">{profile.bio}</p>
            )}

            <div className="mt-6 grid gap-3 md:grid-cols-2">
              {days.map((day) => {
                const dayConfig = profile.weeklyAvailability?.find((item) => item.day === day);
                const slots = dayConfig?.slots?.length ? dayConfig.slots : profile.availability;

                return (
                  <div key={day} className="rounded-lg bg-slate-50 p-3">
                    <p className="text-sm font-black text-slate-700">{day}</p>
                    <p className="mt-1 text-sm font-semibold text-slate-600">
                      {slots?.length ? slots.join(", ") : "No slots"}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>
        ) : null}

        {showForm && (
          <form onSubmit={handleSubmit} className="card grid gap-4 p-5">
            <h2 className="text-lg font-black text-slate-950">
              {profile ? "Edit profile" : "Create profile"}
            </h2>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="field-label" htmlFor="specialization">Specialization</label>
                <input id="specialization" className="field" name="specialization" value={form.specialization} required onChange={handleChange} />
              </div>
              <div>
                <label className="field-label" htmlFor="degree">Degree</label>
                <input id="degree" className="field" name="degree" placeholder="MBBS, MD" value={form.degree} onChange={handleChange} />
              </div>
              <div>
                <label className="field-label" htmlFor="experience">Experience</label>
                <input id="experience" className="field" name="experience" type="number" min="0" value={form.experience} required onChange={handleChange} />
              </div>
              <div>
                <label className="field-label" htmlFor="fees">Consultation fee</label>
                <input id="fees" className="field" name="fees" type="number" min="0" value={form.fees} required onChange={handleChange} />
              </div>
              <div>
                <label className="field-label" htmlFor="languages">Languages</label>
                <input id="languages" className="field" name="languages" placeholder="English, Hindi" value={form.languages} onChange={handleChange} />
              </div>
              <div>
                <label className="field-label" htmlFor="consultationMode">Consultation mode</label>
                <select id="consultationMode" className="field" name="consultationMode" value={form.consultationMode} onChange={handleChange}>
                  <option value="clinic">Clinic</option>
                  <option value="online">Online</option>
                  <option value="both">Both</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="field-label" htmlFor="clinicAddress">Clinic address</label>
                <input id="clinicAddress" className="field" name="clinicAddress" value={form.clinicAddress} onChange={handleChange} />
              </div>
              <div className="md:col-span-2">
                <label className="field-label" htmlFor="photoUrl">Photo URL</label>
                <input id="photoUrl" className="field" name="photoUrl" value={form.photoUrl} onChange={handleChange} />
              </div>
              <div className="md:col-span-2">
                <label className="field-label" htmlFor="bio">Profile bio</label>
                <textarea id="bio" className="field min-h-28" name="bio" value={form.bio} onChange={handleChange} />
              </div>
            </div>

            <div>
              <label className="field-label" htmlFor="availability">Default daily slots</label>
              <input
                id="availability"
                className="field"
                name="availability"
                placeholder="10:00, 11:30, 14:00"
                value={form.availability}
                onChange={handleChange}
              />
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              {days.map((day) => (
                <div key={day}>
                  <label className="field-label" htmlFor={`slots-${day}`}>{day} slots</label>
                  <input
                    id={`slots-${day}`}
                    className="field"
                    placeholder="Leave blank to use default slots"
                    value={form.weeklyAvailability[day]}
                    onChange={(e) => handleWeeklyChange(day, e.target.value)}
                  />
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              <button disabled={saving} className="btn btn-primary">
                {saving ? "Saving..." : profile ? "Save changes" : "Submit profile"}
              </button>
              {profile && (
                <button type="button" onClick={cancelEditing} className="btn btn-secondary">
                  Cancel
                </button>
              )}
            </div>
          </form>
        )}
      </main>
    </>
  );
};

export default DoctorProfile;
