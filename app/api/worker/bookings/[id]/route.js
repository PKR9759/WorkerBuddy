import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import Worker from '@/models/Worker';
import Booking from '@/models/Booking';

export async function PATCH(request, { params }) {
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

    // Get booking ID from params
    const bookingId = params.id;
    const { status } = await request.json();

    // Validate status
    const validStatuses = ['pending', 'accepted', 'rejected', 'completed'];
    if (!validStatuses.includes(status)) {
      return new Response(JSON.stringify({ message: "Invalid status" }), { status: 400 });
    }

    // Find and update the booking
    const booking = await Booking.findOne({ 
      _id: bookingId, 
      workerId: worker._id 
    });

    if (!booking) {
      return new Response(JSON.stringify({ message: "Booking not found" }), { status: 404 });
    }

    // Update booking status
    booking.status = status;
    await booking.save();

    // If booking is completed, add to worker's work history
    if (status === 'completed') {
      if (!worker.workHistory.includes(bookingId)) {
        worker.workHistory.push(bookingId);
        await worker.save();
      }
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Booking status updated successfully',
      booking: {
        _id: booking._id,
        status: booking.status
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error updating booking status:', error);
    return new Response(JSON.stringify({ 
      message: "Failed to update booking status", 
      error: error.message 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}