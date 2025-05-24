// app/api/profile/route.js
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

// Get user profile
export async function GET(req) {
  try {
    await connectDB();
    
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
    
    const userId = req.headers.get('x-user-id');
    if (!userId) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
    }
    
    const body = await req.json();
    const { name, email, phone, address, pincode, currentPassword, newPassword } = body;
    
    console.log("Update request body:", body); // Debug log
    
    // Find user by ID
    const user = await User.findById(userId);
    if (!user) {
      return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });
    }
    
    console.log("User before update:", { 
      name: user.name, 
      email: user.email, 
      phone: user.phone, 
      address: user.address,
      pincode: user.pincode 
    }); // Debug log
    
    // Prepare update object
    const updateData = {};
    
    // Update basic info
    if (name !== undefined) {
      updateData.name = name.trim();
    }
    
    // Handle email update (checking uniqueness)
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
      if (existingUser) {
        return new Response(JSON.stringify({ message: "Email already in use" }), { status: 400 });
      }
      updateData.email = email.toLowerCase().trim();
    }
    
    // Update phone
    if (phone !== undefined) {
      updateData.phone = phone.trim();
    }
    
    // Update address
    if (address !== undefined) {
      updateData.address = address.trim();
    }
    
    // Update pincode
    if (pincode !== undefined) {
      updateData.pincode = pincode.trim();
    }
    
    // Handle password update
    if (currentPassword && newPassword) {
      // Verify current password
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return new Response(JSON.stringify({ message: "Current password is incorrect" }), { status: 400 });
      }
      
      // Hash new password
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(newPassword, salt);
    }
    
    console.log("Update data:", updateData); // Debug log
    
    // Update user using findByIdAndUpdate for better reliability
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { 
        $set: updateData,
        updatedAt: new Date()
      },
      { 
        new: true, // Return updated document
        runValidators: true, // Run schema validations
        select: "-password" // Exclude password from response
      }
    );
    
    if (!updatedUser) {
      return new Response(JSON.stringify({ message: "Failed to update user" }), { status: 500 });
    }
    
    console.log("User after update:", { 
      name: updatedUser.name, 
      email: updatedUser.email, 
      phone: updatedUser.phone, 
      address: updatedUser.address,
      pincode: updatedUser.pincode 
    }); // Debug log
    
    return new Response(JSON.stringify({ 
      message: "Profile updated successfully", 
      user: updatedUser 
    }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error("Error updating profile:", error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return new Response(JSON.stringify({ 
        message: "Validation failed", 
        errors: validationErrors 
      }), { status: 400 });
    }
    
    return new Response(JSON.stringify({ 
      message: "Failed to update profile", 
      error: error.message 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}