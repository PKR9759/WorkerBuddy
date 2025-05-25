import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import Worker from '@/models/Worker';
import Booking from '@/models/Booking';

export async function GET(request) {
  try {
    await connectDB();
    // console.log("here is i'm ")
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
        select: 'name email phone'
      })
      .sort({ createdAt: -1 });

    // Format bookings with customer info and new fields
    const formattedBookings = bookings.map(booking => ({
      _id: booking._id,
      customerName: booking.customerId?.name || 'Unknown',
      customerEmail: booking.customerId?.email || 'Unknown',
      customerPhone: booking.customerId?.phone || 'N/A',
      serviceType: booking.serviceType,
      status: booking.status,
      paymentStatus: booking.paymentStatus,
      urgency: booking.urgency,
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

export async function POST(request) {
  try {
    await connectDB();

    // Get user ID from request headers (set by middleware)
    const userId = request.headers.get('x-user-id');
    const userType = request.headers.get('x-user-type');

    if (!userId || userType !== 'User') {
      return Response.json({ 
        error: 'Access denied. Customer login required.' 
      }, { status: 403 });
    }

    const body = await request.json();
    const {
      workerId,
      serviceType,
      jobDescription,
      scheduledTime,
      urgency = 'normal' // Default to normal if not provided
    } = body;

    // Validate required fields
    if (!workerId || !serviceType || !jobDescription || !scheduledTime) {
      return Response.json({ 
        error: 'Missing required fields: workerId, serviceType, jobDescription, scheduledTime' 
      }, { status: 400 });
    }

    // Validate urgency field
    if (!['normal', 'urgent', 'emergency'].includes(urgency)) {
      return Response.json({ 
        error: 'Invalid urgency level. Must be: normal, urgent, or emergency' 
      }, { status: 400 });
    }

    // Verify worker exists
    const worker = await Worker.findById(workerId);
    if (!worker) {
      return Response.json({ error: 'Worker not found' }, { status: 404 });
    }

    // Create booking with new schema fields
    const booking = new Booking({
      customerId: userId,
      workerId,
      serviceType,
      jobDescription,
      scheduledTime: new Date(scheduledTime),
      urgency,
      status: 'pending',
      paymentStatus: 'pending'
    });

    await booking.save();

    // Populate the booking with worker and customer details
    const populatedBooking = await Booking.findById(booking._id)
      .populate({
        path: 'workerId',
        populate: {
          path: 'userId',
          select: 'name email phone address'
        }
      })
      .populate('customerId', 'name email phone address');

    return Response.json({
      success: true,
      message: 'Booking created successfully',
      booking: populatedBooking
    }, { status: 201 });

  } catch (error) {
    console.error('Booking creation error:', error);
    return Response.json({
      error: 'Failed to create booking',
      details: error.message
    }, { status: 500 });
  }
}

// New PATCH endpoint for updating booking status and payment status
export async function PATCH(request) {
  try {
    await connectDB();

    const userId = request.headers.get('x-user-id');
    const userType = request.headers.get('x-user-type');

    if (!userId) {
      return Response.json({ error: 'Access denied' }, { status: 403 });
    }

    const body = await request.json();
    const { bookingId, status, paymentStatus } = body;

    if (!bookingId) {
      return Response.json({ error: 'Booking ID is required' }, { status: 400 });
    }

    // Find the booking
    const booking = await Booking.findById(bookingId).populate('workerId');
    if (!booking) {
      return Response.json({ error: 'Booking not found' }, { status: 404 });
    }

    // Check permissions based on user type and action
    if (userType === 'Worker') {
      // Workers can only accept/reject bookings and update payment status for completed jobs
      const worker = await Worker.findOne({ userId: userId });
      if (!worker || booking.workerId._id.toString() !== worker._id.toString()) {
        return Response.json({ error: 'Access denied' }, { status: 403 });
      }

      if (status) {
        // Workers can only change status to accepted or rejected, not completed
        if (!['accepted', 'rejected'].includes(status)) {
          return Response.json({ 
            error: 'Workers can only accept or reject bookings' 
          }, { status: 403 });
        }
        booking.status = status;
      }

      if (paymentStatus) {
        // Workers can only update payment status for completed jobs
        if (booking.status !== 'completed') {
          return Response.json({ 
            error: 'Payment status can only be updated for completed jobs' 
          }, { status: 403 });
        }
        booking.paymentStatus = paymentStatus;
      }

    } else if (userType === 'User') {
      // Users can mark their own bookings as completed or cancelled, and update payment status
      if (booking.customerId.toString() !== userId) {
        return Response.json({ error: 'Access denied' }, { status: 403 });
      }

      if (status) {
        if (status === 'completed' && booking.status === 'accepted') {
          booking.status = status;
        } else if (status === 'cancelled' && ['pending', 'accepted'].includes(booking.status)) {
          booking.status = status;
        } else {
          return Response.json({ 
            error: 'Invalid status update.' 
          }, { status: 403 });
        }
      }

      if (paymentStatus) {
        // Users can update payment status for completed jobs
        if (booking.status !== 'completed') {
          return Response.json({ 
            error: 'Payment status can only be updated for completed jobs' 
          }, { status: 403 });
        }
        booking.paymentStatus = paymentStatus;
      }
    }

    await booking.save();

    return Response.json({
      success: true,
      message: 'Booking updated successfully',
      booking
    });

  } catch (error) {
    console.error('Error updating booking:', error);
    return Response.json({
      error: 'Failed to update booking',
      details: error.message
    }, { status: 500 });
  }
}