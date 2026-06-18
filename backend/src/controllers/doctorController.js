import Doctor from '../models/Doctor.js';
import Appointment from "../models/Appointment.js";

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const normalizeSlots = (slots) =>
    Array.isArray(slots) ? slots.map((slot) => String(slot).trim()).filter(Boolean) : [];

export const getDoctorSlotsForDate = (doctor, date) => {
    const selectedDate = new Date(`${date}T00:00:00`);
    const day = days[selectedDate.getDay()];
    const dayAvailability = doctor.weeklyAvailability?.find((item) => item.day === day);

    if (dayAvailability?.slots?.length) {
        return dayAvailability.slots;
    }

    return doctor.availability || [];
};

const normalizeWeeklyAvailability = (weeklyAvailability) => {
    if (!Array.isArray(weeklyAvailability)) return [];

    return days.map((day) => {
        const dayConfig = weeklyAvailability.find((item) => item.day === day);
        return {
            day,
            slots: normalizeSlots(dayConfig?.slots)
        };
    });
};

const normalizeDoctorPayload = ({
    specialization,
    experience,
    fees,
    degree,
    bio,
    clinicAddress,
    photoUrl,
    languages,
    consultationMode,
    availability,
    weeklyAvailability
}) => {
    if (!specialization?.trim() || experience === undefined || fees === undefined) {
        return { error: "Specialization, experience and fees are required" };
    }

    const normalizedExperience = Number(experience);
    const normalizedFees = Number(fees);

    if (Number.isNaN(normalizedExperience) || normalizedExperience < 0) {
        return { error: "Experience must be a valid number" };
    }

    if (Number.isNaN(normalizedFees) || normalizedFees < 0) {
        return { error: "Fees must be a valid number" };
    }

    return {
        data: {
            specialization: specialization.trim(),
            experience: normalizedExperience,
            fees: normalizedFees,
            degree: degree?.trim() || "",
            bio: bio?.trim() || "",
            clinicAddress: clinicAddress?.trim() || "",
            photoUrl: photoUrl?.trim() || "",
            languages: normalizeSlots(languages),
            consultationMode: ["clinic", "online", "both"].includes(consultationMode)
                ? consultationMode
                : "clinic",
            availability: normalizeSlots(availability),
            weeklyAvailability: normalizeWeeklyAvailability(weeklyAvailability)
        }
    };
};


//Doctor create profile

export const createDoctorProfile = async (req, res) =>{
    try{
        const { data, error } = normalizeDoctorPayload(req.body);

        if (error) {
            return res.status(400).json({ message: error });
        }

        const existingProfile = await Doctor.findOne({ userId: req.user._id });
        if (existingProfile) {
            return res.status(400).json({ message: "Doctor profile already exists" });
        }

        const doctor = await Doctor.create({
            userId: req.user._id,
            ...data
        });

        res.status(201).json({
            message:"Doctor profile created, waiting for approval", doctor
        })
    } catch (error){
        res.status(500).json({message:error.message})
    }
}

// Update logged-in doctor's profile
export const updateMyDoctorProfile = async (req, res) => {
    try {
        const { data, error } = normalizeDoctorPayload(req.body);

        if (error) {
            return res.status(400).json({ message: error });
        }

        const doctor = await Doctor.findOneAndUpdate(
            { userId: req.user._id },
            data,
            { new: true, runValidators: true }
        ).populate("userId", "name email");

        if (!doctor) {
            return res.status(404).json({ message: "Doctor profile not found" });
        }

        res.json({
            message: "Doctor profile updated successfully",
            doctor
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Get logged-in doctor's profile
export const getMyDoctorProfile = async (req, res) => {
    try {
        const doctor = await Doctor.findOne({ userId: req.user._id }).populate("userId", "name email");

        if (!doctor) {
            return res.status(404).json({ message: "Doctor profile not found" });
        }

        res.json(doctor);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

//Get all approved doctors
export const getAllDoctors = async (req, res) =>{
    try{
        const doctors = await Doctor.find({approved:true})
        .populate("userId", "name email");
        res.json(doctors);

    } catch(error){
        res.status(500).json({message:error.message})
    }
}

// Get approved doctor details with booked and remaining slots for a date
export const getDoctorDetails = async (req, res) => {
    try {
        const { date } = req.query;
        const selectedDate = date || new Date().toISOString().split("T")[0];

        const doctor = await Doctor.findOne({
            _id: req.params.id,
            approved: true
        }).populate("userId", "name email");

        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        const appointments = await Appointment.find({
            doctorId: doctor._id,
            date: selectedDate,
            status: { $ne: "cancelled" }
        }).select("time status");

        const slotsForDate = getDoctorSlotsForDate(doctor, selectedDate);
        const bookedSlots = appointments.map((appointment) => appointment.time);
        const remainingSlots = slotsForDate.filter(
            (slot) => !bookedSlots.includes(slot)
        );

        res.json({
            doctor,
            availability: {
                date: selectedDate,
                totalSlots: slotsForDate.length,
                bookedSlots,
                remainingSlots,
                slotsLeft: remainingSlots.length
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//Admin can view doctors waiting for approval
export const getPendingDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.find({ approved: false }).populate("userId", "name email");
        res.json(doctors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

//Admin can approve doctor profile
 export const approveDoctor = async (req, res) =>{
    try{
        const doctor = await Doctor.findById(req.params.id);

        if(!doctor){
            return res.status(404).json({message:"Doctor not found"});
        }
        doctor.approved = true;
        await doctor.save();
        res.json({message:"Doctor approved sucessfully"});
    } catch(error){
        res.status(500).json({message:error.message});
    }
 }
