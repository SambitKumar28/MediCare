import {
  FaUserMd,
  FaCalendarCheck,
  FaHeartbeat,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const features = [
  {
    icon: <FaUserMd />,
    title: "Expert Doctors",
    description: "Consult with highly qualified and experienced doctors.",
  },
  {
    icon: <FaCalendarCheck />,
    title: "Easy Booking",
    description: "Book appointments instantly without waiting in queues.",
  },
  {
    icon: <FaHeartbeat />,
    title: "Quality Care",
    description: "Receive personalized healthcare services anytime.",
  },
];

const About = () => {
  const navigate = useNavigate();

  return (
    <section id="about" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">

        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Left Side */}
          <div>
            <span className="text-blue-600 font-semibold uppercase">
              About Us
            </span>

            <h2 className="text-4xl font-bold mt-3 mb-6 text-gray-800">
              Simplifying Healthcare For Everyone
            </h2>

            <p className="text-gray-600 leading-relaxed mb-8">
              Our platform connects patients with trusted doctors,
              making appointment booking fast, secure, and hassle-free.
              Find specialists, schedule visits, and manage your
              healthcare journey in one place.
            </p>

            <button
              type="button"
              onClick={() => navigate("/doctors")}
              className="bg-blue-600 hover:bg-blue-700 transition text-white px-7 py-3 rounded-xl"
            >
              Explore Doctors
            </button>
          </div>

          {/* Right Side */}
          <div className="grid gap-6">
            {features.map((item, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition"
              >
                <div className="flex items-start gap-4">

                  <div className="text-3xl text-blue-600">
                    {item.icon}
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      {item.title}
                    </h3>

                    <p className="text-gray-600 mt-2">
                      {item.description}
                    </p>
                  </div>

                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};

export default About;
