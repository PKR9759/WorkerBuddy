// app/api/reviews/route.js
import { connectDB } from "@/lib/db";
import Booking from "@/models/Booking";
import Worker from "@/models/Worker";
import User from "@/models/User";

// Create a new review
export async function POST(req) {
  try {
    await connectDB();
    
    const userId = req.headers.get('x-user-id');
    if (!userId) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
    }
    
    const { bookingId, workerId, rating, comment, jobType } = await req.json();
    
    // Validation
    if (!bookingId || !workerId || !rating) {
      return new Response(JSON.stringify({ 
        message: "Missing required fields: bookingId, workerId, rating" 
      }), { status: 400 });
    }
    
    if (rating < 1 || rating > 5) {
      return new Response(JSON.stringify({ 
        message: "Rating must be between 1 and 5" 
      }), { status: 400 });
    }
    
    // Verify booking exists and belongs to user
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return new Response(JSON.stringify({ message: "Booking not found" }), { status: 404 });
    }
    
    if (booking.customerId.toString() !== userId) {
      return new Response(JSON.stringify({ message: "Access denied" }), { status: 403 });
    }
    
    // Check if booking is completed and paid
    if (booking.status !== 'completed' || booking.paymentStatus !== 'paid') {
      return new Response(JSON.stringify({ 
        message: "Reviews can only be added for completed and paid bookings" 
      }), { status: 400 });
    }
    
    // Check if review already exists for this booking
    const worker = await Worker.findById(workerId);
    if (!worker) {
      return new Response(JSON.stringify({ message: "Worker not found" }), { status: 404 });
    }
    
    const existingReview = worker.reviews.find(
      review => review.userId && review.userId.toString() === userId && 
      review.bookingId && review.bookingId.toString() === bookingId
    );
    
    if (existingReview) {
      return new Response(JSON.stringify({ 
        message: "Review already exists for this booking" 
      }), { status: 400 });
    }
    
    // Add review to worker
    const newReview = {
      userId: userId,
      bookingId: bookingId,
      comment: comment || '',
      rating: rating,
      jobType: jobType || booking.serviceType,
      createdAt: new Date()
    };
    
    worker.reviews.push(newReview);
    
    // Save worker (this will trigger the pre-save hook to update average rating)
    await worker.save();
    // console.log(bookingId)
    await Booking.findByIdAndUpdate(bookingId, { hasReview: true });
    // console.log(booking1);
    // Get user details for response
    const user = await User.findById(userId).select('name');
    
    return new Response(JSON.stringify({ 
      message: "Review added successfully",
      review: {
        ...newReview,
        userName: user.name
      },
      newAverageRating: worker.rating,
      success: true
    }), { 
      status: 201,
      headers: { 'Content-Type': 'application/json' } 
    });
    
  } catch (error) {
    console.error("Error creating review:", error);
    return new Response(JSON.stringify({ 
      message: "Failed to create review", 
      error: error.message 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Get reviews for a specific worker
export async function GET(req) {
  try {
    await connectDB();
    
    const url = new URL(req.url);
    const workerId = url.searchParams.get("workerId");
    const bookingId = url.searchParams.get("bookingId");
    
    if (!workerId) {
      return new Response(JSON.stringify({ message: "Worker ID is required" }), { status: 400 });
    }
    
    const worker = await Worker.findById(workerId)
      .populate('reviews.userId', 'name')
      .select('reviews rating');
    
    if (!worker) {
      return new Response(JSON.stringify({ message: "Worker not found" }), { status: 404 });
    }
    
    let reviews = worker.reviews.map(review => ({
      id: review._id,
      userName: review.userId?.name || 'Anonymous',
      comment: review.comment,
      rating: review.rating,
      jobType: review.jobType,
      createdAt: review.createdAt,
      bookingId: review.bookingId
    }));
    
    // If bookingId is provided, check if review exists for that booking
    // console.log(bookingId)
    if (bookingId) {
      const existingReview = reviews.find(review => 
        review.bookingId && review.bookingId.toString() === bookingId
      );
      
      return new Response(JSON.stringify({ 
        hasReview: !!existingReview,
        review: existingReview || null,
        reviews: reviews,
        averageRating: worker.rating
      }), { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify({ 
      reviews: reviews,
      averageRating: worker.rating
    }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return new Response(JSON.stringify({ 
      message: "Failed to fetch reviews", 
      error: error.message 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}



export async function PUT(req) {
    try {
      await connectDB();
      
      const userId = req.headers.get('x-user-id');
      if (!userId) {
        return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
      }
      
      const { bookingId, workerId, rating, comment } = await req.json();
      
      // Validation
      if (!bookingId || !workerId || !rating) {
        return new Response(JSON.stringify({ 
          message: "Missing required fields: bookingId, workerId, rating" 
        }), { status: 400 });
      }
      
      if (rating < 1 || rating > 5) {
        return new Response(JSON.stringify({ 
          message: "Rating must be between 1 and 5" 
        }), { status: 400 });
      }
      
      // Find worker and existing review
      const worker = await Worker.findById(workerId);
      if (!worker) {
        return new Response(JSON.stringify({ message: "Worker not found" }), { status: 404 });
      }
      
      const reviewIndex = worker.reviews.findIndex(
        review => review.userId && review.userId.toString() === userId && 
        review.bookingId && review.bookingId.toString() === bookingId
      );
      
      if (reviewIndex === -1) {
        return new Response(JSON.stringify({ 
          message: "Review not found" 
        }), { status: 404 });
      }
      
      // Update the review
      worker.reviews[reviewIndex].rating = rating;
      worker.reviews[reviewIndex].comment = comment || '';
      worker.reviews[reviewIndex].updatedAt = new Date();
      
      // Save worker (this will trigger the pre-save hook to update average rating)
      await worker.save();
      
      return new Response(JSON.stringify({ 
        message: "Review updated successfully",
        review: worker.reviews[reviewIndex],
        newAverageRating: worker.rating,
        success: true
      }), { 
        status: 200,
        headers: { 'Content-Type': 'application/json' } 
      });
      
    } catch (error) {
      console.error("Error updating review:", error);
      return new Response(JSON.stringify({ 
        message: "Failed to update review", 
        error: error.message 
      }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }