"use client";

import { useState, useEffect } from "react";
import {
  MapPin,
  Search,
  Filter,
  Star,
  Clock,
  Briefcase,
  Zap,
  Shield,
  Award,
  Calendar,
  ChevronDown,
  X,
  SlidersHorizontal,
  Phone,
  Mail,
  MapIcon,
  Users,
  CheckCircle,
} from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function UserHomePage() {
  const [filters, setFilters] = useState({
    location: "",
    skills: [],
    sortBy: "rating",
    minRating: 0,
    availability: "all",
    verified: false,
    priceRange: "all",
    experience: "all",
  });

  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const skillCategories = [
    "Electrician",
    "Plumber",
    "Carpenter",
    "Painter",
    "Mechanic",
    "Cleaner",
    "Gardener",
    "Chef",
    "Driver",
    "Security",
    "Technician",
    "Mason",
    "Welder",
    "AC Repair",
    "Appliance Repair",
  ];

  const sortOptions = [
    { value: "rating", label: "⭐ Highest Rated", icon: "⭐" },
    { value: "completedJobs", label: "📊 Most Experienced", icon: "📊" },
    { value: "price", label: "💰 Price: Low to High", icon: "💰" },
    { value: "priceDesc", label: "💎 Price: High to Low", icon: "💎" },
    { value: "name", label: "📝 Name (A-Z)", icon: "📝" },
    { value: "newest", label: "🆕 Recently Joined", icon: "🆕" },
    { value: "availability", label: "⚡ Available Now", icon: "⚡" },
  ];

  useEffect(() => {
    const fetchWorkers = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const params = new URLSearchParams();

        if (filters.location) params.append("location", filters.location);
        if (filters.skills.length > 0)
          params.append("skills", filters.skills.join(","));
        if (filters.sortBy) params.append("sortBy", filters.sortBy);
        if (filters.minRating > 0)
          params.append("minRating", filters.minRating.toString());
        if (filters.availability !== "all")
          params.append("availability", filters.availability);
        if (filters.verified) params.append("verified", "true");
        if (searchQuery) params.append("search", searchQuery);

        const res = await axios.get(`/api/workers?${params.toString()}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setWorkers(res.data.workers || []);
      } catch (err) {
        console.error("Error fetching workers:", err);
        setWorkers([]);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchWorkers, 300);
    return () => clearTimeout(debounceTimer);
  }, [filters, searchQuery]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleSkillToggle = (skill) => {
    setFilters((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill],
    }));
  };

  const clearFilters = () => {
    setFilters({
      location: "",
      skills: [],
      sortBy: "rating",
      minRating: 0,
      availability: "all",
      verified: false,
      priceRange: "all",
      experience: "all",
    });
    setSearchQuery("");
  };

  const handleRequestNow = (workerId) => {
    router.push(`/booking?workerId=${workerId}`);
  };

  const getCategoryIcon = (category) => {
    const icons = {
      Electrician: "⚡",
      Plumber: "🔧",
      Carpenter: "🔨",
      Painter: "🎨",
      Mechanic: "⚙️",
      Cleaner: "🧽",
      Gardener: "🌱",
      Chef: "👨‍🍳",
      Driver: "🚗",
      Security: "🛡️",
      Technician: "🔧",
      Mason: "🧱",
      Welder: "🔥",
      "AC Repair": "❄️",
      "Appliance Repair": "📱",
    };
    return icons[category] || "🛠️";
  };

  // FIXED: Use the availability data from API instead of recalculating
  const isWorkerAvailableToday = (worker) => {
    // Use the availableToday field calculated by the API
    return worker.availableToday === true;
  };

  const activeFiltersCount =
    filters.skills.length +
    (filters.location ? 1 : 0) +
    (filters.minRating > 0 ? 1 : 0) +
    (filters.verified ? 1 : 0) +
    (filters.availability !== "all" ? 1 : 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 text-white px-4 py-8">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto mb-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 bg-clip-text text-transparent">
              Find Emergency Workers
            </span>
            <br />
            <span className="text-white text-3xl md:text-4xl">Instantly</span>
          </h1>
          <p className="text-gray-400 text-xl max-w-3xl mx-auto leading-relaxed">
            Connect with verified professionals for urgent repairs and services.
            Available 24/7 with real-time booking and instant confirmation.
          </p>
        </div>

        {/* Enhanced Search & Filter Section */}
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700/30 p-6 mb-8">
          {/* Main Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute top-1/2 left-4 transform -translate-y-1/2 w-6 h-6 text-blue-400" />
            <input
              placeholder="Search by name, skill, or service..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 text-lg"
            />
          </div>

          {/* Quick Filters Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="relative">
              <MapPin className="absolute top-1/2 left-3 transform -translate-y-1/2 w-5 h-5 text-blue-400" />
              <input
                placeholder="Location/Pincode"
                value={filters.location}
                onChange={(e) => handleFilterChange("location", e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
              />
            </div>

            <div className="relative">
              <Star className="absolute top-1/2 left-3 transform -translate-y-1/2 w-5 h-5 text-yellow-400" />
              <select
                value={filters.minRating}
                onChange={(e) =>
                  handleFilterChange("minRating", Number(e.target.value))
                }
                className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
              >
                <option value={0}>Any Rating</option>
                <option value={4}>4+ Stars</option>
                <option value={4.5}>4.5+ Stars</option>
                <option value={4.8}>Top Rated (4.8+)</option>
              </select>
            </div>

            <div className="relative">
              <Clock className="absolute top-1/2 left-3 transform -translate-y-1/2 w-5 h-5 text-emerald-400" />
              <select
                value={filters.availability}
                onChange={(e) =>
                  handleFilterChange("availability", e.target.value)
                }
                className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
              >
                <option value="all">All Workers</option>
                <option value="available">Available Now</option>
                <option value="today">Available Today</option>
              </select>
            </div>

            <div className="relative">
              <Filter className="absolute top-1/2 left-3 transform -translate-y-1/2 w-5 h-5 text-purple-400" />
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Advanced Filters Toggle */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700/50 hover:bg-gray-700 rounded-lg transition-all duration-300 text-gray-300 hover:text-white"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Advanced Filters
              {activeFiltersCount > 0 && (
                <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                  {activeFiltersCount}
                </span>
              )}
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-300 ${
                  showAdvancedFilters ? "rotate-180" : ""
                }`}
              />
            </button>

            {activeFiltersCount > 0 && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 px-4 py-2 text-red-400 hover:text-red-300 transition-colors duration-300"
              >
                <X className="w-4 h-4" />
                Clear All
              </button>
            )}
          </div>

          {/* Advanced Filters Panel */}
          {showAdvancedFilters && (
            <div className="mt-6 pt-6 border-t border-gray-700/50">
              {/* Skills Selection */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3 text-white flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-blue-400" />
                  Skills & Services
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                  {skillCategories.map((skill) => (
                    <button
                      key={skill}
                      onClick={() => handleSkillToggle(skill)}
                      className={`p-3 rounded-lg border transition-all duration-300 text-sm font-medium ${
                        filters.skills.includes(skill)
                          ? "bg-blue-500/20 border-blue-500/50 text-blue-400"
                          : "bg-gray-700/30 border-gray-600/30 text-gray-300 hover:bg-gray-700/50 hover:border-gray-500/50"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">
                          {getCategoryIcon(skill)}
                        </span>
                        <span>{skill}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Additional Filters */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-emerald-400" />
                  <label className="flex items-center gap-2 text-gray-300">
                    <input
                      type="checkbox"
                      checked={filters.verified}
                      onChange={(e) =>
                        handleFilterChange("verified", e.target.checked)
                      }
                      className="w-4 h-4 text-blue-500 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                    />
                    Verified Workers Only
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-16">
          <div className="relative mb-6">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-700 mx-auto"></div>
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 absolute top-0 left-1/2 transform -translate-x-1/2"></div>
          </div>
          <p className="text-gray-400 text-lg">
            Finding the best workers for you...
          </p>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto">
          {/* Results Summary */}
          {workers.length > 0 && (
            <div className="mb-6 flex items-center justify-between">
              <p className="text-gray-400">
                Found{" "}
                <span className="text-blue-400 font-semibold">
                  {workers.length}
                </span>{" "}
                worker{workers.length !== 1 ? "s" : ""}
                {filters.location && (
                  <span>
                    {" "}
                    in <span className="text-white">{filters.location}</span>
                  </span>
                )}
              </p>
              <div className="text-sm text-gray-500">
                Sorted by{" "}
                {sortOptions
                  .find((opt) => opt.value === filters.sortBy)
                  ?.label.replace(/^[^\s]+\s/, "")}
              </div>
            </div>
          )}

          {/* Workers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workers.map((worker) => (
              <div
                key={worker.id}
                onClick={() => router.push(`/user/worker-details/${worker.id}`)}
                className="bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700/30 p-6 transition-all duration-300 hover:shadow-3xl hover:bg-gray-800/60 hover:scale-105 group cursor-pointer"
              >
                {/* Worker Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-xl relative">
                      {getCategoryIcon(worker.skills[0])}
                      {worker.verified && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-white group-hover:text-blue-400 transition-colors duration-300 flex items-center gap-2">
                        {worker.name}
                        {worker.verified && (
                          <Shield className="w-4 h-4 text-emerald-400" />
                        )}
                      </h2>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {worker.skills.slice(0, 2).map((skill, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 bg-blue-500/20 border border-blue-500/30 text-blue-400 text-xs rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                        {worker.skills.length > 2 && (
                          <span className="text-xs text-gray-400">
                            +{worker.skills.length - 2} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* FIXED: Use the correct availability check */}
                  {isWorkerAvailableToday(worker) && (
                    <div className="flex items-center gap-1 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs px-2 py-1 rounded-full">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                      Available
                    </div>
                  )}
                </div>

                {/* Worker Info */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-gray-400">
                    <MapPin className="w-4 h-4 text-blue-400" />
                    <span>{worker.location}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-yellow-400 font-medium">
                        {worker.rating.toFixed(1)}
                      </span>
                      <span className="text-gray-500 text-sm">
                        ({worker.reviewCount || 0})
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-400">
                      <Users className="w-4 h-4" />
                      <span className="text-sm">
                        {worker.completedJobs || 0} jobs
                      </span>
                    </div>
                    {worker.pricePerHour >0 &&
                    <div className="flex items-center gap-1 text-emerald-400">
                      <span className="text-lg font-bold">
                        ₹{worker.pricePerHour}
                      </span>
                      <span className="text-sm text-gray-500">/hour</span>
                    </div> }
                  </div>
                </div>

                {/* Today's Availability */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-sm font-medium text-gray-300">
                      Today's Schedule:
                    </h3>
                  </div>
                  {/* FIXED: Use the correct availability check and display proper slots */}
                  {isWorkerAvailableToday(worker) ? (
                    <div className="flex flex-wrap gap-2">
                      {worker.todaySlots && worker.todaySlots.length > 0
                        ? worker.todaySlots.map((slot, index) => (
                            <span
                              key={index}
                              className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs px-3 py-1 rounded-full"
                            >
                              {slot}
                            </span>
                          ))
                        : ["Morning", "Afternoon", "Evening"].map(
                            (slot, index) => (
                              <span
                                key={index}
                                className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs px-3 py-1 rounded-full"
                              >
                                {slot}
                              </span>
                            )
                          )}
                    </div>
                  ) : (
                    <span className="text-gray-500 text-sm">
                      Not available today
                    </span>
                  )}
                </div>

                {/* Status Display */}
                <div className="text-center">
                  <div
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${
                      isWorkerAvailableToday(worker)
                        ? "bg-emerald-500/20 border border-emerald-500/30 text-emerald-400"
                        : "bg-gray-600/20 border border-gray-600/30 text-gray-400"
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${
                        isWorkerAvailableToday(worker)
                          ? "bg-emerald-400 animate-pulse"
                          : "bg-gray-400"
                      }`}
                    ></div>
                    {isWorkerAvailableToday(worker)
                      ? "Available Today"
                      : "Not Available Today"}
                  </div>
                </div>
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
                <h3 className="text-2xl font-bold text-white mb-3">
                  No Workers Found
                </h3>
                <p className="text-gray-400 mb-6">
                  No workers match your current search criteria. Try adjusting
                  your filters or search terms.
                </p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-xl text-white font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
