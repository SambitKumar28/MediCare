import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Stethoscope } from "lucide-react";
import API from "../services/api";
import { AuthContext } from "../context/AuthContextValue";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const routeForRole = (role) => {
    if (role === "doctor") return "/doctor/profile";
    if (role === "admin") return "/admin/doctors";
    return "/doctors";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await API.post("/auth/login", { email, password });

      login(res.data);
      navigate(routeForRole(res.data.user.role));
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-cyan-50 via-white to-blue-100">

      {/* Left Side */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-teal-600 to-cyan-700 text-white p-12 flex-col justify-center">
        <div className="max-w-lg">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 rounded-xl bg-white/20 backdrop-blur">
              <Stethoscope size={30} />
            </div>
            <h1 className="text-3xl font-bold">MediCare</h1>
          </div>

          <h2 className="text-5xl font-bold leading-tight mb-6">
            Smart Healthcare
            <br />
            Appointment System
          </h2>

          <p className="text-lg text-cyan-100 leading-8">
            Manage appointments seamlessly. Connect patients,
            doctors, and administrators through one powerful platform.
          </p>

          <div className="grid gap-4 mt-10">
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              ✓ Easy appointment scheduling
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              ✓ Role-based dashboards
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              ✓ Secure medical records
            </div>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex-1 flex justify-center items-center px-6 py-10">
        <div className="w-full max-w-md">

          <div className="bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl p-8 border border-white/20">

            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-800">
                Welcome Back 👋
              </h2>
              <p className="text-slate-500 mt-2">
                Login to access your dashboard
              </p>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 border border-red-200 rounded-xl p-3 mb-4 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Email */}
              <div className="mb-5">
                <label className="block mb-2 text-sm font-medium text-slate-700">
                  Email Address
                </label>

                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  required
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Password */}
              <div className="mb-6">
                <label className="block mb-2 text-sm font-medium text-slate-700">
                  Password
                </label>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    value={password}
                    required
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                <div className="text-right mt-2">
                  <Link
                    to="/forgot-password"
                    className="text-sm text-teal-600 hover:text-teal-700"
                  >
                    Forgot Password?
                  </Link>
                </div>
              </div>

              {/* Login Button */}
              <button
                disabled={loading}
                className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                {loading ? "Signing In..." : "Login"}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center my-6">
              <div className="flex-1 border-t"></div>
              <span className="px-4 text-sm text-slate-400">OR</span>
              <div className="flex-1 border-t"></div>
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-2 gap-3">
              <button className="border rounded-xl py-3 hover:bg-slate-50">
                Google
              </button>
              <button className="border rounded-xl py-3 hover:bg-slate-50">
                Facebook
              </button>
            </div>

            <p className="text-center mt-6 text-slate-600">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-teal-600 font-semibold"
              >
                Register
              </Link>
            </p>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;