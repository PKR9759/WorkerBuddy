"use client";

import { useState } from "react";

export default function UserProfilePage() {
  const [userData, setUserData] = useState({
    name: "Rahul Mehta",
    email: "rahul@example.com",
    phone: "9876543210",
    address: "Ahmedabad, Gujarat",
  });

  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ ...userData });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setUserData(form);
    setEditMode(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white px-4 py-8">
      <div className="max-w-3xl mx-auto bg-gray-800 p-6 rounded-xl shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-center">User Profile</h1>

        <div className="space-y-4">
          <div>
            <label className="text-gray-400 block">Name</label>
            {editMode ? (
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="mt-1 w-full px-4 py-2 bg-gray-700 rounded border border-gray-600 text-white"
              />
            ) : (
              <p className="mt-1">{userData.name}</p>
            )}
          </div>

          <div>
            <label className="text-gray-400 block">Email</label>
            {editMode ? (
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="mt-1 w-full px-4 py-2 bg-gray-700 rounded border border-gray-600 text-white"
              />
            ) : (
              <p className="mt-1">{userData.email}</p>
            )}
          </div>

          <div>
            <label className="text-gray-400 block">Phone</label>
            {editMode ? (
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="mt-1 w-full px-4 py-2 bg-gray-700 rounded border border-gray-600 text-white"
              />
            ) : (
              <p className="mt-1">{userData.phone}</p>
            )}
          </div>

          <div>
            <label className="text-gray-400 block">Address</label>
            {editMode ? (
              <textarea
                name="address"
                rows={2}
                value={form.address}
                onChange={handleChange}
                className="mt-1 w-full px-4 py-2 bg-gray-700 rounded border border-gray-600 text-white"
              />
            ) : (
              <p className="mt-1">{userData.address}</p>
            )}
          </div>

          <div className="text-right mt-6">
            {editMode ? (
              <div className="space-x-3">
                <button
                  onClick={() => setEditMode(false)}
                  className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            ) : (
              <button
                onClick={() => setEditMode(true)}
                className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
