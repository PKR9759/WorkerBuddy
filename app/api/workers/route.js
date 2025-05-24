// app/api/workers/route.js
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Worker from "@/models/Worker";

export async function GET(req) {
  try {
    await connectDB();
    
    // Parse URL and get search parameters
    const url = new URL(req.url);
    const location = url.searchParams.get("location");
    const skills = url.searchParams.get("skills");
    const sortBy = url.searchParams.get("sortBy") || "rating";
    const minRating = parseFloat(url.searchParams.get("minRating")) || 0;
    const availability = url.searchParams.get("availability") || "all";
    const verified = url.searchParams.get("verified") === "true";
    const search = url.searchParams.get("search");

    // Build the base query - only include workers with general availability true
    let query = {  };

    // Add skills filter
    if (skills) {
      const skillsArray = skills.split(",").map(s => s.trim());
      query.skills = { $in: skillsArray };
    }

    // Add rating filter
    if (minRating > 0) {
      query.rating = { $gte: minRating };
    }

    // Add verified filter
    if (verified) {
      query.verified = true;
    }

    // Get workers with populated user data
    const workerData = await Worker.find(query)
      .populate({
        path: 'userId',
        model: User,
        select: 'name email pincode location address phone'  // Added address field
      });

    // Format and enhance the data
    let workers = workerData
      .filter(worker => worker.userId) // Ensure user data exists
      .map(worker => {
        const user = worker.userId;
        
        // Calculate review count
        const reviewCount = worker.reviews ? worker.reviews.length : 0;
        
        // Get today's availability - FIXED LOGIC
        const today = new Date();
        const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const todayKey = dayNames[today.getDay()];
        const todaySchedule = worker.timeSlots?.[todayKey];
        
        // Worker is available today only if:
        // 1. General availability is true (already filtered in query)
        // 2. Today's specific slot is available
        const availableToday = worker.availability && todaySchedule?.available === true;

        // Generate realistic experience based on completed jobs and rating
        const baseExperience = Math.max(1, Math.floor(worker.completedJobs / 10));
        const bonusExperience = worker.rating > 4.5 ? Math.floor(Math.random() * 3) + 1 : 0;
        const experience = Math.min(15, baseExperience + bonusExperience);

        // Combine location information for better display and filtering
        const locationDisplay = [
          user.address,
          user.location, 
          user.pincode
        ].filter(Boolean).join(', ') || "Not specified";

        return {
          id: worker._id.toString(),
          userId: user._id.toString(),
          name: user.name,
          email: user.email,
          phone: user.phone,
          skills: worker.skills || [],
          rating: Number(worker.rating.toFixed(1)),
          reviewCount,
          experience: `${experience} year${experience !== 1 ? 's' : ''}`,
          location: locationDisplay,  // Updated to include address
          // Keep individual fields for filtering
          pincode: user.pincode,
          address: user.address,
          userLocation: user.location,
          available: worker.availability, // General availability
          availableToday, // Today's specific availability
          verified: worker.verified || false,
          completedJobs: worker.completedJobs || 0,
          timeSlots: worker.timeSlots,
          // Generate time slots for display
          todaySlots: availableToday && todaySchedule ? [
            `${todaySchedule.startTime} - ${todaySchedule.endTime}`
          ] : [],
          createdAt: worker.createdAt,
        };
      });

    // Apply search filter if provided
    if (search) {
      const searchTerm = search.toLowerCase();
      workers = workers.filter(worker => 
        worker.name.toLowerCase().includes(searchTerm) ||
        worker.skills.some(skill => skill.toLowerCase().includes(searchTerm)) ||
        worker.location.toLowerCase().includes(searchTerm) ||
        (worker.address && worker.address.toLowerCase().includes(searchTerm)) ||
        (worker.pincode && worker.pincode.toLowerCase().includes(searchTerm))
      );
    }

    // Apply location filter - UPDATED TO CHECK ADDRESS FIELD
    if (location) {
      const locationTerm = location.toLowerCase();
      workers = workers.filter(worker => 
        worker.location.toLowerCase().includes(locationTerm) ||
        (worker.address && worker.address.toLowerCase().includes(locationTerm)) ||
        (worker.pincode && worker.pincode.toLowerCase().includes(locationTerm)) ||
        (worker.userLocation && worker.userLocation.toLowerCase().includes(locationTerm))
      );
    }

    // Apply availability filter - FIXED LOGIC
    if (availability === "available" || availability === "today") {
      workers = workers.filter(worker => worker.availableToday === true);
    }

    // Apply sorting
    workers = applySorting(workers, sortBy);

    // Add pagination support (optional)
    const page = parseInt(url.searchParams.get("page")) || 1;
    const limit = parseInt(url.searchParams.get("limit")) || 50;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    const paginatedWorkers = workers.slice(startIndex, endIndex);

    return new Response(JSON.stringify({ 
      workers: paginatedWorkers,
      totalCount: workers.length,
      page,
      limit,
      hasMore: endIndex < workers.length
    }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error("Error fetching workers:", error);
    return new Response(JSON.stringify({ 
      message: "Failed to fetch workers", 
      error: error.message,
      workers: []
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

function applySorting(workers, sortBy) {
  switch (sortBy) {
    case "rating":
      return workers.sort((a, b) => {
        if (b.rating !== a.rating) return b.rating - a.rating;
        return b.reviewCount - a.reviewCount; // Secondary sort by review count
      });
    
    case "completedJobs":
      return workers.sort((a, b) => {
        if (b.completedJobs !== a.completedJobs) return b.completedJobs - a.completedJobs;
        return b.rating - a.rating; // Secondary sort by rating
      });
    
    case "name":
      return workers.sort((a, b) => a.name.localeCompare(b.name));
    
    case "newest":
      return workers.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    case "availability":
      return workers.sort((a, b) => {
        // Prioritize workers available today
        if (a.availableToday && !b.availableToday) return -1;
        if (!a.availableToday && b.availableToday) return 1;
        return b.rating - a.rating; // Secondary sort by rating
      });
    
    case "experience":
      return workers.sort((a, b) => {
        const aExp = parseInt(a.experience);
        const bExp = parseInt(b.experience);
        if (bExp !== aExp) return bExp - aExp;
        return b.rating - a.rating; // Secondary sort by rating
      });
    
    default:
      return workers.sort((a, b) => b.rating - a.rating);
  }
}

function calculateStartingPrice(skills, rating) {
  const basePrices = {
    "Electrician": 300,
    "Plumber": 250,
    "Carpenter": 200,
    "Painter": 150,
    "Mechanic": 400,
    "AC Repair": 350,
    "Appliance Repair": 250,
    "Welder": 300,
    "Mason": 180,
    "Technician": 280,
    "Cleaner": 100,
    "Gardener": 120,
    "Chef": 500,
    "Driver": 80,
    "Security": 200
  };

  // Get base price from primary skill
  const primarySkill = skills[0] || "General";
  let basePrice = basePrices[primarySkill] || 200;

  // Adjust price based on rating
  const ratingMultiplier = rating > 4.5 ? 1.3 : rating > 4.0 ? 1.1 : 1.0;
  
  // Adjust for multiple skills
  const skillMultiplier = skills.length > 2 ? 1.2 : skills.length > 1 ? 1.1 : 1.0;

  const finalPrice = Math.round(basePrice * ratingMultiplier * skillMultiplier);
  
  return finalPrice;
}