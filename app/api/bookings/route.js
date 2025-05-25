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
    
    const { 
      workerId, 
      scheduledTime, 
      jobDescription,
      serviceType,
      urgency = 'normal',
      paymentMethod = 'cash'
    } = await req.json();
    
    // Updated validation to include new required fields
    if (!workerId || !scheduledTime || !jobDescription || !serviceType) {
      return new Response(JSON.stringify({ 
        message: "Missing required fields: workerId, scheduledTime, jobDescription, serviceType" 
      }), { status: 400 });
    }
    
    // Validate urgency field
    if (!['normal', 'urgent', 'emergency'].includes(urgency)) {
      return new Response(JSON.stringify({ 
        message: 'Invalid urgency level. Must be: normal, urgent, or emergency' 
      }), { status: 400 });
    }

    // Validate payment method
    if (!['cash', 'card', 'upi', 'bank_transfer'].includes(paymentMethod)) {
      return new Response(JSON.stringify({ 
        message: 'Invalid payment method. Must be: cash, card, upi, or bank_transfer' 
      }), { status: 400 });
    }
    
    // Verify that worker exists
    const worker = await Worker.findById(workerId);
    if (!worker) {
      return new Response(JSON.stringify({ message: "Worker not found" }), { status: 404 });
    }
    
    // Create the booking with new fields
    const booking = await Booking.create({
      customerId: userId,
      workerId: workerId,
      scheduledTime: new Date(scheduledTime),
      jobDescription: jobDescription,
      serviceType: serviceType,
      urgency: urgency,
      paymentMethod: paymentMethod,
      status: "pending",
      paymentStatus: "pending"
    });
    
    // Populate the booking with worker details for response
    const populatedBooking = await Booking.findById(booking._id)
      .populate({
        path: 'workerId',
        populate: {
          path: 'userId',
          select: 'name email phone'
        }
      })
      .populate('customerId', 'name email phone');
    
    return new Response(JSON.stringify({ 
      message: "Booking created successfully", 
      booking: populatedBooking,
      success: true
    }), { 
      status: 201,
      headers: { 'Content-Type': 'application/json' } 
    });
    
  } catch (error) {
    console.error("Error creating booking:", error);
    return new Response(JSON.stringify({ 
      message: "Failed to create booking", 
      error: error.message 
    }), { 
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
    const query = { customerId: userId };
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
          select: 'name pincode email phone'
        }
      });
    
    // Format the response data with new fields
    const formattedBookings = bookings.map(booking => {
      return {
        id: booking._id,
        workerName: booking.workerId.userId.name,
        workerEmail: booking.workerId.userId.email || 'N/A',
        workerPhone: booking.workerId.userId.phone || 'N/A',
        category: booking.workerId.skills[0], // Primary skill
        serviceType: booking.serviceType || booking.workerId.skills[0], // Use serviceType if available
        location: booking.workerId.userId.pincode || "Unknown",
        date: booking.scheduledTime ? new Date(booking.scheduledTime).toLocaleDateString() : "N/A",
        time: booking.scheduledTime ? new Date(booking.scheduledTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "N/A",
        status: booking.status.charAt(0).toUpperCase() + booking.status.slice(1),
        paymentStatus: booking.paymentStatus ? booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1) : 'Pending',
        // paymentMethod: booking.paymentMethod ? booking.paymentMethod.toUpperCase() : 'CASH',
        urgency: booking.urgency ? booking.urgency.charAt(0).toUpperCase() + booking.urgency.slice(1) : 'Normal',
        jobDescription: booking.jobDescription,
        scheduledTime: booking.scheduledTime,
        createdAt: booking.createdAt
      };
    });
    
    return new Response(JSON.stringify({ bookings: formattedBookings }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return new Response(JSON.stringify({ 
      message: "Failed to fetch bookings", 
      error: error.message 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Update booking status and payment status
export async function PATCH(req) {
  try {
    await connectDB();
    
    const userId = req.headers.get('x-user-id');
    const userType = req.headers.get('x-user-type');
    
    if (!userId && userType!="User") {
      return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
    }
    
    const { bookingId, status } = await req.json();
    console.log(bookingId,status)
    if (!bookingId) {
      return new Response(JSON.stringify({ message: "Booking ID is required" }), { status: 400 });
    }
    
    // Find the booking
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return new Response(JSON.stringify({ message: "Booking not found" }), { status: 404 });
    }
    
    // Check if user owns this booking
    if (booking.customerId.toString() !== userId) {
      return new Response(JSON.stringify({ message: "Access denied" }), { status: 403 });
    }
    if (status === 'cancelled') {
      if (['pending', 'accepted'].includes(booking.status)) {
        await Booking.findByIdAndDelete(bookingId);
        return new Response(JSON.stringify({
          message: 'Booking cancelled and removed successfully',
          success: true
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      } else {
        return new Response(JSON.stringify({ message: 'Only pending or accepted bookings can be cancelled' }), { status: 400 });
      }
    }

    if (status === 'completed') {
      if (booking.status === 'accepted') {
        booking.status = 'completed';
      } else {
        return new Response(JSON.stringify({ message: 'Only accepted bookings can be marked as completed' }), { status: 400 });
      }
    }

    
    await booking.save();
    
    return new Response(JSON.stringify({
      message: 'Booking updated successfully',
      booking: booking,
      success: true
    }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error("Error updating booking:", error);
    return new Response(JSON.stringify({
      message: "Failed to update booking",
      error: error.message
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}