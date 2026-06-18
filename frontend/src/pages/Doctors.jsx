import { useContext, useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";
import { AuthContext } from "../context/AuthContextValue";

const healthIssueSpecializations = [
  {
    specialization: "Cardiology",
    keywords: ["heart", "chest", "bp", "blood pressure", "cardiac", "palpitation", "hypertension"],
  },
  {
    specialization: "Dentistry",
    keywords: ["tooth", "teeth", "gum", "dental", "mouth", "cavity", "jaw"],
  },
  {
    specialization: "Neurology",
    keywords: ["brain", "headache", "migraine", "nerve", "seizure", "dizziness", "numbness"],
  },
  {
    specialization: "Orthopedics",
    keywords: ["bone", "joint", "fracture", "back pain", "knee", "shoulder", "sprain", "neck"],
  },
  {
    specialization: "Pediatrics",
    keywords: ["child", "baby", "kids", "fever", "pediatric", "vaccination", "infant"],
  },
  {
    specialization: "Dermatology",
    keywords: ["skin", "rash", "allergy", "acne", "hair", "itching", "eczema", "pimple"],
  },
];

const Doctors = () => {
  const { user } = useContext(AuthContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedSpecialization = searchParams.get("specialization") || "";
  const urlSearch = searchParams.get("search") || "";
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState(urlSearch);
  const [maxFee, setMaxFee] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setSearch(urlSearch);
  }, [urlSearch]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await API.get("/doctors");
        setDoctors(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Could not load doctors");
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  const filteredDoctors = useMemo(() => {
    const query = search.trim().toLowerCase();
    const feeLimit = maxFee ? Number(maxFee) : null;
    const specializationFilter = selectedSpecialization.trim().toLowerCase();

    return doctors.filter((doctor) => {
      const doctorSpecialization = (doctor.specialization || "").toLowerCase();
      const matchingHealthIssue = healthIssueSpecializations.some((item) => {
        const matchesDoctor =
          doctorSpecialization.includes(item.specialization.toLowerCase());
        const matchesQuery = item.keywords.some((keyword) =>
          query.includes(keyword)
        );

        return matchesDoctor && matchesQuery;
      });
      const searchable = [
        doctor.userId?.name,
        doctor.specialization,
        ...(doctor.availability || [])
      ].join(" ").toLowerCase();
      const matchesSearch =
        !query || searchable.includes(query) || matchingHealthIssue;
      const matchesFee = feeLimit === null || Number(doctor.fees) <= feeLimit;
      const matchesSpecialization =
        !specializationFilter ||
        doctorSpecialization.includes(specializationFilter) ||
        (doctorSpecialization &&
          specializationFilter.includes(doctorSpecialization));

      return matchesSearch && matchesFee && matchesSpecialization;
    });
  }, [doctors, maxFee, search, selectedSpecialization]);

  const clearSpecialization = () => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete("specialization");
    setSearchParams(nextParams);
  };

  return (
    <>
      <Navbar />
      <main className="page-container">
        <div className="page-header">
          <div>
            <p className="eyebrow">Care directory</p>
            <h1 className="page-title">
              {selectedSpecialization
                ? `${selectedSpecialization} doctors`
                : "Available doctors"}
            </h1>
            <p className="page-subtitle">
              {selectedSpecialization
                ? `${filteredDoctors.length} doctor${filteredDoctors.length === 1 ? "" : "s"} available in ${selectedSpecialization}.`
                : "Search by health issue, doctor name, specialty, or slot before checking live availability."}
            </p>
          </div>
          <div className="panel px-4 py-3 text-sm font-bold text-slate-600">
            {selectedSpecialization
              ? `${filteredDoctors.length} available`
              : `${doctors.length} approved`}
          </div>
        </div>

        {selectedSpecialization && (
          <div className="mb-5 flex flex-wrap items-center gap-3 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-bold text-blue-800">
            Showing {selectedSpecialization} doctors
            <button
              type="button"
              onClick={clearSpecialization}
              className="rounded-lg bg-white px-3 py-2 text-blue-700 shadow-sm hover:bg-blue-100"
            >
              Show all
            </button>
          </div>
        )}

        {loading && <p className="empty-state">Loading doctors...</p>}
        {error && <p className="alert alert-error">{error}</p>}
        {!loading && !error && doctors.length === 0 && (
          <p className="empty-state">No approved doctors are available yet.</p>
        )}

        {!loading && doctors.length > 0 && (
          <section className="card mb-5 grid gap-4 p-4 md:grid-cols-[1fr_220px]">
            <div>
              <label className="field-label" htmlFor="doctor-search">Search doctors</label>
              <input
                id="doctor-search"
                className="field"
                placeholder="Search heart pain, skin rash, doctor, specialty, or slot"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div>
              <label className="field-label" htmlFor="max-fee">Max fee</label>
              <input
                id="max-fee"
                className="field"
                type="number"
                min="0"
                placeholder="Any fee"
                value={maxFee}
                onChange={(e) => setMaxFee(e.target.value)}
              />
            </div>
          </section>
        )}

        {!loading && doctors.length > 0 && filteredDoctors.length === 0 && (
          <p className="empty-state">No doctors match your filters.</p>
        )}

        <div className="grid gap-5">
          {filteredDoctors.map((doc) => (
            <section key={doc._id} className="card p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="w-full">
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        doc.photoUrl ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(doc.userId?.name || "Doctor")}&background=0f766e&color=fff&size=120`
                      }
                      alt={doc.userId?.name || "Doctor"}
                      className="h-14 w-14 rounded-lg object-cover"
                    />
                    <div>
                      <h2 className="text-xl font-black text-slate-950">{doc.userId?.name || "Doctor"}</h2>
                      <p className="font-bold text-teal-700">{doc.specialization}</p>
                      {doc.degree && <p className="text-sm font-semibold text-slate-500">{doc.degree}</p>}
                    </div>
                  </div>
                  <div className="meta-grid mt-5">
                    <div className="metric">
                      <p className="metric-label">Experience</p>
                      <p className="metric-value">{doc.experience} years</p>
                    </div>
                    <div className="metric">
                      <p className="metric-label">Consultation fee</p>
                      <p className="metric-value">{doc.fees}</p>
                    </div>
                    <div className="metric">
                      <p className="metric-label">Mode</p>
                      <p className="metric-value capitalize">{doc.consultationMode || "clinic"}</p>
                    </div>
                  </div>
                  {doc.clinicAddress && (
                    <p className="mt-4 text-sm font-semibold text-slate-600">
                      Clinic: {doc.clinicAddress}
                    </p>
                  )}
                  {doc.availability?.length > 0 && (
                    <p className="mt-4 text-sm font-semibold text-slate-600">
                      Default slots: {doc.availability.join(", ")}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <Link to={`/doctors/${doc._id}`} className="btn btn-primary">
                  View profile and slots
                </Link>
                {!user && (
                  <Link to="/login" className="btn btn-secondary">
                    Login to book
                  </Link>
                )}
              </div>
            </section>
          ))}
        </div>
      </main>
    </>
  );
};

export default Doctors;
