"use client";

import { useState, useEffect } from "react";
import { FaCheckCircle, FaClock, FaTimesCircle } from "react-icons/fa";
import axios from "axios";

export default function UserHistoryPage() {
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const getToken = () => localStorage.getItem("token");

  useEffect(() => {
    const fetchHistory = async () => {
      setHistoryLoading(true);
      try {
        const token = getToken();
        const response = await axios.get('/api/bookings', {
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

  const getStatusStyle = (status) => {
    switch (status) {
      case "Completed":
        return { icon: <FaCheckCircle className="text-green-500" />, color: "text-green-400" };
      case "Pending":
        return { icon: <FaClock className="text-yellow-400" />, color: "text-yellow-300" };
      case "Cancelled":
      case "Rejected":
        return { icon: <FaTimesCircle className="text-red-500" />, color: "text-red-400" };
      case "Accepted":
        return { icon: <FaCheckCircle className="text-blue-500" />, color: "text-blue-400" };
      default:
        return { icon: null, color: "text-gray-300" };
    }
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      const token = getToken();
      await axios.patch(`/api/bookings/${bookingId}`, {
        status: 'cancelled'
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const updatedResponse = await axios.get('/api/bookings', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHistory(updatedResponse.data.bookings || []);
    } catch (error) {
      console.error("Error cancelling booking:", error);
      alert("Failed to cancel booking. Please try again.");
    }
  };

  if (historyLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white px-4 py-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading your request history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white px-4 py-6">
      <h1 className="text-3xl font-bold text-center mb-8">Your Request History</h1>

      <div className="max-w-5xl mx-auto space-y-5">
        {history.map((item) => {
          const status = getStatusStyle(item.status);
          return (
            <div key={item.id} className="bg-gray-800 p-5 rounded-lg shadow-md">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold">{item.workerName}</h2>
                  <p className="text-gray-400">{item.category} | {item.location}</p>
                  <p className="text-gray-400">🗓 {item.date} | 🕒 {item.time}</p>
                  {item.jobDescription && (
                    <p className="text-gray-300 mt-2">{item.jobDescription}</p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-2">
                    {status.icon}
                    <span className={`font-semibold ${status.color}`}>{item.status}</span>
                  </div>

                  {item.status === "Pending" && (
                    <button
                      onClick={() => handleCancelBooking(item.id)}
                      className="text-sm px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-md transition"
                    >
                      Cancel Request
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        {history.length === 0 && (
          <p className="text-center text-gray-400 mt-10">No past requests found.</p>
        )}
      </div>
    </div>
  );
}
