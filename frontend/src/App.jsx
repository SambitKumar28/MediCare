import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AppointmentSummary from "./pages/AppointmentSummary";
import Doctors from "./pages/Doctors";
import PublicDoctorProfile from "./pages/PublicDoctorProfile";
import MyAppointments from "./pages/MyAppointments";
import DoctorProfile from "./pages/DoctorProfile";
import DoctorAppointments from "./pages/DoctorAppointments";
import AdminDoctors from "./pages/AdminDoctors";

import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Public doctor listing */}
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/doctors/:id" element={<PublicDoctorProfile />} />

        {/* Patient Routes */}
        <Route
          path="/appointments"
          element={
            <ProtectedRoute roles={["patient"]}>
              <MyAppointments />
            </ProtectedRoute>
          }
        />

        <Route
          path="/appointments/:id"
          element={
            <ProtectedRoute>
              <AppointmentSummary />
            </ProtectedRoute>
          }
        />

        {/* Doctor Routes */}
        <Route
          path="/doctor/profile"
          element={
            <ProtectedRoute roles={["doctor"]}>
              <DoctorProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/doctor/appointments"
          element={
            <ProtectedRoute roles={["doctor"]}>
              <DoctorAppointments />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin/doctors"
          element={
            <ProtectedRoute roles={["admin"]}>
              <AdminDoctors />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
