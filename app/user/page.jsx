"use client";

import { useState, useEffect } from "react";
import { MapPin, Search, Filter, Star, Clock, Briefcase, Zap } from "lucide-react";
import axios from "axios";
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

  const getCategoryIcon = (category) => {
    const icons = {
      Electrician: "⚡",
      Painter: "🎨",
      Mechanic: "🔧",
      Plumber: "🔧",
      Carpenter: "🔨"
    };
    return icons[category] || "🛠️";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 text-white px-4 py-8">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto mb-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 bg-clip-text text-transparent">
              Find Skilled Workers
            </span>
            <br />
            <span className="text-white text-3xl md:text-4xl">Near You</span>
          </h1>
          <p className="text-gray-400 text-xl max-w-3xl mx-auto leading-relaxed">
            Connect with verified professionals for all your service needs. 
            Quality work, competitive rates, and reliable service guaranteed.
          </p>
        </div>

        {/* Search & Filter Section */}
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700/30 p-6 mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Search className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white">Find Your Perfect Worker</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Location Input */}
            <div className="relative">
              <MapPin className="absolute top-1/2 left-3 transform -translate-y-1/2 w-5 h-5 text-blue-400" />
              <input
                name="location"
                placeholder="Enter your location"
                value={filters.location}
                onChange={handleFilterChange}
                className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
              />
            </div>

            {/* Category Select */}
            <div className="relative">
              <Briefcase className="absolute top-1/2 left-3 transform -translate-y-1/2 w-5 h-5 text-purple-400" />
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
              >
                <option value="">All Categories</option>
                <option value="Electrician">⚡ Electrician</option>
                <option value="Painter">🎨 Painter</option>
                <option value="Mechanic">🔧 Mechanic</option>
                <option value="Plumber">🔧 Plumber</option>
                <option value="Carpenter">🔨 Carpenter</option>
              </select>
            </div>

            {/* Sort By Select */}
            <div className="relative">
              <Filter className="absolute top-1/2 left-3 transform -translate-y-1/2 w-5 h-5 text-emerald-400" />
              <select
                name="sortBy"
                value={filters.sortBy}
                onChange={handleFilterChange}
                className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
              >
                <option value="rating">⭐ Sort by Rating</option>
                <option value="name">📝 Sort by Name</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-16">
          <div className="relative mb-6">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-700 mx-auto"></div>
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 absolute top-0 left-1/2 transform -translate-x-1/2"></div>
          </div>
          <p className="text-gray-400 text-lg">Discovering skilled workers near you...</p>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto">
          {/* Workers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workers.map((worker) => (
              <div key={worker.id} className="bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700/30 p-6 transition-all duration-300 hover:shadow-3xl hover:bg-gray-800/60 hover:scale-105 group">
                {/* Worker Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-xl">
                      {getCategoryIcon(worker.category)}
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-white group-hover:text-blue-400 transition-colors duration-300">
                        {worker.name}
                      </h2>
                      <span className="inline-flex items-center px-3 py-1 bg-blue-500/20 border border-blue-500/30 text-blue-400 text-sm rounded-full">
                        {worker.category}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Worker Info */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-gray-400">
                    <MapPin className="w-4 h-4 text-blue-400" />
                    <span>{worker.location}</span>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-yellow-400 font-medium">{worker.rating.toFixed(1)}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-400">
                      <Briefcase className="w-4 h-4" />
                      <span>{worker.experience}</span>
                    </div>
                  </div>
                </div>

                {/* Available Slots */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-sm font-medium text-gray-300">Available Slots:</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {worker.availableSlots.slice(0, 3).map((slot, index) => (
                      <span key={index} className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs px-3 py-1 rounded-full">
                        {slot}
                      </span>
                    ))}
                    {worker.availableSlots.length > 3 && (
                      <span className="bg-gray-500/20 border border-gray-500/30 text-gray-400 text-xs px-3 py-1 rounded-full">
                        +{worker.availableSlots.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Request Button */}
                <button 
                  onClick={() => handleRequestNow(worker.id)}
                  className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-xl text-white font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group"
                >
                  <Zap className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                  Request Now
                </button>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {workers.length === 0 && (
            <div className="text-center py-16">
              <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700/30 p-12 max-w-md mx-auto">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Search className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">No Workers Found</h3>
                <p className="text-gray-400 mb-6">
                  We couldn't find any workers matching your current filters. 
                  Try adjusting your search criteria or location.
                </p>
                <button
                  onClick={() => setFilters({ location: "", category: "", sortBy: "rating" })}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-xl text-white font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}

          {/* Results Summary */}
          {workers.length > 0 && (
            <div className="mt-8 text-center">
              <p className="text-gray-400">
                Showing <span className="text-blue-400 font-semibold">{workers.length}</span> skilled worker{workers.length !== 1 ? 's' : ''} in your area
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}