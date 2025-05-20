"use client";

import { useState, useEffect } from "react";

export default function WorkerProfile() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    contactNumber: "",
    location: "",
  });

  // Dummy effect to simulate fetching current profile info
  useEffect(() => {
    // Simulate fetched data
    const fetchedData = {
      name: "John Worker",
      email: "john.worker@example.com",
      contactNumber: "1234567890",
      location: "Ahmedabad, Gujarat",
    };
    setForm(fetchedData);
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would send updated data to backend
    alert("Profile updated successfully!");
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-800 rounded-lg shadow-lg text-white mt-8">
      <h2 className="text-3xl font-bold mb-6 text-center">Your Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-1 font-semibold" htmlFor="name">Name</label>
          <input
            type="text"
            name="name"
            id="name"
            value={form.name}
            onChange={handleChange}
            className="w-full p-3 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold" htmlFor="email">Email (readonly)</label>
          <input
            type="email"
            name="email"
            id="email"
            value={form.email}
            readOnly
            className="w-full p-3 rounded-md bg-gray-600 text-gray-300 cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold" htmlFor="contactNumber">Contact Number</label>
          <input
            type="tel"
            name="contactNumber"
            id="contactNumber"
            value={form.contactNumber}
            onChange={handleChange}
            className="w-full p-3 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter your contact number"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold" htmlFor="location">Location</label>
          <input
            type="text"
            name="location"
            id="location"
            value={form.location}
            onChange={handleChange}
            className="w-full p-3 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter your location"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-md font-semibold transition"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
}
