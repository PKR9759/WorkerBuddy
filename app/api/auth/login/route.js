import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req) {
  await connectDB();
  const { email, password } = await req.json();

  if (!email || !password) {
    return new Response(JSON.stringify({ message: "Email and password are required" }), { status: 400 });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return new Response(JSON.stringify({ message: "Invalid credentials" }), { status: 401 });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return new Response(JSON.stringify({ message: "Invalid credentials" }), { status: 401 });
  }

  const token = jwt.sign({ id: user._id, userType: user.userType }, JWT_SECRET, { expiresIn: "7d" });

  return new Response(JSON.stringify({ token, userType: user.userType }), { status: 200 });
}
