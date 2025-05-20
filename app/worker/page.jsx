"use client";

import { useState } from "react";

const dummyBookings = [
  {
    id: 1,
    user: "John Doe",
    service: "Electrician",
    date: "2025-06-01",
    timeSlot: "10:00 AM - 12:00 PM",
    status: "Pending",
  },
  {
    id: 2,
    user: "Alice Smith",
    service: "Carpenter",
    date: "2025-06-02",
    timeSlot: "02:00 PM - 04:00 PM",
    status: "Accepted",
  },
];

export default function WorkerHome() {
  const [bookings, setBookings] = useState(dummyBookings);

  const updateStatus = (id, newStatus) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
    );
  };

  const rejectBooking = (id) => {
    setBookings((prev) => prev.filter((b) => b.id !== id));
  };

  return (
    <div className="py-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-6 text-center text-white">Your Bookings</h1>
      {bookings.length === 0 ? (
        <p className="text-center text-gray-400">No bookings available.</p>
      ) : (
        bookings.map(({ id, user, service, date, timeSlot, status }) => (
          <div
            key={id}
            className="bg-gray-800 p-5 mb-4 rounded-lg shadow hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold text-white mb-1">{service}</h2>
            <p className="text-gray-300 mb-1">
              <span className="font-semibold">User:</span> {user}
            </p>
            <p className="text-gray-300 mb-1">
              <span className="font-semibold">Date:</span> {date}
            </p>
            <p className="text-gray-300 mb-2">
              <span className="font-semibold">Time Slot:</span> {timeSlot}
            </p>
            <p className="mb-2">
              <span className="font-semibold">Status:</span>{" "}
              <span
                className={`font-bold ${
                  status === "Pending"
                    ? "text-yellow-400"
                    : status === "Accepted"
                    ? "text-green-400"
                    : "text-gray-400"
                }`}
              >
                {status}
              </span>
            </p>

            <div className="flex gap-3">
              {status !== "Accepted" && (
                <button
                  onClick={() => updateStatus(id, "Accepted")}
                  className="px-4 py-2 bg-red-600 rounded hover:bg-red-700 text-white transition"
                >
                  Accept
                </button>
              )}
              {status !== "Rejected" && (
                <button
                  onClick={() => rejectBooking(id)}
                  className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-700 text-white transition"
                >
                  Reject
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
