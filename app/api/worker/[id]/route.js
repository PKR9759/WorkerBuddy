import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";

import Worker from "@/models/Worker";
import User from "@/models/User";

export async function GET(request, { params }) {
  try {
    await connectDB();
    // console.log(params)

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { message: "Worker ID is required" },
        { status: 400 }
      );
    }

    // Find worker by ID and populate user information
    const worker = await Worker.findById(id)
      .populate({
        path: 'userId',
        select: 'name email phone pincode address location'
      })
      .populate({
        path: 'reviews.userId',
        select: 'name'
      })
      

    if (!worker) {
      return NextResponse.json(
        { message: "Worker not found" },
        { status: 404 }
      );
    }

    // Calculate additional fields similar to the reference API
    const reviewCount = worker.reviews ? worker.reviews.length : 0;
    
    // Get today's availability
    const today = new Date();
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const todayKey = dayNames[today.getDay()];
    const todaySchedule = worker.timeSlots?.[todayKey];
    const availableToday = todaySchedule?.available || false;

    // Generate realistic experience based on completed jobs and rating
    const baseExperience = Math.max(1, Math.floor((worker.completedJobs || 0) / 10));
    const bonusExperience = (worker.rating || 0) > 4.5 ? Math.floor(Math.random() * 3) + 1 : 0;
    const experience = Math.min(15, baseExperience + bonusExperience);

    // Merge worker data with user data for easier frontend consumption
    const workerDetails = {
      _id: worker._id,
      id: worker._id, // For backward compatibility
      userId: worker.userId?._id,
      name: worker.userId?.name || 'Unknown',
      email: worker.userId?.email,
      phone: worker.userId?.phone,
      pincode: worker.userId?.pincode,
      address: worker.userId?.address,
      location: worker.userId?.location || worker.userId?.pincode || "Not specified",
      skills: worker.skills || [],
      availability: worker.availability,
      availableToday,
      timeSlots: worker.timeSlots,
      rating: Number((worker.rating || 0).toFixed(1)),
      reviewCount,
      reviews: worker.reviews?.map(review => ({
        userId: review.userId?._id,
        userName: review.userId?.name || 'Anonymous',
        comment: review.comment,
        rating: review.rating,
        jobType: review.jobType,
        createdAt: review.createdAt
      })) || [],
      verified: worker.verified || false,
      completedJobs: worker.completedJobs || 0,
      experience: `${experience} year${experience !== 1 ? 's' : ''}`,
      workHistory: worker.workHistory || [],
      // Additional fields from reference API
      availabilityStatus: availableToday ? 'available' : 'busy',
      todaySlots: availableToday ? [
        `${todaySchedule.startTime} - ${todaySchedule.endTime}`
      ] : [],
      responseTime: (worker.rating || 0) > 4.5 ? "< 5 mins" : "< 15 mins",
      // startingPrice: calculateStartingPrice(worker.skills || [], worker.rating || 0),
      // emergencyAvailable: (worker.rating || 0) > 4.0 && (worker.completedJobs || 0) > 10,
      createdAt: worker.createdAt,
      updatedAt: worker.updatedAt,
      pricePerHour: worker.pricePerHour || 0,

    };
    // console.log(worker.timeSlots)

    return NextResponse.json({
      success: true,
      worker: workerDetails
    });

  } catch (error) {
    console.error("Error fetching worker details:", error);
    return NextResponse.json(
      { 
        message: "Failed to fetch worker details",
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}
