import express from "express";
import {
  getAdminAppointments,
  getAdminDashboard,
  updateAdminAppointmentStatus
} from "../controllers/adminController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.use(protect, authorizeRoles("admin"));

router.get("/dashboard", getAdminDashboard);
router.get("/appointments", getAdminAppointments);
router.put("/appointments/:id/status", updateAdminAppointmentStatus);

export default router;
