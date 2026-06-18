import { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const FeaturedDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await API.get("/doctors");
        setDoctors(response.data.slice(0, 6));
      } catch {
        setDoctors([]);
      }
    };

    fetchDoctors();
  }, []);

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}
        <div className="text-center mb-16">
          <span className="text-blue-600 font-semibold uppercase">
            Our Doctors
          </span>

          <h2 className="text-4xl font-bold text-gray-800 mt-3">
            Meet Our Specialists
          </h2>

          <p className="text-gray-600 mt-4">
            Connect with experienced doctors from multiple specialties.
          </p>
        </div>

        {/* Doctors Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">

          {doctors.map((doctor) => (
            <div
              key={doctor._id}
              className="
                bg-white
                rounded-3xl
                overflow-hidden
                shadow-lg
                hover:shadow-2xl
                transition-all
              "
            >
              {/* Image */}
              <div className="relative">
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.userId?.name || "Doctor")}&background=0f766e&color=fff&size=320`}
                  alt={doctor.userId?.name || "Doctor"}
                  className="w-full h-72 object-cover"
                />

                <span
                  className={`
                    absolute top-4 right-4 px-3 py-1 text-sm rounded-full
                    ${
                      doctor.approved
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                    }
                  `}
                >
                  {doctor.approved
                    ? "Available"
                    : "Unavailable"}
                </span>
              </div>

              {/* Content */}
              <div className="p-6">

                <h3 className="text-xl font-bold text-gray-800">
                  {doctor.userId?.name || "Doctor"}
                </h3>

                <p className="text-blue-600 mt-2">
                  {doctor.specialization}
                </p>

                <p className="text-gray-500 mt-2">
                  {doctor.experience} years experience
                </p>

                <div className="flex items-center gap-2 mt-4">
                  <FaStar className="text-yellow-400" />
                  <span>4.9 Rating</span>
                </div>

                <button
                  onClick={() =>
                    navigate(`/doctors/${doctor._id}`)
                  }
                  className="
                    mt-6
                    w-full
                    bg-blue-600
                    hover:bg-blue-700
                    text-white
                    py-3
                    rounded-xl
                    transition
                  "
                >
                  Book Appointment
                </button>

              </div>
            </div>
          ))}

        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <button
            onClick={() => navigate("/doctors")}
            className="
              border-2
              border-blue-600
              text-blue-600
              hover:bg-blue-600
              hover:text-white
              px-8
              py-3
              rounded-xl
              transition
            "
          >
            View All Doctors
          </button>
        </div>

      </div>
    </section>
  );
};

export default FeaturedDoctors;
