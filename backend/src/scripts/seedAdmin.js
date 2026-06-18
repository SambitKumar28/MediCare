import bcrypt from "bcrypt";
import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "../models/User.js";

dotenv.config();

const seedAdmin = async () => {
  const name = process.env.ADMIN_NAME || "Admin";
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is missing from .env");
  }

  if (!email || !password) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD are required in .env");
  }

  if (password.length < 6) {
    throw new Error("ADMIN_PASSWORD must be at least 6 characters");
  }

  await mongoose.connect(process.env.MONGO_URI);

  const hashedPassword = await bcrypt.hash(password, 10);
  const admin = await User.findOneAndUpdate(
    { email },
    {
      name,
      email,
      password: hashedPassword,
      role: "admin"
    },
    {
      new: true,
      upsert: true,
      runValidators: true
    }
  ).select("-password");

  console.log(`Admin ready: ${admin.email}`);
};

seedAdmin()
  .catch((error) => {
    console.error(`Failed to seed admin: ${error.message}`);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
