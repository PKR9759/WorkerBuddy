"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { FiMapPin } from "react-icons/fi";
import { FaUserClock } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function UserHomePage() {
  const [filters, setFilters] = useState({
    location: "",
    category: "",
    sortBy: "rating",
  });
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchWorkers = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const params = {};
        if (filters.location) params.location = filters.location;
        if (filters.category) params.category = filters.category;
        if (filters.sortBy) params.sortBy = filters.sortBy;

        const res = await axios.get("/api/workers", {
          headers: { Authorization: `Bearer ${token}` },
          params,
        });

        setWorkers(res.data.workers || []);
      } catch (err) {
        console.error("Error fetching workers:", err);
        setWorkers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkers();
  }, [filters]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleRequestNow = (workerId) => {
    router.push(`/booking?workerId=${workerId}`);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white px-4 py-6">
      <h1 className="text-4xl font-bold text-center mb-8">Find Skilled Workers Near You</h1>

      <div className="bg-gray-800 p-6 rounded-lg shadow-md max-w-4xl mx-auto mb-10">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative w-full">
            <FiMapPin className="absolute top-3 left-3 text-white" />
            <input
              name="location"
              placeholder="Enter location"
              value={filters.location}
              onChange={handleFilterChange}
              className="pl-10 p-3 w-full rounded bg-gray-700 text-white"
            />
          </div>

          <select
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
            className="p-3 w-full md:w-1/3 rounded bg-gray-700 text-white"
          >
            <option value="">Select Category</option>
            <option value="Electrician">Electrician</option>
            <option value="Painter">Painter</option>
            <option value="Mechanic">Mechanic</option>
            <option value="Plumber">Plumber</option>
            <option value="Carpenter">Carpenter</option>
          </select>

          <select
            name="sortBy"
            value={filters.sortBy}
            onChange={handleFilterChange}
            className="p-3 w-full md:w-1/4 rounded bg-gray-700 text-white"
          >
            <option value="rating">Sort by Rating</option>
            <option value="name">Sort by Name</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10">
          <div className="animate-spin h-12 w-12 border-t-2 border-b-2 border-white mx-auto rounded-full"></div>
          <p className="mt-4 text-gray-400">Loading workers...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {workers.map((worker) => (
            <div key={worker.id} className="bg-gray-800 p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">{worker.name}</h2>
                <span className="bg-blue-600 text-sm px-3 py-1 rounded-full">{worker.category}</span>
              </div>
              <p className="text-gray-300 mb-2">📍 {worker.location}</p>
              <p className="text-gray-400 mb-2">⭐ {worker.rating.toFixed(1)} | 🛠 {worker.experience}</p>

              <div className="mt-3">
                <h3 className="text-sm font-medium mb-1">Available Slots:</h3>
                <div className="flex flex-wrap gap-2">
                  {worker.availableSlots.map((slot, index) => (
                    <span key={index} className="bg-gray-700 text-sm px-3 py-1 rounded-full text-white">
                      <FaUserClock className="inline mr-1" />
                      {slot}
                    </span>
                  ))}
                </div>
              </div>

              <button 
                onClick={() => handleRequestNow(worker.id)}
                className="mt-4 w-full py-2 bg-white text-gray-900 font-semibold rounded-md"
              >
                Request Now
              </button>
            </div>
          ))}
        </div>
      )}

      {!loading && workers.length === 0 && (
        <p className="text-center text-gray-400 mt-10">No workers found with selected filters.</p>
      )}
    </div>
  );
}
