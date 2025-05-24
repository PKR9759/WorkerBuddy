import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import Worker from '@/models/Worker';
import Booking from '@/models/Booking';

export async function GET(request) {
  try {
    await connectDB();

    // Get user ID and type from request headers (set by middleware)
    const userId = request.headers.get('x-user-id');
    const userType = request.headers.get('x-user-type');

    if (!userId || userType !== 'Worker') {
      return new Response(JSON.stringify({ message: "Access denied" }), { status: 403 });
    }

    // Find worker profile
    const worker = await Worker.findOne({ userId: userId });
    if (!worker) {
      return new Response(JSON.stringify({ message: "Worker profile not found" }), { status: 404 });
    }

    // Get bookings for this worker with customer details
    const bookings = await Booking.find({ workerId: worker._id })
      .populate({
        path: 'customerId',
        select: 'name email'
      })
      .sort({ createdAt: -1 });

    // Format bookings with customer info
    const formattedBookings = bookings.map(booking => ({
      _id: booking._id,
      customerName: booking.customerId?.name || 'Unknown',
      customerEmail: booking.customerId?.email || 'Unknown',
      status: booking.status,
      scheduledTime: booking.scheduledTime,
      jobDescription: booking.jobDescription,
      createdAt: booking.createdAt
    }));

    return new Response(JSON.stringify({ 
      success: true, 
      bookings: formattedBookings 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error fetching worker bookings:', error);
    return new Response(JSON.stringify({ 
      message: "Failed to fetch bookings", 
      error: error.message 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}