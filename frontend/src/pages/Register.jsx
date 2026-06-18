import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, User, Stethoscope } from "lucide-react";
import { AuthContext } from "../context/AuthContextValue";
import API from "../services/api";
import Navbar from "../components/Navbar";

const Register = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "patient",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const res = await API.post("/auth/register", form);

      login(res.data);

      navigate(
        form.role === "doctor"
          ? "/doctor/profile"
          : "/doctors"
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen flex bg-gradient-to-br from-cyan-50 via-white to-blue-100">

        {/* LEFT SECTION */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-teal-600 to-cyan-700 text-white p-12 flex-col justify-center">

          <div className="max-w-lg">

            <div className="flex items-center gap-3 mb-8">
              <div className="bg-white/20 p-3 rounded-xl">
                <Stethoscope size={28} />
              </div>

              <h1 className="text-3xl font-bold">
                MediCare
              </h1>
            </div>

            <h2 className="text-5xl font-bold leading-tight">
              Join Our Healthcare Network
            </h2>

            <p className="mt-6 text-cyan-100 text-lg leading-8">
              Create your account and connect with
              patients, doctors, and healthcare
              providers through one secure platform.
            </p>

            <div className="space-y-4 mt-10">
              <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                ✓ Easy appointment scheduling
              </div>

              <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                ✓ Doctor profile management
              </div>

              <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                ✓ Secure patient records
              </div>
            </div>

          </div>
        </div>

        {/* REGISTER FORM */}
        <div className="flex-1 flex items-center justify-center px-6 py-10">

          <div className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">

            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-slate-800">
                Create Account
              </h1>

              <p className="text-slate-500 mt-2">
                Join the doctor appointment system
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-3 mb-4 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>

              {/* NAME */}
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-slate-700">
                  Full Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>

              {/* EMAIL */}
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-slate-700">
                  Email Address
                </label>

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>

              {/* PASSWORD */}
              <div className="mb-5">
                <label className="block mb-2 text-sm font-medium text-slate-700">
                  Password
                </label>

                <div className="relative">

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    minLength={6}
                    required
                    placeholder="Minimum 6 characters"
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
                  >
                    {showPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>

                </div>
              </div>

              {/* ROLE SELECTION */}
              <div className="mb-6">

                <label className="block mb-3 text-sm font-medium text-slate-700">
                  Select Role
                </label>

                <div className="grid grid-cols-2 gap-3">

                  <button
                    type="button"
                    onClick={() =>
                      setForm({
                        ...form,
                        role: "patient",
                      })
                    }
                    className={`border rounded-xl p-4 transition ${
                      form.role === "patient"
                        ? "border-teal-500 bg-teal-50"
                        : "border-slate-200"
                    }`}
                  >
                    <User
                      size={24}
                      className="mx-auto mb-2"
                    />

                    <p className="font-medium">
                      Patient
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setForm({
                        ...form,
                        role: "doctor",
                      })
                    }
                    className={`border rounded-xl p-4 transition ${
                      form.role === "doctor"
                        ? "border-teal-500 bg-teal-50"
                        : "border-slate-200"
                    }`}
                  >
                    <Stethoscope
                      size={24}
                      className="mx-auto mb-2"
                    />

                    <p className="font-medium">
                      Doctor
                    </p>
                  </button>

                </div>

              </div>

              {/* SUBMIT BUTTON */}
              <button
                disabled={loading}
                className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition"
              >
                {loading
                  ? "Creating Account..."
                  : "Create Account"}
              </button>

            </form>

            <p className="mt-6 text-center text-slate-600">
              Already have an account?{" "}
              <Link
                to="/"
                className="font-semibold text-teal-600"
              >
                Login
              </Link>
            </p>

          </div>

        </div>
      </div>
    </>
  );
};

export default Register;