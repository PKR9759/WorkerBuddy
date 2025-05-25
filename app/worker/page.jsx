"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import {
  Calendar,
  Clock,
  User,
  Mail,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  Briefcase,
  Star,
  Activity,
  UserCheck,
  Timer,
  Phone,
  DollarSign,
  AlertOctagon,
  Zap,
  Shield,
} from "lucide-react";

export default function WorkerHome() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingBooking, setUpdatingBooking] = useState(null);

  const getToken = () => localStorage.getItem("token");

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const token = getToken();
        const response = await axios.get("/api/worker/bookings", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBookings(response.data.bookings || []);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setError("Failed to load bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const updateBookingStatus = async (bookingId, newStatus) => {
    setUpdatingBooking(bookingId);
    try {
      const token = getToken();
      await axios.patch(
        "/api/worker/bookings",
        { bookingId, status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (newStatus === "rejected") {
        setBookings((prev) => prev.filter((b) => b._id !== bookingId));
      } else {
        setBookings((prev) =>
          prev.map((b) =>
            b._id === bookingId ? { ...b, status: newStatus } : b
          )
        );
      }
    } catch (error) {
      console.error("Error updating booking:", error);
      setError("Failed to update booking status");
    } finally {
      setUpdatingBooking(null);
    }
  };
  // Add this new function after updateBookingStatus:
  const updatePaymentStatus = async (bookingId, paymentStatus) => {
    setUpdatingBooking(bookingId);
    try {
      const token = getToken();
      await axios.patch(
        "/api/worker/bookings",
        { bookingId, paymentStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setBookings((prev) =>
        prev.map((b) => (b._id === bookingId ? { ...b, paymentStatus } : b))
      );
    } catch (error) {
      console.error("Error updating payment status:", error);
      setError("Failed to update payment status");
    } finally {
      setUpdatingBooking(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/20 border-yellow-500/30 text-yellow-400";
      case "accepted":
        return "bg-emerald-500/20 border-emerald-500/30 text-emerald-400";
      case "completed":
        return "bg-blue-500/20 border-blue-500/30 text-blue-400";
      default:
        return "bg-gray-500/20 border-gray-500/30 text-gray-400";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Timer className="w-4 h-4" />;
      case "accepted":
        return <UserCheck className="w-4 h-4" />;
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  // Add these functions after your existing utility functions:
  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case "emergency":
        return "bg-red-500/20 border-red-500/30 text-red-400";
      case "urgent":
        return "bg-orange-500/20 border-orange-500/30 text-orange-400";
      case "normal":
        return "bg-blue-500/20 border-blue-500/30 text-blue-400";
      default:
        return "bg-gray-500/20 border-gray-500/30 text-gray-400";
    }
  };

  const getUrgencyIcon = (urgency) => {
    switch (urgency) {
      case "emergency":
        return <AlertOctagon className="w-4 h-4" />;
      case "urgent":
        return <Zap className="w-4 h-4" />;
      case "normal":
        return <Shield className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getPaymentStatusColor = (paymentStatus) => {
    switch (paymentStatus) {
      case "paid":
        return "bg-green-500/20 border-green-500/30 text-green-400";
      case "pending":
        return "bg-yellow-500/20 border-yellow-500/30 text-yellow-400";
      default:
        return "bg-gray-500/20 border-gray-500/30 text-gray-400";
    }
  };

  const pendingCount = bookings.filter((b) => b.status === "pending").length;
  const acceptedCount = bookings.filter((b) => b.status === "accepted").length;
  const completedCount = bookings.filter(
    (b) => b.status === "completed"
  ).length;
  const emergencyCount = bookings.filter(
    (b) => b.urgency === "emergency"
  ).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 text-white px-4 py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-700"></div>
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 absolute top-0 left-0"></div>
          </div>
          <p className="mt-6 text-gray-400 text-lg">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 text-white px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 bg-clip-text text-transparent">
              Your Bookings
            </span>
          </h1>
          <p className="text-gray-400 text-lg">
            Manage your service requests and appointments
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700/30 p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center">
                <Timer className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">
                  {pendingCount}
                </div>
                <div className="text-gray-400">Pending Requests</div>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700/30 p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">
                  {acceptedCount}
                </div>
                <div className="text-gray-400">Accepted Jobs</div>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700/30 p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">
                  {completedCount}
                </div>
                <div className="text-gray-400">Completed Jobs</div>
              </div>
            </div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700/30 p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                <AlertOctagon className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">
                  {emergencyCount}
                </div>
                <div className="text-gray-400">Emergency</div>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <span className="text-red-400">{error}</span>
          </div>
        )}

        {/* Bookings List */}
        {bookings.length === 0 ? (
          <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700/30 p-12 text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Briefcase className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-semibold mb-4 text-white">
              No Bookings Available
            </h3>
            <p className="text-gray-400 text-lg mb-2">
              No booking requests at the moment.
            </p>
            <p className="text-gray-500">
              New booking requests will appear here when customers book your
              services.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700/30 p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
                  {/* Main Content */}
                  <div className="flex-1 space-y-4">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <Briefcase className="w-4 h-4 text-white" />
                          </div>
                          <h2 className="text-xl font-semibold text-white">
                            {booking.serviceType}
                          </h2>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <div
                          className={`px-3 py-1 rounded-lg border flex items-center gap-2 text-sm ${getStatusColor(
                            booking.status
                          )}`}
                        >
                          {getStatusIcon(booking.status)}
                          <span className="font-medium capitalize">
                            {booking.status}
                          </span>
                        </div>

                        <div
                          className={`px-3 py-1 rounded-lg border flex items-center gap-2 text-sm ${getUrgencyColor(
                            booking.urgency
                          )}`}
                        >
                          {getUrgencyIcon(booking.urgency)}
                          <span className="font-medium capitalize">
                            {booking.urgency}
                          </span>
                        </div>

                        {booking.status === "completed" && (
                          <div
                            className={`px-3 py-1 rounded-lg border flex items-center gap-2 text-sm ${getPaymentStatusColor(
                              booking.paymentStatus
                            )}`}
                          >
                            <DollarSign className="w-4 h-4" />
                            <span className="font-medium capitalize">
                              {booking.paymentStatus}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Customer Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 bg-gray-700/30 border border-gray-600/30 rounded-xl">
                          <User className="w-5 h-5 text-blue-400" />
                          <div>
                            <p className="text-gray-400 text-sm">Customer</p>
                            <p className="text-white font-medium">
                              {booking.customerName}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-gray-700/30 border border-gray-600/30 rounded-xl">
                          <Mail className="w-5 h-5 text-blue-400" />
                          <div>
                            <p className="text-gray-400 text-sm">Email</p>
                            <p className="text-white font-medium">
                              {booking.customerEmail}
                            </p>
                          </div>
                        </div>
                        {booking.customerPhone && (
                          <div className="flex items-center gap-3 p-3 bg-gray-700/30 border border-gray-600/30 rounded-xl">
                            <Phone className="w-5 h-5 text-blue-400" />
                            <div>
                              <p className="text-gray-400 text-sm">Phone</p>
                              <p className="text-white font-medium">
                                {booking.customerPhone}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 bg-gray-700/30 border border-gray-600/30 rounded-xl">
                          <Calendar className="w-5 h-5 text-emerald-400" />
                          <div>
                            <p className="text-gray-400 text-sm">
                              Scheduled Date
                            </p>
                            <p className="text-white font-medium">
                              {formatDate(booking.scheduledTime)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-gray-700/30 border border-gray-600/30 rounded-xl">
                          <Clock className="w-5 h-5 text-emerald-400" />
                          <div>
                            <p className="text-gray-400 text-sm">
                              Scheduled Time
                            </p>
                            <p className="text-white font-medium">
                              {formatTime(booking.scheduledTime)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Job Description */}
                    {booking.jobDescription && (
                      <div className="p-4 bg-gray-700/30 border border-gray-600/30 rounded-xl">
                        <div className="flex items-start gap-3">
                          <FileText className="w-5 h-5 text-purple-400 mt-1 flex-shrink-0" />
                          <div>
                            <p className="text-gray-400 text-sm mb-2">
                              Job Description
                            </p>
                            <p className="text-gray-300 leading-relaxed">
                              {booking.jobDescription}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Request Date */}
                    <div className="text-sm text-gray-500 flex items-center gap-2">
                      <Activity className="w-4 h-4" />
                      <span>Requested on {formatDate(booking.createdAt)}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="lg:min-w-48">
                    {booking.status === "pending" && (
                      <div className="space-y-3">
                        <button
                          onClick={() =>
                            updateBookingStatus(booking._id, "accepted")
                          }
                          disabled={updatingBooking === booking._id}
                          className="w-full px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 rounded-xl text-white font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:transform-none flex items-center justify-center gap-2"
                        >
                          {updatingBooking === booking._id ? (
                            <>
                              <Loader2 className="w-5 h-5 animate-spin" />
                              Accepting...
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-5 h-5" />
                              Accept Request
                            </>
                          )}
                        </button>
                        <button
                          onClick={() =>
                            updateBookingStatus(booking._id, "rejected")
                          }
                          disabled={updatingBooking === booking._id}
                          className="w-full px-6 py-3 bg-gray-600/50 hover:bg-red-600/70 border border-gray-500/50 hover:border-red-500/50 rounded-xl text-white font-medium transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none flex items-center justify-center gap-2"
                        >
                          {updatingBooking === booking._id ? (
                            <>
                              <Loader2 className="w-5 h-5 animate-spin" />
                              Rejecting...
                            </>
                          ) : (
                            <>
                              <XCircle className="w-5 h-5" />
                              Reject Request
                            </>
                          )}
                        </button>
                      </div>
                    )}

                    {booking.status === "accepted" && (
                      <div className="text-center">
                        <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                          <UserCheck className="w-6 h-6 text-white" />
                        </div>
                        <p className="text-emerald-400 font-medium">
                          Job Accepted
                        </p>
                        <p className="text-gray-400 text-sm mt-1">
                          Waiting for customer to mark as completed
                        </p>
                      </div>
                    )}

                    {booking.status === "completed" && (
                      <div className="space-y-3">
                        <div className="text-center mb-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                            <CheckCircle className="w-6 h-6 text-white" />
                          </div>
                          <p className="text-blue-400 font-medium">
                            Job Completed
                          </p>
                          <p className="text-gray-400 text-sm mt-1">
                            Marked as completed by customer
                          </p>
                        </div>

                        {booking.paymentStatus === "pending" && (
                          <button
                            onClick={() =>
                              updatePaymentStatus(booking._id, "paid")
                            }
                            disabled={updatingBooking === booking._id}
                            className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-xl text-white font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:transform-none flex items-center justify-center gap-2"
                          >
                            {updatingBooking === booking._id ? (
                              <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Updating...
                              </>
                            ) : (
                              <>
                                <DollarSign className="w-5 h-5" />
                                Mark as Paid
                              </>
                            )}
                          </button>
                        )}

                        {booking.paymentStatus === "paid" && (
                          <div className="text-center">
                            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                              <DollarSign className="w-6 h-6 text-white" />
                            </div>
                            <p className="text-green-400 font-medium">
                              Payment Received
                            </p>
                            <p className="text-gray-400 text-sm mt-1">
                              Transaction completed
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
