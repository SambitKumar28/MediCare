import express from "express";
import {
    approveDoctor,
    createDoctorProfile,
    getAllDoctors,
    getDoctorDetails,
    getMyDoctorProfile,
    getPendingDoctors,
    updateMyDoctorProfile
} from "../controllers/doctorController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";


const router = express.Router();

//Doctors create profile
router.post("/create", protect, authorizeRoles("doctor"), createDoctorProfile);
router.get("/me", protect, authorizeRoles("doctor"), getMyDoctorProfile);
router.put("/me", protect, authorizeRoles("doctor"), updateMyDoctorProfile);

//public route
router.get("/", getAllDoctors);

//Admin approve doctors
router.get("/pending", protect, authorizeRoles("admin"), getPendingDoctors);
router.put("/approve/:id", protect, authorizeRoles("admin"), approveDoctor);

// Public doctor profile and availability
router.get("/:id", getDoctorDetails);

export default router;
