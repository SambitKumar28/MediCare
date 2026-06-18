import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const allowedPublicRoles = ["patient", "doctor"];

const buildAuthResponse = (user, message) => {
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return {
    message,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  };
};

// Register User
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const normalizedEmail = email?.trim().toLowerCase();
    const requestedRole = role || "patient";

    if (!name?.trim() || !normalizedEmail || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    if (!allowedPublicRoles.includes(requestedRole)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    // Check existing user
    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: requestedRole
    });

    res.status(201).json(buildAuthResponse(user, "User registered successfully"));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//login user
export const loginUser = async(req, res)=>{
    try{
        const{email, password }= req.body;
        const normalizedEmail = email?.trim().toLowerCase();

        if (!normalizedEmail || !password) {
            return res.status(400).json({message:"Email and password are required"})
        }

        //check user exists

        const user = await User.findOne({email: normalizedEmail});
        if(!user){
            return res.status(400).json({message:"invalid email or password"})
        }
        //compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({message:"invalid email or password"})
        }
        //send response
          res.json(buildAuthResponse(user, "Login successfully"));
    }   catch(error){
        res.status(500).json({message: error.message})
    }
}
