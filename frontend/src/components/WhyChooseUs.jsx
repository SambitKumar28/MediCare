import {
  FaUserCheck,
  FaShieldAlt,
  FaBell,
  FaHeadset,
} from "react-icons/fa";

const features = [
  {
    icon: <FaUserCheck />,
    title: "Verified Doctors",
    description:
      "Connect with trusted and certified healthcare professionals.",
  },
  {
    icon: <FaShieldAlt />,
    title: "Secure Booking",
    description:
      "Your personal and appointment data stays protected.",
  },
  {
    icon: <FaBell />,
    title: "Instant Notifications",
    description:
      "Receive booking confirmations and appointment reminders.",
  },
  {
    icon: <FaHeadset />,
    title: "24/7 Support",
    description:
      "Get assistance whenever you need help with appointments.",
  },
];

const WhyChooseUs = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}
        <div className="text-center mb-16">
          <span className="text-blue-600 font-semibold uppercase">
            Why Choose Us
          </span>

          <h2 className="text-4xl font-bold text-gray-800 mt-3">
            Better Healthcare Experience
          </h2>

          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            We make healthcare simple, secure, and accessible by
            connecting patients with trusted doctors through a
            seamless digital platform.
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

          {features.map((feature, index) => (
            <div
              key={index}
              className="
                bg-gradient-to-br
                from-blue-50
                to-indigo-100
                p-8
                rounded-3xl
                shadow-md
                hover:shadow-2xl
                transition-all
                duration-300
              "
            >
              <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-white shadow-md text-blue-600 text-3xl mb-6">
                {feature.icon}
              </div>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                {feature.title}
              </h3>

              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
