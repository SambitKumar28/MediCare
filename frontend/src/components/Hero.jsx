import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  const scrollToAbout = () => {
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="bg-gradient-to-r from-blue-50 to-indigo-100 py-20">
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center">

        <div className="md:w-1/2">
          <h1 className="text-5xl font-bold text-gray-800 mb-6">
            Book Your Doctor Appointment Online
          </h1>

          <p className="text-lg text-gray-600 mb-8">
            Find experienced doctors and schedule appointments instantly.
          </p>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate("/doctors")}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              Book Now
            </button>

            <button
              type="button"
              onClick={scrollToAbout}
              className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg"
            >
              Learn More
            </button>
          </div>
        </div>

        <div className="md:w-1/2 mt-10 md:mt-0">
          <img
            src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d"
            alt="doctor"
            className="rounded-xl shadow-lg"
          />
        </div>

      </div>
    </section>
  );
};

export default Hero;
