"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Star,
  MapPin,
  Calendar,
  Clock,
  Shield,
  Users,
  CheckCircle,
  Zap,
  Phone,
  Mail,
  Award,
  Briefcase,
  MessageCircle,
  ChevronRight,
  Building,
  Globe,
} from "lucide-react";
import axios from "axios";

export default function WorkerDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [worker, setWorker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDay, setSelectedDay] = useState(new Date().getDay());

  // Get token from localStorage only on client side
  const [token, setToken] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(localStorage.getItem("token"));
    }
  }, []);

  const days = [
    { key: "sunday", label: "Sunday", short: "Sun" },
    { key: "monday", label: "Monday", short: "Mon" },
    { key: "tuesday", label: "Tuesday", short: "Tue" },
    { key: "wednesday", label: "Wednesday", short: "Wed" },
    { key: "thursday", label: "Thursday", short: "Thu" },
    { key: "friday", label: "Friday", short: "Fri" },
    { key: "saturday", label: "Saturday", short: "Sat" },
  ];

  useEffect(() => {
    const fetchWorkerDetails = async () => {
      if (!token) return; // Don't fetch if token is not available yet

      setLoading(true);
      try {
        const res = await axios.get(`/api/worker/${params.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWorker(res.data.worker);
        console.log("Worker data:", res.data.worker);
        console.log("TimeSlots:", res.data.worker.timeSlots);
      } catch (err) {
        console.error("Error fetching worker details:", err);
        setError(
          err.response?.data?.message || "Failed to load worker details"
        );
      } finally {
        setLoading(false);
      }
    };

    if (params.id && token) {
      fetchWorkerDetails();
    }
  }, [params.id, token]);

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

  const isAvailableToday = () => {
    if (!worker?.timeSlots) return false;
    const today = new Date().getDay();
    const todaySlot = worker.timeSlots[days[today].key];
    return todaySlot?.available || false;
  };

  const formatTime = (time) => {
    if (!time) return "";
    try {
      const [hours, minutes] = time.split(":");
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? "PM" : "AM";
      const hour12 = hour % 12 || 12;
      return `${hour12}:${minutes} ${ampm}`;
    } catch (error) {
      console.error("Error formatting time:", time, error);
      return time; // Return original time if formatting fails
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
      );
    }
    if (hasHalfStar) {
      stars.push(
        <Star
          key="half"
          className="w-4 h-4 text-yellow-400 fill-current opacity-50"
        />
      );
    }
    for (let i = stars.length; i < 5; i++) {
      stars.push(<Star key={i} className="w-4 h-4 text-gray-400" />);
    }
    return stars;
  };

  const handleBookNow = () => {
    // Navigate to booking page with worker ID
    router.push(
      `/book-service?workerId=${worker._id}&workerName=${encodeURIComponent(
        worker.name
      )}&skills=${encodeURIComponent(worker.skills.join(","))}`
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-6">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-700 mx-auto"></div>
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 absolute top-0 left-1/2 transform -translate-x-1/2"></div>
          </div>
          <p className="text-gray-400 text-lg">Loading worker details...</p>
        </div>
      </div>
    );
  }

  if (error || !worker) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 text-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Users className="w-10 h-10 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">
            Worker Not Found
          </h2>
          <p className="text-gray-400 mb-6">
            {error || "The worker you're looking for doesn't exist."}
          </p>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-xl text-white font-medium transition-all duration-300"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 text-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gray-900/80 backdrop-blur-xl border-b border-gray-700/30">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-300"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Workers
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Worker Profile Header */}
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700/30 p-8 mb-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Profile Picture & Basic Info */}
            <div className="flex flex-col items-center lg:items-start">
              <div className="w-32 h-32 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-5xl relative mb-4">
                {getCategoryIcon(worker.skills?.[0])}
                {worker.verified && (
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>

              {isAvailableToday() && (
                <div className="flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 px-4 py-2 rounded-full">
                  <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
                  Available Today
                </div>
              )}
            </div>

            {/* Worker Details */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                    {worker.name}
                    {worker.verified && (
                      <Shield className="w-6 h-6 text-emerald-400" />
                    )}
                  </h1>
                  <div className="flex items-center gap-2 text-gray-400 mb-4">
                    <MapPin className="w-5 h-5 text-blue-400" />
                    <span className="text-lg">
                      {worker.address || worker.location || worker.pincode}
                    </span>
                  </div>
                </div>
              </div>

              {/* Contact Details */}
              <div className="bg-gray-700/30 rounded-xl p-4 mb-6">
                <h3 className="text-lg font-semibold mb-3 text-white">
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {worker.email && (
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-blue-400" />
                      <div>
                        <div className="text-sm text-gray-400">Email</div>
                        <div className="text-white">{worker.email}</div>
                      </div>
                    </div>
                  )}
                  {worker.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-green-400" />
                      <div>
                        <div className="text-sm text-gray-400">Phone</div>
                        <div className="text-white">{worker.phone}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Rating & Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-gray-700/30 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    {renderStars(worker.rating || 0)}
                  </div>
                  <div className="text-2xl font-bold text-yellow-400">
                    {(worker.rating || 0).toFixed(1)}
                  </div>
                  <div className="text-sm text-gray-400">
                    {worker.reviewCount || 0} reviews
                  </div>
                </div>

                <div className="bg-gray-700/30 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-5 h-5 text-blue-400" />
                    <span className="text-gray-300">Completed Jobs</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-400">
                    {worker.completedJobs || 0}
                  </div>
                  <div className="text-sm text-gray-400">Projects finished</div>
                </div>

                <div className="bg-gray-700/30 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="w-5 h-5 text-purple-400" />
                    <span className="text-gray-300">Experience</span>
                  </div>
                  <div className="text-2xl font-bold text-purple-400">
                    {worker.experience || "1 year"}
                  </div>
                  <div className="text-sm text-gray-400">
                    Professional experience
                  </div>
                </div>
                { worker.pricePerHour>0 && 
                <div className="bg-gray-700/30 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-emerald-400 text-xl">₹</span>
                    <span className="text-gray-300">Rate</span>
                  </div>
                  <div className="text-2xl font-bold text-emerald-400">
                    ₹{worker.pricePerHour || 0}
                  </div>
                  <div className="text-sm text-gray-400">Per hour</div>
                </div> }
              </div>

              {/* Skills */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3 text-white flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-blue-400" />
                  Skills & Services
                </h3>
                <div className="flex flex-wrap gap-2">
                  {(worker.skills || []).map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-full"
                    >
                      <span className="text-lg">{getCategoryIcon(skill)}</span>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Book Now Button */}
              <div className="w-full">
                <button
                  onClick={handleBookNow}
                  disabled={!isAvailableToday()}
                  className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 ${
                    isAvailableToday()
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                      : "bg-gray-600/50 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <Zap className="w-5 h-5" />
                  {isAvailableToday()
                    ? "Book Service Now"
                    : "Not Available Today"}
                </button>
                
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Schedule - FIXED SECTION */}
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700/30 p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-blue-400" />
            Weekly Schedule
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
            {days.map((day, index) => {
              const daySchedule = worker.timeSlots?.[day.key];
              const isToday = index === new Date().getDay();

              console.log(`${day.key}:`, daySchedule); // Debug log

              return (
                <div
                  key={day.key}
                  className={`p-4 rounded-xl border transition-all duration-300 ${
                    isToday
                      ? "bg-blue-500/20 border-blue-500/50 text-blue-400"
                      : daySchedule?.available
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                      : "bg-gray-700/30 border-gray-600/30 text-gray-500"
                  }`}
                >
                  <div className="text-center">
                    <div className="font-semibold mb-2 capitalize">
                      {day.short}
                      {isToday && <span className="block text-xs">Today</span>}
                    </div>
                    {daySchedule?.available ? (
                      <div className="text-sm space-y-1">
                        <div className="font-medium">
                          {formatTime(daySchedule.startTime)}
                        </div>
                        <div className="text-xs opacity-75">to</div>
                        <div className="font-medium">
                          {formatTime(daySchedule.endTime)}
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm font-medium">
                        {daySchedule ? "Closed" : "Not Set"}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Completed Jobs Summary */}
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700/30 p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-blue-400" />
            Work Summary
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">
                {worker.completedJobs || 0}
              </div>
              <div className="text-gray-400">Total Jobs Completed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-400 mb-2">
                {(worker.rating || 0).toFixed(1)}
              </div>
              <div className="text-gray-400">Average Rating</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">
                {worker.reviewCount || 0}
              </div>
              <div className="text-gray-400">Customer Reviews</div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700/30 p-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <MessageCircle className="w-6 h-6 text-blue-400" />
            Customer Reviews ({worker.reviewCount || 0})
          </h2>

          {worker.reviews && worker.reviews.length > 0 ? (
            <div className="space-y-4">
              {worker.reviews.map((review, index) => (
                <div key={index} className="bg-gray-700/30 rounded-xl p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        {renderStars(review.rating || 0)}
                        <span className="text-yellow-400 font-medium">
                          {(review.rating || 0).toFixed(1)}
                        </span>
                      </div>
                      <div className="text-sm text-gray-400">
                        {review.userName || "Anonymous"} •{" "}
                        {review.jobType || "Service"} •{" "}
                        {new Date(review.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-300">{review.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <MessageCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">
                No Reviews Yet
              </h3>
              <p className="text-gray-500">
                This worker hasn't received any reviews yet. Be the first to
                hire them!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
