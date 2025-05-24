// import { NextResponse } from 'next.js';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import Worker from '@/models/Worker';

export async function GET(request) {
  try {
    await connectDB();

    // Get user ID and type from request headers (set by middleware)
    const userId = request.headers.get('x-user-id');
    const userType = request.headers.get('x-user-type');

    if (!userId || userType !== 'Worker') {
      return new Response(JSON.stringify({ message: "Access denied" }), { status: 403 });
    }

    // Find user by ID
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });
    }

    // Find or create worker profile
    let worker = await Worker.findOne({ userId: userId });
    if (!worker) {
      worker = new Worker({
        userId: userId,
        skills: [],
        availability: true,
        timeSlots: {
          monday: { available: true, startTime: "09:00", endTime: "18:00" },
          tuesday: { available: true, startTime: "09:00", endTime: "18:00" },
          wednesday: { available: true, startTime: "09:00", endTime: "18:00" },
          thursday: { available: true, startTime: "09:00", endTime: "18:00" },
          friday: { available: true, startTime: "09:00", endTime: "18:00" },
          saturday: { available: true, startTime: "09:00", endTime: "18:00" },
          sunday: { available: false, startTime: "09:00", endTime: "18:00" }
        },
        rating: 0,
        reviews: [],
        verified: false,
        completedJobs: 0,
        workHistory: []
      });
      await worker.save();
    }

    return new Response(JSON.stringify({
      user: {
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        pincode: user.pincode || "",
        address: user.address || ""
      },
      worker: {
        skills: worker.skills || [],
        availability: worker.availability ?? true,
        timeSlots: worker.timeSlots || {
          monday: { available: true, startTime: "09:00", endTime: "18:00" },
          tuesday: { available: true, startTime: "09:00", endTime: "18:00" },
          wednesday: { available: true, startTime: "09:00", endTime: "18:00" },
          thursday: { available: true, startTime: "09:00", endTime: "18:00" },
          friday: { available: true, startTime: "09:00", endTime: "18:00" },
          saturday: { available: true, startTime: "09:00", endTime: "18:00" },
          sunday: { available: false, startTime: "09:00", endTime: "18:00" }
        },
        rating: worker.rating || 0,
        reviews: worker.reviews || [],
        verified: worker.verified || false,
        completedJobs: worker.completedJobs || 0,
        workHistory: worker.workHistory || []
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error fetching worker profile:', error);
    return new Response(JSON.stringify({ 
      message: "Failed to fetch profile", 
      error: error.message 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function PATCH(request) {
  try {
    await connectDB();

    // Get user ID and type from request headers (set by middleware)
    const userId = request.headers.get('x-user-id');
    const userType = request.headers.get('x-user-type');

    if (!userId || userType !== 'Worker') {
      return new Response(JSON.stringify({ message: "Access denied" }), { status: 403 });
    }

    const { name, phone, pincode, address, skills, availability, timeSlots } = await request.json();

    // Find user by ID
    const user = await User.findById(userId);
    if (!user) {
      return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });
    }

    // Update user details (name, phone, pincode, address)
    if (name !== undefined) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (pincode !== undefined) user.pincode = pincode;
    if (address !== undefined) user.address = address;
    await user.save();

    // Find or create worker profile
    let worker = await Worker.findOne({ userId: userId });
    if (!worker) {
      worker = new Worker({
        userId: userId,
        skills: [],
        availability: true,
        timeSlots: {
          monday: { available: true, startTime: "09:00", endTime: "18:00" },
          tuesday: { available: true, startTime: "09:00", endTime: "18:00" },
          wednesday: { available: true, startTime: "09:00", endTime: "18:00" },
          thursday: { available: true, startTime: "09:00", endTime: "18:00" },
          friday: { available: true, startTime: "09:00", endTime: "18:00" },
          saturday: { available: true, startTime: "09:00", endTime: "18:00" },
          sunday: { available: false, startTime: "09:00", endTime: "18:00" }
        },
        rating: 0,
        reviews: [],
        verified: false,
        completedJobs: 0,
        workHistory: []
      });
    }

    // Update worker details
    if (skills !== undefined) worker.skills = skills;
    if (availability !== undefined) worker.availability = availability;
    if (timeSlots !== undefined) worker.timeSlots = timeSlots;
    await worker.save();

    return new Response(JSON.stringify({
      message: 'Profile updated successfully',
      user: {
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        pincode: user.pincode || "",
        address: user.address || ""
      },
      worker: {
        skills: worker.skills || [],
        availability: worker.availability ?? true,
        timeSlots: worker.timeSlots || {},
        rating: worker.rating || 0,
        reviews: worker.reviews || [],
        verified: worker.verified || false,
        completedJobs: worker.completedJobs || 0,
        workHistory: worker.workHistory || []
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error updating worker profile:', error);
    return new Response(JSON.stringify({ 
      message: "Failed to update profile", 
      error: error.message 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}