"use client";

import { useState } from "react";
import { FiMapPin, FiSearch } from "react-icons/fi";
import { FaTools, FaUserClock } from "react-icons/fa";

export default function UserHomePage() {
  const [filters, setFilters] = useState({
    location: "",
    category: "",
    sortBy: "rating",
  });

  const workers = [
    {
      id: 1,
      name: "Ravi Kumar",
      category: "Electrician",
      rating: 4.8,
      experience: "5 years",
      location: "Ahmedabad",
      availableSlots: ["10:00 AM", "2:00 PM", "5:00 PM"],
    },
    {
      id: 2,
      name: "Suresh Patel",
      category: "Painter",
      rating: 4.5,
      experience: "3 years",
      location: "Ahmedabad",
      availableSlots: ["12:00 PM", "4:00 PM"],
    },
    {
      id: 3,
      name: "Mohan Desai",
      category: "Mechanic",
      rating: 4.9,
      experience: "6 years",
      location: "Rajkot",
      availableSlots: ["9:00 AM", "1:00 PM"],
    },
  ];

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const filteredWorkers = workers
    .filter(
      (w) =>
        (!filters.location || w.location.toLowerCase().includes(filters.location.toLowerCase())) &&
        (!filters.category || w.category === filters.category)
    )
    .sort((a, b) => (filters.sortBy === "rating" ? b.rating - a.rating : a.name.localeCompare(b.name)));

  return (
    <div className="min-h-screen bg-gray-900 text-white px-4 py-6">
      <h1 className="text-4xl font-bold text-center mb-8 tracking-wide">Find Skilled Workers Near You</h1>

      <div className="bg-gray-800 p-6 rounded-lg shadow-md max-w-4xl mx-auto mb-10">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative w-full">
            <FiMapPin className="absolute top-3 left-3 text-white" />
            <input
              name="location"
              placeholder="Enter location"
              value={filters.location}
              onChange={handleFilterChange}
              className="pl-10 p-3 w-full rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none"
            />
          </div>

          <select
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
            className="p-3 w-full md:w-1/3 rounded bg-gray-700 text-white focus:outline-none"
          >
            <option value="">Select Category</option>
            <option value="Electrician">Electrician</option>
            <option value="Painter">Painter</option>
            <option value="Mechanic">Mechanic</option>
          </select>

          <select
            name="sortBy"
            value={filters.sortBy}
            onChange={handleFilterChange}
            className="p-3 w-full md:w-1/4 rounded bg-gray-700 text-white focus:outline-none"
          >
            <option value="rating">Sort by Rating</option>
            <option value="name">Sort by Name</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
        {filteredWorkers.map((worker) => (
          <div key={worker.id} className="bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">{worker.name}</h2>
              <span className="bg-blue-600 text-sm px-3 py-1 rounded-full">{worker.category}</span>
            </div>
            <p className="text-gray-300 mb-2">📍 {worker.location}</p>
            <p className="text-gray-400 mb-2">⭐ {worker.rating} | 🛠 {worker.experience}</p>

            <div className="mt-3">
              <h3 className="text-sm font-medium mb-1">Available Slots:</h3>
              <div className="flex flex-wrap gap-2">
                {worker.availableSlots.map((slot, index) => (
                  <span
                    key={index}
                    className="bg-gray-700 text-sm px-3 py-1 rounded-full text-white"
                  >
                    <FaUserClock className="inline mr-1" />
                    {slot}
                  </span>
                ))}
              </div>
            </div>

            <button className="mt-4 w-full py-2 bg-white text-gray-900 font-semibold rounded-md hover:shadow-lg transition">
              Request Now
            </button>
          </div>
        ))}
      </div>

      {filteredWorkers.length === 0 && (
        <p className="text-center text-gray-400 mt-10">No workers found with selected filters.</p>
      )}
    </div>
  );
}
