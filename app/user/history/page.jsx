"use client";

import { useState, useEffect } from "react";
import {
  CheckCircle,
  Clock,
  XCircle,
  Calendar,
  MapPin,
  User,
  Briefcase,
  CreditCard,
  DollarSign,
  Star,
  MessageSquare,
  Send,
} from "lucide-react";
import axios from "axios";

export default function UserHistoryPage() {
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [reviewModal, setReviewModal] = useState({
    open: false,
    booking: null,
  });
  const [reviewData, setReviewData] = useState({ rating: 0, comment: "" });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [editingReview, setEditingReview] = useState(false);

  const getToken = () => localStorage.getItem("token");

  useEffect(() => {
    const fetchHistory = async () => {
      setHistoryLoading(true);
      try {
        const token = getToken();
        const response = await axios.get("/api/bookings", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHistory(response.data.bookings || []);
      } catch (error) {
        console.error("Error fetching booking history:", error);
        setHistory([]);
      } finally {
        setHistoryLoading(false);
      }
    };

    fetchHistory();
  }, []);
  const getPaymentStatusStyle = (paymentStatus) => {
    switch (paymentStatus?.toLowerCase()) {
      case "paid":
        return {
          icon: <CreditCard className="w-4 h-4 text-emerald-400" />,
          color: "text-emerald-400",
          bgColor: "bg-emerald-500/10 border-emerald-500/20",
          text: "Payment Complete",
        };
      case "pending":
        return {
          icon: <DollarSign className="w-4 h-4 text-orange-400" />,
          color: "text-orange-400",
          bgColor: "bg-orange-500/10 border-orange-500/20",
          text: "Payment Pending",
        };
      default:
        return {
          icon: <Clock className="w-4 h-4 text-gray-400" />,
          color: "text-gray-400",
          bgColor: "bg-gray-500/10 border-gray-500/20",
          text: "No Payment Required",
        };
    }
  };
  const openReviewModal = async (booking, isEdit = false) => {
    try {
      const token = getToken();
      const response = await axios.get(
        `/api/reviews?workerId=${booking.workerId}&bookingId=${booking.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.hasReview && !isEdit) {
        alert("You have already reviewed this worker for this booking.");
        return;
      }

      setEditingReview(isEdit);
      setReviewModal({ open: true, booking });

      if (isEdit && response.data.review) {
        setReviewData({
          rating: response.data.review.rating,
          comment: response.data.review.comment || "",
        });
      } else {
        setReviewData({ rating: 0, comment: "" });
      }
    } catch (error) {
      console.error("Error checking existing review:", error);
      setEditingReview(isEdit);
      setReviewModal({ open: true, booking });
      setReviewData({ rating: 0, comment: "" });
    }
  };

  const closeReviewModal = () => {
    setReviewModal({ open: false, booking: null });
    setReviewData({ rating: 0, comment: "" });
    setEditingReview(false);
  };

  const handleStarClick = (rating) => {
    setReviewData((prev) => ({ ...prev, rating }));
  };

  const submitReview = async () => {
    if (reviewData.rating === 0) {
      alert("Please select a rating");
      return;
    }

    setSubmittingReview(true);
    try {
      const token = getToken();
      const method = editingReview ? "PUT" : "POST";
      const response = await axios({
        method: method,
        url: "/api/reviews",
        data: {
          bookingId: reviewModal.booking.id,
          workerId: reviewModal.booking.workerId,
          rating: reviewData.rating,
          comment: reviewData.comment,
          jobType: reviewModal.booking.category,
        },
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        alert(
          editingReview ? "Review updated successfully!" : response.data.message
        );

        // Refresh the history to update review status
        const updatedResponse = await axios.get("/api/bookings", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHistory(updatedResponse.data.bookings || []);

        closeReviewModal();
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      alert(
        `Failed to ${
          editingReview ? "update" : "submit"
        } review. Please try again.`
      );
    } finally {
      setSubmittingReview(false);
    }
  };

  const getStatusStyle = (status) => {
    switch (status.toLowerCase()) {
      case "completed":
        return {
          icon: <CheckCircle className="w-5 h-5 text-emerald-400" />,
          color: "text-emerald-400",
          bgColor: "bg-emerald-500/10 border-emerald-500/20",
        };
      case "pending":
        return {
          icon: <Clock className="w-5 h-5 text-yellow-400" />,
          color: "text-yellow-400",
          bgColor: "bg-yellow-500/10 border-yellow-500/20",
        };
      case "cancelled":
      case "rejected":
        return {
          icon: <XCircle className="w-5 h-5 text-red-400" />,
          color: "text-red-400",
          bgColor: "bg-red-500/10 border-red-500/20",
        };
      case "accepted":
        return {
          icon: <CheckCircle className="w-5 h-5 text-blue-400" />,
          color: "text-blue-400",
          bgColor: "bg-blue-500/10 border-blue-500/20",
        };
      default:
        return {
          icon: null,
          color: "text-gray-400",
          bgColor: "bg-gray-500/10 border-gray-500/20",
        };
    }
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      const token = getToken();
      await axios.patch(
        "/api/bookings",
        {
          bookingId: bookingId,
          status: "cancelled",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Refresh the history
      const updatedResponse = await axios.get("/api/bookings", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHistory(updatedResponse.data.bookings || []);
    } catch (error) {
      console.error("Error cancelling booking:", error);
      alert("Failed to cancel booking. Please try again.");
    }
  };

  const handleCompleteBooking = async (bookingId) => {
    try {
      const token = getToken();
      await axios.patch(
        "/api/bookings",
        {
          bookingId: bookingId,
          status: "completed",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Refresh the history
      const updatedResponse = await axios.get("/api/bookings", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHistory(updatedResponse.data.bookings || []);
      // alert("Job marked as completed! You can now proceed with payment.");
    } catch (error) {
      console.error("Error completing booking:", error);
      alert("Failed to mark job as completed. Please try again.");
    }
  };

  if (historyLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 text-white px-4 py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-700"></div>
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 absolute top-0 left-0"></div>
          </div>
          <p className="mt-6 text-gray-400 text-lg">
            Loading your request history...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 text-white px-4 py-8">
      {/* Header Section */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 bg-clip-text text-transparent">
              Your Request History
            </span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Track all your service requests and their current status
          </p>
        </div>
      </div>

      {/* History Cards */}
      <div className="max-w-6xl mx-auto space-y-6">
        {history.map((item) => {
          const status = getStatusStyle(item.status);
          const paymentStatus = getPaymentStatusStyle(item.paymentStatus);

          // console.log(item);
          return (
            <div
              key={item.id}
              className="bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700/30 p-6 transition-all duration-300 hover:shadow-3xl hover:bg-gray-800/60"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                {/* Main Content */}
                <div className="flex-1 space-y-4">
                  {/* Worker Info */}
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-white">
                        {item.workerName}
                      </h2>
                      <div className="flex items-center gap-2 text-gray-400">
                        <Briefcase className="w-4 h-4" />
                        <span>{item.category}</span>
                      </div>
                    </div>
                  </div>

                  {/* Location & Time */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-gray-400">
                      <MapPin className="w-4 h-4 text-blue-400" />
                      <span>{item.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Calendar className="w-4 h-4 text-purple-400" />
                      <span>
                        {item.date} • {item.time}
                      </span>
                    </div>
                  </div>

                  {/* Job Description */}
                  {item.jobDescription && (
                    <div className="bg-gray-700/30 rounded-xl p-4 border border-gray-600/30">
                      <p className="text-gray-300 leading-relaxed">
                        {item.jobDescription}
                      </p>
                    </div>
                  )}
                </div>

                {/* Status & Actions */}
                <div className="flex flex-col items-end gap-4 lg:min-w-48">
                  {/* Status Badge */}
                  <div
                    className={`px-4 py-2 rounded-xl border ${status.bgColor} flex items-center gap-2`}
                  >
                    {status.icon}
                    <span className={`font-semibold ${status.color}`}>
                      {item.status}
                    </span>
                  </div>

                  <div
                    className={`px-4 py-2 rounded-xl border ${paymentStatus.bgColor} flex items-center gap-2 shadow-sm`}
                  >
                    {paymentStatus.icon}
                    <span
                      className={`font-semibold ${paymentStatus.color} text-sm`}
                    >
                      {paymentStatus.text}
                    </span>
                  </div>
                  {item.status === "completed" && (
                    <div
                      className={`px-4 py-2 rounded-xl border ${
                        item.paymentStatus === "paid"
                          ? "bg-green-500/10 border-green-500/20"
                          : "bg-orange-500/10 border-orange-500/20"
                      } flex items-center gap-2`}
                    >
                      <span
                        className={`font-semibold ${
                          item.paymentStatus === "paid"
                            ? "text-green-400"
                            : "text-orange-400"
                        }`}
                      >
                        {item.paymentStatus === "paid"
                          ? "Paid"
                          : "Payment Pending"}
                      </span>
                    </div>
                  )}

                  {/* Review Status */}
                  {item.status.toLowerCase() === "completed" &&
                    item.paymentStatus.toLowerCase() === "paid" && (
                      <div
                        className={`px-4 py-2 rounded-xl border ${
                          item.hasReview
                            ? "bg-green-500/10 border-green-500/20"
                            : "bg-yellow-500/10 border-yellow-500/20"
                        } flex items-center gap-2`}
                      >
                        <Star
                          className={`w-4 h-4 ${
                            item.hasReview
                              ? "text-green-400"
                              : "text-yellow-400"
                          }`}
                        />
                        <span
                          className={`font-semibold text-sm ${
                            item.hasReview
                              ? "text-green-400"
                              : "text-yellow-400"
                          }`}
                        >
                          {item.hasReview ? "Reviewed" : "Review Pending"}
                        </span>
                      </div>
                    )}

                  {/* {console.log(item.status)} */}
                  {/* Action Buttons */}
                  <div className="flex flex-col gap-3 w-full">
                    {/* Cancel Button - for pending bookings */}
                    {item.status === "Pending" && (
                      <button
                        onClick={() => handleCancelBooking(item.id)}
                        className="group relative px-6 py-3 bg-gradient-to-r from-red-500/20 via-red-600/20 to-red-500/20 
                 hover:from-red-500/30 hover:via-red-600/30 hover:to-red-500/30 
                 border border-red-500/30 hover:border-red-400/50 
                 backdrop-blur-xl rounded-xl text-red-400 hover:text-red-300 
                 font-semibold transition-all duration-300 transform hover:scale-[1.02] 
                 shadow-lg hover:shadow-red-500/20 hover:shadow-2xl
                 active:scale-[0.98] overflow-hidden"
                      >
                        <div
                          className="absolute inset-0 bg-gradient-to-r from-red-600/10 to-red-500/10 
                      opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        ></div>
                        <div className="relative flex items-center justify-center gap-2">
                          <XCircle className="w-4 h-4" />
                          Cancel Request
                        </div>
                      </button>
                    )}

                    {/* Complete Job Button - for accepted bookings */}
                    {item.status === "Accepted" && (
                      <button
                        onClick={() => handleCompleteBooking(item.id)}
                        className="group relative px-6 py-3 bg-gradient-to-r from-emerald-500/20 via-emerald-600/20 to-emerald-500/20 
                 hover:from-emerald-500/30 hover:via-emerald-600/30 hover:to-emerald-500/30 
                 border border-emerald-500/30 hover:border-emerald-400/50 
                 backdrop-blur-xl rounded-xl text-emerald-400 hover:text-emerald-300 
                 font-semibold transition-all duration-300 transform hover:scale-[1.02] 
                 shadow-lg hover:shadow-emerald-500/20 hover:shadow-2xl
                 active:scale-[0.98] overflow-hidden"
                      >
                        <div
                          className="absolute inset-0 bg-gradient-to-r from-emerald-600/10 to-emerald-500/10 
                      opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        ></div>
                        <div className="relative flex items-center justify-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          Mark as Completed
                        </div>
                      </button>
                    )}

                    {item.status.toLowerCase() === "completed" &&
                      item.paymentStatus.toLowerCase() === "paid" &&
                      !item.hasReview && (
                        <button
                          onClick={() => openReviewModal(item, false)}
                          className="group relative px-6 py-3 bg-gradient-to-r from-yellow-500/20 via-yellow-600/20 to-yellow-500/20 
        hover:from-yellow-500/30 hover:via-yellow-600/30 hover:to-yellow-500/30 
        border border-yellow-500/30 hover:border-yellow-400/50 
        backdrop-blur-xl rounded-xl text-yellow-400 hover:text-yellow-300 
        font-semibold transition-all duration-300 transform hover:scale-[1.02] 
        shadow-lg hover:shadow-yellow-500/20 hover:shadow-2xl
        active:scale-[0.98] overflow-hidden"
                        >
                          <div
                            className="absolute inset-0 bg-gradient-to-r from-yellow-600/10 to-yellow-500/10 
        opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          ></div>
                          <div className="relative flex items-center justify-center gap-2">
                            <Star className="w-4 h-4" />
                            Add Review
                          </div>
                        </button>
                      )}

                    {/* Edit Review Button */}
                    {item.status.toLowerCase() === "completed" &&
                      item.paymentStatus.toLowerCase() === "paid" &&
                      item.hasReview && (
                        <button
                          onClick={() => openReviewModal(item, true)}
                          className="group relative px-6 py-3 bg-gradient-to-r from-blue-500/20 via-blue-600/20 to-blue-500/20 
        hover:from-blue-500/30 hover:via-blue-600/30 hover:to-blue-500/30 
        border border-blue-500/30 hover:border-blue-400/50 
        backdrop-blur-xl rounded-xl text-blue-400 hover:text-blue-300 
        font-semibold transition-all duration-300 transform hover:scale-[1.02] 
        shadow-lg hover:shadow-blue-500/20 hover:shadow-2xl
        active:scale-[0.98] overflow-hidden"
                        >
                          <div
                            className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-blue-500/10 
        opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          ></div>
                          <div className="relative flex items-center justify-center gap-2">
                            <MessageSquare className="w-4 h-4" />
                            Edit Review
                          </div>
                        </button>
                      )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Review Modal */}
        {reviewModal.open && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-2xl p-6 max-w-md w-full border border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">
                  {editingReview ? "Edit Review" : "Rate & Review"}
                </h3>
                <button
                  onClick={closeReviewModal}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-gray-300 mb-2">
                    Worker: {reviewModal.booking?.workerName}
                  </p>
                  <p className="text-gray-400 text-sm">
                    Service: {reviewModal.booking?.category}
                  </p>
                </div>

                {/* Star Rating */}
                <div>
                  <label className="block text-gray-300 mb-2">Rating</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => handleStarClick(star)}
                        className={`p-1 transition-colors ${
                          star <= reviewData.rating
                            ? "text-yellow-400 hover:text-yellow-300"
                            : "text-gray-600 hover:text-gray-500"
                        }`}
                      >
                        <Star className="w-8 h-8 fill-current" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Comment */}
                <div>
                  <label className="block text-gray-300 mb-2">
                    Comment (Optional)
                  </label>
                  <textarea
                    value={reviewData.comment}
                    onChange={(e) =>
                      setReviewData((prev) => ({
                        ...prev,
                        comment: e.target.value,
                      }))
                    }
                    placeholder="Share your experience..."
                    className="w-full bg-gray-700 border border-gray-600 rounded-xl p-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 resize-none"
                    rows={4}
                  />
                </div>

                {/* Submit Button */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={closeReviewModal}
                    className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={submitReview}
                    disabled={submittingReview || reviewData.rating === 0}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 disabled:from-gray-600 disabled:to-gray-600 text-white rounded-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:cursor-not-allowed"
                  >
                    {submittingReview ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white"></div>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        {editingReview ? "Update Review" : "Submit Review"}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {history.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700/30 p-12 max-w-md mx-auto">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Clock className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                No Requests Yet
              </h3>
              <p className="text-gray-400">
                Your service request history will appear here once you make your
                first booking.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
