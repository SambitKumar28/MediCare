import { FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Action = () => {
  const navigate = useNavigate();

  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto">

        <div
          className="
            relative
            overflow-hidden
            rounded-[40px]
            bg-gradient-to-r
            from-blue-600
            via-indigo-600
            to-purple-600
            p-12
            md:p-20
            text-white
          "
        >
          {/* Background Blur */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>

          <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>

          <div className="relative z-10 grid lg:grid-cols-2 gap-10 items-center">

            {/* Content */}
            <div>
              <span className="uppercase tracking-wider text-blue-100 font-medium">
                Book Appointment Today
              </span>

              <h2 className="text-4xl md:text-5xl font-bold mt-4 leading-tight">
                Your Health Deserves The Best Care
              </h2>

              <p className="mt-6 text-lg text-blue-100 leading-relaxed">
                Connect with experienced doctors, schedule appointments
                instantly, and manage your healthcare journey from anywhere.
              </p>

              <div className="flex flex-wrap gap-4 mt-8">

                <button
                  onClick={() => navigate("/doctors")}
                  className="
                    bg-white
                    text-blue-700
                    px-8
                    py-4
                    rounded-xl
                    font-semibold
                    hover:scale-105
                    transition
                  "
                >
                  Find Doctors
                </button>

                <button
                  onClick={() => navigate("/login")}
                  className="
                    border
                    border-white
                    px-8
                    py-4
                    rounded-xl
                    font-semibold
                    flex
                    items-center
                    gap-2
                    hover:bg-white
                    hover:text-blue-700
                    transition
                  "
                >
                  Get Started
                  <FaArrowRight />
                </button>

              </div>
            </div>

            {/* Right Side */}
            <div className="hidden lg:flex justify-center">
              <img
                src="/doctor-banner.png"
                alt="Doctor"
                className="w-[400px]"
              />
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default Action;
