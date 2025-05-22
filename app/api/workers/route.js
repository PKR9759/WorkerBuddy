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
    const category = url.searchParams.get("category");
    const sortBy = url.searchParams.get("sortBy") || "rating";
    
    // First, get workers with their user information
    const workerData = await Worker.find({
      availability: true,
      // Add category filter if provided
      ...(category && { skills: { $in: [category] } })
    }).populate({
      path: 'userId',
      model: User,
      select: 'name email pincode location'
    });
    
    // Format and filter the data
    let workers = workerData.map(worker => {
      const user = worker.userId;
      
      return {
        id: worker._id,
        userId: user._id,
        name: user.name,
        category: worker.skills[0], // Primary skill
        skills: worker.skills,
        rating: worker.rating,
        experience: `${Math.floor(Math.random() * 10) + 1} years`, // Placeholder for now
        location: user.pincode || "Unknown",
        available: worker.availability,
        availableSlots: ["10:00 AM", "2:00 PM", "5:00 PM"], // Placeholder slots
        verified: worker.verified
      };
    });
    
    // Apply location filter if provided
    if (location) {
      workers = workers.filter(w => 
        w.location.toLowerCase().includes(location.toLowerCase())
      );
    }
    
    // Apply sorting
    if (sortBy === "rating") {
      workers.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "name") {
      workers.sort((a, b) => a.name.localeCompare(b.name));
    }
    
    return new Response(JSON.stringify({ workers }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error("Error fetching workers:", error);
    return new Response(JSON.stringify({ message: "Failed to fetch workers", error: error.message }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}