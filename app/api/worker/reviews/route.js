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

    // Get all reviews with customer information
    const reviewsWithCustomers = await Promise.all(
      worker.reviews.map(async (review) => {
        let customerName = 'Anonymous Customer';
        
        // Try to get customer name from User collection
        if (review.userId) {
          try {
            const customer = await User.findById(review.userId).select('name');
            if (customer && customer.name) {
              customerName = customer.name;
            }
          } catch (err) {
            console.log('Could not fetch customer name:', err);
          }
        }

        return {
          rating: review.rating,
          comment: review.comment || '',
          customerName: customerName,
          createdAt: review.createdAt || new Date(),
          jobType: review.jobType || null
        };
      })
    );

    // Calculate statistics
    const totalReviews = worker.reviews.length;
    const averageRating = totalReviews > 0 ? worker.rating : 0;
    
    // Calculate rating breakdown
    const ratingBreakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    worker.reviews.forEach(review => {
      if (review.rating >= 1 && review.rating <= 5) {
        ratingBreakdown[review.rating]++;
      }
    });

    const stats = {
      totalReviews,
      averageRating,
      ratingBreakdown
    };

    return new Response(JSON.stringify({
      reviews: reviewsWithCustomers,
      stats: stats
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error fetching worker reviews:', error);
    return new Response(JSON.stringify({ 
      message: "Failed to fetch reviews", 
      error: error.message 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}