import express from "express";
import {
  bookAppointment,
  confirmAppointment,
  getAppointmentById,
  getMyAppointments,
  getDoctorAppointments,
  cancelAppointment,
  rescheduleAppointment
} from "../controllers/appointmentController.js";

import { protect } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";

const router = express.Router();

// Patient books
router.post("/", protect, authorizeRoles("patient"), bookAppointment);

// Patient view
router.get("/my", protect, authorizeRoles("patient"), getMyAppointments);

// Patient reschedules
router.put("/reschedule/:id", protect, authorizeRoles("patient"), rescheduleAppointment);

// Doctor view
router.get("/doctor", protect, authorizeRoles("doctor"), getDoctorAppointments);

// Appointment summary/details
router.get("/:id", protect, getAppointmentById);

// Doctor/admin confirm
router.put("/confirm/:id", protect, authorizeRoles("doctor", "admin"), confirmAppointment);

// Cancel
router.put("/cancel/:id", protect, cancelAppointment);

export default router;
