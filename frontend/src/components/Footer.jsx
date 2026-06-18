import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";

import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-white">

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 py-16">

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Company */}
          <div>
            <h2 className="text-2xl font-bold mb-4">
              MedCare
            </h2>

            <p className="text-slate-400 leading-relaxed">
              Book appointments with trusted doctors anytime,
              anywhere. Making healthcare accessible and
              convenient for everyone.
            </p>

            <div className="flex gap-4 mt-6">

              <a
                href="#"
                className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 transition"
              >
                <FaFacebookF />
              </a>

              <a
                href="#"
                className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-sky-500 transition"
              >
                <FaTwitter />
              </a>

              <a
                href="#"
                className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-pink-600 transition"
              >
                <FaInstagram />
              </a>

              <a
                href="#"
                className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-700 transition"
              >
                <FaLinkedinIn />
              </a>

            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-5">
              Quick Links
            </h3>

            <ul className="space-y-3 text-slate-400">

              <li>
                <Link
                  to="/"
                  className="hover:text-white transition"
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  to="/doctors"
                  className="hover:text-white transition"
                >
                  Doctors
                </Link>
              </li>

              <li>
                <Link
                  to="/about"
                  className="hover:text-white transition"
                >
                  About
                </Link>
              </li>

              <li>
                <Link
                  to="/contact"
                  className="hover:text-white transition"
                >
                  Contact
                </Link>
              </li>

            </ul>
          </div>

          {/* Specializations */}
          <div>
            <h3 className="text-lg font-semibold mb-5">
              Specializations
            </h3>

            <ul className="space-y-3 text-slate-400">

              <li>Cardiology</li>
              <li>Neurology</li>
              <li>Dentistry</li>
              <li>Orthopedics</li>
              <li>Dermatology</li>

            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-5">
              Contact Us
            </h3>

            <div className="space-y-4 text-slate-400">

              <div className="flex gap-3">
                <FaPhoneAlt className="mt-1" />
                <span>+91 98765 43210</span>
              </div>

              <div className="flex gap-3">
                <FaEnvelope className="mt-1" />
                <span>support@medcare.com</span>
              </div>

              <div className="flex gap-3">
                <FaMapMarkerAlt className="mt-1" />
                <span>Bangalore, Karnataka, India</span>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center">

          <p className="text-slate-400 text-sm">
            &copy; {new Date().getFullYear()} MedCare. All Rights Reserved.
          </p>

          <div className="flex gap-6 mt-4 md:mt-0 text-sm text-slate-400">

            <Link
              to="/privacy-policy"
              className="hover:text-white"
            >
              Privacy Policy
            </Link>

            <Link
              to="/terms"
              className="hover:text-white"
            >
              Terms & Conditions
            </Link>

          </div>

        </div>
      </div>

    </footer>
  );
};

export default Footer;
