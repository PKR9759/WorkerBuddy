// app/api/bookings/route.js
import { connectDB } from "@/lib/db";
import Booking from "@/models/Booking";
import User from "@/models/User";
import Worker from "@/models/Worker";

// Create a new booking
export async function POST(req) {
  try {
    await connectDB();
    
    // Get user ID from request headers (set by middleware)
    const userId = req.headers.get('x-user-id');
    if (!userId) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
    }
    
    const { workerId, scheduledTime, jobDescription } = await req.json();
    
    if (!workerId || !scheduledTime || !jobDescription) {
      return new Response(JSON.stringify({ message: "Missing required fields" }), { status: 400 });
    }
    
    // Verify that worker exists
    const worker = await Worker.findById(workerId);
    if (!worker) {
      return new Response(JSON.stringify({ message: "Worker not found" }), { status: 404 });
    }
    
    // Create the booking
    const booking = await Booking.create({
      customerId: userId, // Using user ID from middleware
      workerId: workerId,
      scheduledTime: new Date(scheduledTime),
      jobDescription: jobDescription,
      status: "pending"
    });
    
    return new Response(JSON.stringify({ 
      message: "Booking created successfully", 
      booking 
    }), { 
      status: 201,
      headers: { 'Content-Type': 'application/json' } 
    });
    
  } catch (error) {
    console.error("Error creating booking:", error);
    return new Response(JSON.stringify({ message: "Failed to create booking", error: error.message }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Get all bookings for the current user
export async function GET(req) {
  try {
    await connectDB();
    
    // Get user ID from request headers (set by middleware)
    const userId = req.headers.get('x-user-id');
    if (!userId) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
    }
    
    const url = new URL(req.url);
    const status = url.searchParams.get("status");
    
    // Build query based on user type
    const query = { customerId: userId }; // Using user ID from middleware
    if (status) {
      query.status = status;
    }
    
    // Get bookings with worker and user details
    const bookings = await Booking.find(query)
      .sort({ createdAt: -1 }) // Most recent first
      .populate({
        path: 'workerId',
        model: Worker,
        select: 'skills rating',
        populate: {
          path: 'userId',
          model: User,
          select: 'name pincode'
        }
      });
    
    // Format the response data
    const formattedBookings = bookings.map(booking => {
      return {
        id: booking._id,
        workerName: booking.workerId.userId.name,
        category: booking.workerId.skills[0], // Primary skill
        location: booking.workerId.userId.pincode || "Unknown",
        date: booking.scheduledTime ? new Date(booking.scheduledTime).toLocaleDateString() : "N/A",
        time: booking.scheduledTime ? new Date(booking.scheduledTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "N/A",
        status: booking.status.charAt(0).toUpperCase() + booking.status.slice(1), // Capitalize first letter
        jobDescription: booking.jobDescription,
        createdAt: booking.createdAt
      };
    });
    
    return new Response(JSON.stringify({ bookings: formattedBookings }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return new Response(JSON.stringify({ message: "Failed to fetch bookings", error: error.message }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}