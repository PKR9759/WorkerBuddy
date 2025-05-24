"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ArrowLeft, Star, TrendingUp, Filter, SortDesc, MessageSquare, Calendar, User, Award, BarChart3, Loader2 } from "lucide-react";

export default function WorkerReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({
    totalReviews: 0,
    averageRating: 0,
    ratingBreakdown: {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0
    }
  });
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  
  const router = useRouter();
  const getToken = () => localStorage.getItem("token");

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      setError("");
      try {
        const token = getToken();
        if (!token) {
          setError("No authentication token found");
          return;
        }

        const response = await axios.get('/api/worker/reviews', {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (response.data) {
          setReviews(response.data.reviews || []);
          setStats(response.data.stats || {
            totalReviews: 0,
            averageRating: 0,
            ratingBreakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
          });
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
        if (error.response?.status === 403) {
          setError("Access denied. Please ensure you're logged in as a worker.");
        } else if (error.response?.status === 404) {
          setError("No reviews found.");
        } else {
          setError("Failed to load reviews. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const getFilteredAndSortedReviews = () => {
    let filteredReviews = reviews;

    if (filter !== "all") {
      filteredReviews = reviews.filter(review => review.rating === parseInt(filter));
    }

    return filteredReviews.sort((a, b) => {
      switch (sortBy) {
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "highest":
          return b.rating - a.rating;
        case "lowest":
          return a.rating - b.rating;
        case "newest":
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStarDisplay = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-600'}`}
      />
    ));
  };

  const getPercentage = (count, total) => {
    return total > 0 ? ((count / total) * 100).toFixed(1) : 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 text-white px-4 py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-700"></div>
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 absolute top-0 left-0"></div>
          </div>
          <p className="mt-6 text-gray-400 text-lg">Loading your reviews...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 text-white px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-2">
              <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 bg-clip-text text-transparent">
                Customer Reviews
              </span>
            </h1>
            <p className="text-gray-400 text-lg">See what customers are saying about your work</p>
          </div>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-gray-700/50 hover:bg-gray-600/50 border border-gray-600/50 rounded-xl text-white font-medium transition-all duration-300 flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Profile
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3">
            <MessageSquare className="w-5 h-5 text-red-400" />
            <span className="text-red-400">{error}</span>
          </div>
        )}

        {/* Statistics Section */}
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700/30 p-6 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center">
              <Award className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-semibold text-white">Rating Overview</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Overall Rating */}
            <div className="text-center">
              <div className="text-6xl font-bold text-yellow-400 mb-4">
                {stats.averageRating.toFixed(1)}
              </div>
              <div className="flex items-center justify-center gap-1 mb-4">
                {getStarDisplay(Math.round(stats.averageRating))}
              </div>
              <p className="text-gray-400 text-lg">
                Based on {stats.totalReviews} review{stats.totalReviews !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Rating Breakdown */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <BarChart3 className="w-5 h-5 text-gray-400" />
                <span className="text-gray-400 font-medium">Rating Distribution</span>
              </div>
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center gap-4">
                  <div className="flex items-center gap-1 w-12">
                    <span className="text-sm text-gray-300">{rating}</span>
                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                  </div>
                  <div className="flex-1 bg-gray-700/50 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-yellow-400 to-orange-500 h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${getPercentage(stats.ratingBreakdown[rating], stats.totalReviews)}%`
                      }}
                    ></div>
                  </div>
                  <div className="w-20 text-sm text-gray-400 text-right">
                    {stats.ratingBreakdown[rating]} ({getPercentage(stats.ratingBreakdown[rating], stats.totalReviews)}%)
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Filters and Sorting */}
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700/30 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center gap-2 text-gray-400 font-medium mb-3">
                <Filter className="w-4 h-4" />
                Filter by Rating
              </label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
              >
                <option value="all">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>
            
            <div>
              <label className="flex items-center gap-2 text-gray-400 font-medium mb-3">
                <SortDesc className="w-4 h-4" />
                Sort by
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="highest">Highest Rating</option>
                <option value="lowest">Lowest Rating</option>
              </select>
            </div>
          </div>
        </div>

        {/* Reviews List */}
        {stats.totalReviews === 0 ? (
          <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700/30 p-12 text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Star className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-semibold mb-4 text-white">No Reviews Yet</h3>
            <p className="text-gray-400 text-lg">
              Complete some jobs to start receiving reviews from customers.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {getFilteredAndSortedReviews().map((review, index) => (
              <div key={index} className="bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700/30 p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      {getStarDisplay(review.rating)}
                      <span className="ml-2 text-gray-400 font-medium">
                        ({review.rating}/5)
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <User className="w-4 h-4" />
                      <span>{review.customerName || 'Anonymous Customer'}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">{formatDate(review.createdAt)}</span>
                  </div>
                </div>
                
                {review.comment && (
                  <div className="mb-4 p-4 bg-gray-700/30 border border-gray-600/30 rounded-xl">
                    <div className="flex items-start gap-3">
                      <MessageSquare className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
                      <p className="text-gray-300 leading-relaxed italic">
                        "{review.comment}"
                      </p>
                    </div>
                  </div>
                )}

                {review.jobType && (
                  <div className="border-t border-gray-700/30 pt-4">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-blue-400" />
                      <span className="text-gray-500 text-sm">
                        Service: <span className="text-blue-400 font-medium">{review.jobType}</span>
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {getFilteredAndSortedReviews().length === 0 && filter !== "all" && (
              <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700/30 p-12 text-center">
                <div className="w-16 h-16 bg-gray-700/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Filter className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-400 text-lg">
                  No reviews found for {filter} star rating.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}