import Appointment from "../models/Appointment.js";
import Doctor from "../models/Doctor.js";
import { getDoctorSlotsForDate } from "./doctorController.js";
import { createNotification } from "./notificationController.js";

const populateAppointment = (query) =>
  query
    .populate("patientId", "name email role")
    .populate({
      path: "doctorId",
      populate: { path: "userId", select: "name email role" }
    });

const validateAppointmentSlot = async ({ doctorId, date, time, excludeAppointmentId }) => {
  if (!doctorId || !date || !time) {
    return { error: "Doctor, date and time are required" };
  }

  const selectedDate = new Date(`${date}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (Number.isNaN(selectedDate.getTime()) || selectedDate < today) {
    return { error: "Choose a valid upcoming date" };
  }

  const doctor = await Doctor.findById(doctorId);
  if (!doctor || !doctor.approved) {
    return { error: "Doctor not available", status: 404 };
  }

  const slotsForDate = getDoctorSlotsForDate(doctor, date);
  if (slotsForDate.length === 0) {
    return { error: "No slots available for this date" };
  }

  if (slotsForDate.length > 0 && !slotsForDate.includes(time)) {
    return { error: "Choose one of the doctor's available slots" };
  }

  const existing = await Appointment.findOne({
    _id: { $ne: excludeAppointmentId },
    doctorId,
    date,
    time,
    status: { $ne: "cancelled" }
  });

  if (existing) {
    return { error: "Slot already booked" };
  }

  return { doctor };
};

const notifyAppointmentBooked = async (appointment) => {
  const populated = await populateAppointment(Appointment.findById(appointment._id));
  const doctorName = populated.doctorId?.userId?.name || "your doctor";
  const patientName = populated.patientId?.name || "A patient";

  await Promise.all([
    createNotification({
      userId: populated.patientId?._id,
      title: "Appointment booked",
      message: `Your appointment with ${doctorName} is booked for ${populated.date} at ${populated.time}.`,
      appointmentId: populated._id
    }),
    createNotification({
      userId: populated.doctorId?.userId?._id,
      title: "New appointment request",
      message: `${patientName} booked ${populated.date} at ${populated.time}.`,
      appointmentId: populated._id
    })
  ]);

  return populated;
};

const notifyPatientStatus = async (appointment, title, statusText) => {
  const populated = await populateAppointment(Appointment.findById(appointment._id));
  const doctorName = populated.doctorId?.userId?.name || "your doctor";

  await createNotification({
    userId: populated.patientId?._id,
    title,
    message: `Your appointment with ${doctorName} on ${populated.date} at ${populated.time} was ${statusText}.`,
    appointmentId: populated._id
  });

  return populated;
};

// Book Appointment
export const bookAppointment = async (req, res) => {
  try {
    const { doctorId, date, time } = req.body;

    const { error, status } = await validateAppointmentSlot({ doctorId, date, time });
    if (error) {
      return res.status(status || 400).json({ message: error });
    }

    const appointment = await Appointment.create({
      patientId: req.user._id,
      doctorId,
      date,
      time
    });
    const populatedAppointment = await notifyAppointmentBooked(appointment);

    res.status(201).json({
      message: "Appointment booked successfully",
      appointment: populatedAppointment
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Patient's Appointments
export const getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      patientId: req.user._id
    })
      .populate({
        path: "doctorId",
        populate: { path: "userId", select: "name email" }
      })
      .sort({ date: 1, time: 1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Doctor's Appointments
export const getDoctorAppointments = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.user._id });
    if (!doctor) {
      return res.status(404).json({ message: "Doctor profile not found" });
    }

    const appointments = await Appointment.find({
      doctorId: doctor._id
    })
      .populate("patientId", "name email")
      .sort({ date: 1, time: 1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Confirm Appointment
export const confirmAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (req.user.role === "doctor") {
      const doctor = await Doctor.findOne({ userId: req.user._id });
      if (!doctor || !appointment.doctorId.equals(doctor._id)) {
        return res.status(403).json({ message: "You cannot confirm this appointment" });
      }
    } else if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    if (appointment.status === "cancelled") {
      return res.status(400).json({ message: "Cancelled appointments cannot be confirmed" });
    }

    appointment.status = "confirmed";
    await appointment.save();
    const populatedAppointment = await notifyPatientStatus(
      appointment,
      "Appointment confirmed",
      "confirmed"
    );

    res.json({ message: "Appointment confirmed", appointment: populatedAppointment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get one appointment for booking summary/details
export const getAppointmentById = async (req, res) => {
  try {
    const appointment = await populateAppointment(Appointment.findById(req.params.id));

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    const isPatient = appointment.patientId?._id.equals(req.user._id);
    const isAdmin = req.user.role === "admin";
    let isDoctor = false;

    if (req.user.role === "doctor") {
      const doctor = await Doctor.findOne({ userId: req.user._id });
      isDoctor = Boolean(doctor && appointment.doctorId?._id.equals(doctor._id));
    }

    if (!isPatient && !isDoctor && !isAdmin) {
      return res.status(403).json({ message: "You cannot view this appointment" });
    }

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Reschedule Patient Appointment
export const rescheduleAppointment = async (req, res) => {
  try {
    const { date, time } = req.body;
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (!appointment.patientId.equals(req.user._id)) {
      return res.status(403).json({ message: "You cannot reschedule this appointment" });
    }

    if (appointment.status === "cancelled") {
      return res.status(400).json({ message: "Cancelled appointments cannot be rescheduled" });
    }

    const { error, status } = await validateAppointmentSlot({
      doctorId: appointment.doctorId,
      date,
      time,
      excludeAppointmentId: appointment._id
    });

    if (error) {
      return res.status(status || 400).json({ message: error });
    }

    appointment.date = date;
    appointment.time = time;
    appointment.status = "pending";
    await appointment.save();

    const updatedAppointment = await populateAppointment(Appointment.findById(appointment._id));

    await Promise.all([
      createNotification({
        userId: updatedAppointment.patientId?._id,
        title: "Appointment rescheduled",
        message: `Your appointment was rescheduled to ${updatedAppointment.date} at ${updatedAppointment.time}.`,
        appointmentId: updatedAppointment._id
      }),
      createNotification({
        userId: updatedAppointment.doctorId?.userId?._id,
        title: "Appointment rescheduled",
        message: `${updatedAppointment.patientId?.name || "A patient"} rescheduled to ${updatedAppointment.date} at ${updatedAppointment.time}.`,
        appointmentId: updatedAppointment._id
      })
    ]);

    res.json({
      message: "Appointment rescheduled successfully",
      appointment: updatedAppointment
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cancel Appointment
export const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (req.user.role === "patient" && !appointment.patientId.equals(req.user._id)) {
      return res.status(403).json({ message: "You cannot cancel this appointment" });
    }

    if (req.user.role === "doctor") {
      const doctor = await Doctor.findOne({ userId: req.user._id });
      if (!doctor || !appointment.doctorId.equals(doctor._id)) {
        return res.status(403).json({ message: "You cannot cancel this appointment" });
      }
    }

    if (appointment.status === "cancelled") {
      return res.status(400).json({ message: "Appointment already cancelled" });
    }

    appointment.status = "cancelled";
    await appointment.save();
    const populatedAppointment = await populateAppointment(Appointment.findById(appointment._id));

    if (req.user.role === "patient") {
      await createNotification({
        userId: populatedAppointment.doctorId?.userId?._id,
        title: "Appointment cancelled",
        message: `${populatedAppointment.patientId?.name || "A patient"} cancelled ${populatedAppointment.date} at ${populatedAppointment.time}.`,
        appointmentId: populatedAppointment._id
      });
    } else {
      await createNotification({
        userId: populatedAppointment.patientId?._id,
        title: "Appointment cancelled",
        message: `Your appointment on ${populatedAppointment.date} at ${populatedAppointment.time} was cancelled.`,
        appointmentId: populatedAppointment._id
      });
    }

    res.json({ message: "Appointment cancelled", appointment: populatedAppointment });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
