import Appointment from "../models/Appointment.js";
import Doctor from "../models/Doctor.js";
import User from "../models/User.js";
import { createNotification } from "./notificationController.js";

const populateAppointment = (query) =>
  query
    .populate("patientId", "name email role")
    .populate({
      path: "doctorId",
      populate: { path: "userId", select: "name email role" }
    });

export const getAdminDashboard = async (req, res) => {
  try {
    const [users, doctors, appointments] = await Promise.all([
      User.find().select("-password").sort({ createdAt: -1 }),
      Doctor.find().populate("userId", "name email role").sort({ createdAt: -1 }),
      populateAppointment(Appointment.find().sort({ date: 1, time: 1 }))
    ]);

    const appointmentStatus = appointments.reduce(
      (totals, appointment) => {
        totals[appointment.status] = (totals[appointment.status] || 0) + 1;
        return totals;
      },
      { pending: 0, confirmed: 0, cancelled: 0 }
    );

    res.json({
      stats: {
        users: users.length,
        patients: users.filter((user) => user.role === "patient").length,
        doctors: doctors.length,
        approvedDoctors: doctors.filter((doctor) => doctor.approved).length,
        pendingDoctors: doctors.filter((doctor) => !doctor.approved).length,
        appointments: appointments.length,
        ...appointmentStatus
      },
      users,
      doctors,
      appointments
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAdminAppointments = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status && status !== "all" ? { status } : {};
    const appointments = await populateAppointment(
      Appointment.find(filter).sort({ date: 1, time: 1 })
    );

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateAdminAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["pending", "confirmed", "cancelled"].includes(status)) {
      return res.status(400).json({ message: "Invalid appointment status" });
    }

    const appointment = await populateAppointment(
      Appointment.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true, runValidators: true }
      )
    );

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    await Promise.all([
      createNotification({
        userId: appointment.patientId?._id,
        title: `Appointment ${status}`,
        message: `Your appointment on ${appointment.date} at ${appointment.time} was marked ${status}.`,
        appointmentId: appointment._id
      }),
      createNotification({
        userId: appointment.doctorId?.userId?._id,
        title: `Appointment ${status}`,
        message: `Appointment with ${appointment.patientId?.name || "patient"} on ${appointment.date} at ${appointment.time} was marked ${status}.`,
        appointmentId: appointment._id
      })
    ]);

    res.json({
      message: "Appointment status updated",
      appointment
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
