import {
  FaHeart,
  FaTooth,
  FaBrain,
  FaBone,
  FaChild,
  FaAllergies,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const specializations = [
  {
    icon: <FaHeart />,
    title: "Cardiology",
  },
  {
    icon: <FaTooth />,
    title: "Dentistry",
  },
  {
    icon: <FaBrain />,
    title: "Neurology",
  },
  {
    icon: <FaBone />,
    title: "Orthopedics",
  },
  {
    icon: <FaChild />,
    title: "Pediatrics",
  },
  {
    icon: <FaAllergies />,
    title: "Dermatology",
  },
];

const Specializations = () => {
  const navigate = useNavigate();

  const openSpecialization = (title) => {
    navigate(`/doctors?specialization=${encodeURIComponent(title)}`);
  };

  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}
        <div className="text-center mb-16">
          <span className="text-blue-600 font-semibold uppercase">
            Specializations
          </span>

          <h2 className="text-4xl font-bold text-gray-800 mt-3">
            Find Doctors by Specialty
          </h2>

          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Explore a wide range of medical specialties and connect
            with experienced healthcare professionals.
          </p>
        </div>

        {/* Cards */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">

          {specializations.map((item, index) => (
            <button
              key={index}
              type="button"
              onClick={() => openSpecialization(item.title)}
              className="
                bg-white
                rounded-3xl
                p-8
                text-center
                shadow-md
                hover:shadow-2xl
                transition-all
                duration-300
                cursor-pointer
                hover:-translate-y-1
              "
            >
              <div
                className="
                  w-16 h-16
                  mx-auto
                  mb-5
                  rounded-2xl
                  flex
                  items-center
                  justify-center
                  bg-blue-100
                  text-blue-600
                  text-3xl
                "
              >
                {item.icon}
              </div>

              <h3 className="font-semibold text-gray-800">
                {item.title}
              </h3>
            </button>
          ))}

        </div>

      </div>
    </section>
  );
};

export default Specializations;
