import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import doctorRoutes from './routes/doctorRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import notificationRoutes from "./routes/notificationRoutes.js";



const app = express();

const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

//middleware
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        callback(new Error("Not allowed by CORS"));
    },
    credentials: true
}))
app.use(express.json({ limit: "10kb" }))

//routes
app.use("/api/auth", authRoutes)
app.use("/api/doctors", doctorRoutes)
app.use("/api/appointments", appointmentRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api/notifications", notificationRoutes)

//test route
app.get("/",(req, res)=>{
    res.send("Api is running.........OMG")
})



export default app;
