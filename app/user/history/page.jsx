"use client";

import { useState } from "react";
import { FaCheckCircle, FaClock, FaTimesCircle } from "react-icons/fa";

export default function UserHistoryPage() {
  const [history] = useState([
    {
      id: 1,
      workerName: "Ravi Kumar",
      category: "Electrician",
      location: "Ahmedabad",
      date: "2025-05-10",
      time: "10:00 AM",
      status: "Completed",
    },
    {
      id: 2,
      workerName: "Suresh Patel",
      category: "Painter",
      location: "Ahmedabad",
      date: "2025-05-15",
      time: "12:00 PM",
      status: "Pending",
    },
    {
      id: 3,
      workerName: "Mohan Desai",
      category: "Mechanic",
      location: "Rajkot",
      date: "2025-05-05",
      time: "2:00 PM",
      status: "Cancelled",
    },
  ]);

  const getStatusStyle = (status) => {
    switch (status) {
      case "Completed":
        return { icon: <FaCheckCircle className="text-green-500" />, color: "text-green-400" };
      case "Pending":
        return { icon: <FaClock className="text-yellow-400" />, color: "text-yellow-300" };
      case "Cancelled":
        return { icon: <FaTimesCircle className="text-red-500" />, color: "text-red-400" };
      default:
        return { icon: null, color: "text-gray-300" };
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white px-4 py-6">
      <h1 className="text-3xl font-bold text-center mb-8">Your Request History</h1>

      <div className="max-w-5xl mx-auto space-y-5">
        {history.map((item) => {
          const status = getStatusStyle(item.status);
          return (
            <div key={item.id} className="bg-gray-800 p-5 rounded-lg shadow-md flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold">{item.workerName}</h2>
                <p className="text-gray-400">
                  {item.category} | {item.location}
                </p>
                <p className="text-gray-400">🗓 {item.date} | 🕒 {item.time}</p>
              </div>
              <div className="flex items-center gap-2">
                {status.icon}
                <span className={`font-semibold ${status.color}`}>{item.status}</span>
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
