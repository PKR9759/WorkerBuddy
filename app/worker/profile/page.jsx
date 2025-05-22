"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export default function UserProfilePage() {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ ...userData });
  const [profileLoading, setProfileLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  const getToken = () => localStorage.getItem("token");

  useEffect(() => {
    const fetchProfile = async () => {
      setProfileLoading(true);
      try {
        const token = getToken();
        const response = await axios.get('/api/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const profile = {
          name: response.data.user.name || "",
          email: response.data.user.email || "",
          phone: response.data.user.phone || "",
          address: response.data.user.address || "",
        };
        setUserData(profile);
        setForm(profile);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setError("Failed to load profile data");
      } finally {
        setProfileLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setUpdating(true);
    setError("");
    try {
      const token = getToken();
      await axios.patch('/api/profile', form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserData(form);
      setEditMode(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Failed to update profile. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white px-4 py-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white px-4 py-8">
      <div className="max-w-3xl mx-auto bg-gray-800 p-6 rounded-xl shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-center">User Profile</h1>

        {error && (
          <div className="bg-red-500 text-white p-3 rounded-md mb-4">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {["name", "email", "phone", "address"].map((field) => (
            <div key={field}>
              <label className="text-gray-400 block capitalize">{field}</label>
              {editMode ? (
                <input
                  type={field === "email" ? "email" : "text"}
                  name={field}
                  value={form[field]}
                  onChange={handleChange}
                  className="mt-1 w-full px-4 py-2 bg-gray-700 rounded border border-gray-600 text-white"
                />
              ) : (
                <p className="mt-1">{userData[field]}</p>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-4 mt-6">
          {editMode ? (
            <>
              <button
                onClick={handleSave}
                disabled={updating}
                className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-md text-white disabled:opacity-50"
              >
                {updating ? "Saving..." : "Save"}
              </button>
              <button
                onClick={() => {
                  setEditMode(false);
                  setForm(userData);
                }}
                className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-md text-white"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditMode(true)}
              className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded-md text-white"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
