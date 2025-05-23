import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Worker from "@/models/Worker";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req) {
  await connectDB();
  const { name, email, password, confirmPassword, userType, pincode } = await req.json();

  if (password !== confirmPassword) {
    return new Response(JSON.stringify({ message: "Passwords do not match" }), { status: 400 });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return new Response(JSON.stringify({ message: "User already exists" }), { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
    userType,
    pincode
  });

  // If userType is Worker, create corresponding Worker entry
  if (userType === "Worker") {
    await Worker.create({
      userId: newUser._id,
      skills: [], // default empty array; you can let user add skills later
      availability: true,
      rating: 0,
      verified: false,
      reviews: [],
      workHistory: []
    });
  }

  // Generate JWT token
  const token = jwt.sign(
    { 
      userId: newUser._id, 
      email: newUser.email, 
      userType: newUser.userType 
    },
    process.env.JWT_SECRET || "your_jwt_secret_key",
    { expiresIn: "7d" }
  );

  return new Response(
    JSON.stringify({ 
      message: "User registered successfully", 
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        userType: newUser.userType,
        pincode: newUser.pincode
      }
    }), 
    { status: 201 }
  );
}