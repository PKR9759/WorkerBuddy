
// app/api/profile/route.js
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

// Get user profile
export async function GET(req) {
  try {
    await connectDB();
    // Get user ID from request headers (set by middleware)
    // console.log(req.headers);
    console.log("here")

    const userId = req.headers.get('x-user-id');
    if (!userId) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
    }
    
    // Find user by ID
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });
    }
    
    return new Response(JSON.stringify({ user }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error("Error fetching profile:", error);
    return new Response(JSON.stringify({ message: "Failed to fetch profile", error: error.message }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Update user profile
export async function PATCH(req) {
  try {
    await connectDB();
    
    // Get user ID from request headers (set by middleware)
    const userId = req.headers.get('x-user-id');
    if (!userId) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
    }
    
    const { name, email, phone, address, currentPassword, newPassword } = await req.json();
    
    // Find user by ID
    const user = await User.findById(userId);
    if (!user) {
      return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });
    }
    
    // Update basic info
    if (name) user.name = name;
    
    // Handle email update (checking uniqueness)
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return new Response(JSON.stringify({ message: "Email already in use" }), { status: 400 });
      }
      user.email = email;
    }
    
    // Add phone to user model if it doesn't exist
    if (phone && !user.phone) {
      // Add phone field to the user object
      user.phone = phone;
    } else if (phone) {
      user.phone = phone;
    }
    
    // Add or update address field
    if (address) {
      user.address = address;
    }
    
    // Update password if provided
    if (currentPassword && newPassword) {
      // Verify current password
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return new Response(JSON.stringify({ message: "Current password is incorrect" }), { status: 400 });
      }
      
      // Hash new password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }
    
    // Save the updated user
    await user.save();
    
    // Return user without password
    const updatedUser = user.toObject();
    delete updatedUser.password;
    
    return new Response(JSON.stringify({ 
      message: "Profile updated successfully", 
      user: updatedUser 
    }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error("Error updating profile:", error);
    return new Response(JSON.stringify({ message: "Failed to update profile", error: error.message }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}