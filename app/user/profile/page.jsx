"use client";

import { useState, useEffect } from "react";
import { User, Mail, Phone, MapPin, Edit3, Save, X, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import axios from "axios";

export default function UserProfilePage() {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    pincode: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ ...userData });
  const [profileLoading, setProfileLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      setProfileLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No authentication token found");
          return;
        }

        const response = await axios.get("/api/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const profile = {
          name: response.data.user.name || "",
          email: response.data.user.email || "",
          phone: response.data.user.phone || "",
          address: response.data.user.address || "",
          pincode: response.data.user.pincode || "",
        };

        setUserData(profile);
        setForm(profile);
      } catch (error) {
        console.error("Error fetching profile:", error);
        if (error.response?.status === 403) {
          setError("Access denied. Please ensure you're logged in.");
        } else if (error.response?.status === 404) {
          setError("User profile not found.");
        } else {
          setError("Failed to load profile data. Please try again.");
        }
      } finally {
        setProfileLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const errors = [];
    
    if (form.phone && !/^\+?[\d\s\-()]{10,}$/.test(form.phone.replace(/\s/g, ''))) {
      errors.push("Please enter a valid phone number");
    }
    
    if (form.pincode && !/^\d{6}$/.test(form.pincode)) {
      errors.push("Pincode must be 6 digits");
    }
    
    return errors;
  };

  const handleSave = async () => {
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setError(validationErrors.join(", "));
      return;
    }

    setUpdating(true);
    setError("");
    setSuccess("");
    try {
      const token = localStorage.getItem("token");
      await axios.patch("/api/profile", form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserData(form);
      setEditMode(false);
      setSuccess("Profile updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Failed to update profile. Please try again.");
      }
    } finally {
      setUpdating(false);
    }
  };

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 text-white px-4 py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-700"></div>
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 absolute top-0 left-0"></div>
          </div>
          <p className="mt-6 text-gray-400 text-lg">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 text-white px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 bg-clip-text text-transparent">
              User Profile
            </span>
          </h1>
          <p className="text-gray-400 text-lg">
            Manage your personal information and account settings
          </p>
        </div>

        {/* Alert Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <span className="text-red-400">{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-400" />
            <span className="text-emerald-400">{success}</span>
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700/30 p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white">Profile Information</h2>
          </div>

          {/* Profile Fields */}
          <div className="space-y-6">
            {/* Name Field */}
            <div>
              <label className="flex items-center gap-2 text-gray-400 font-medium mb-2">
                <User className="w-4 h-4" />
                Name
              </label>
              {editMode ? (
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                  placeholder="Enter your full name"
                />
              ) : (
                <div className="px-4 py-3 bg-gray-700/30 border border-gray-600/30 rounded-xl">
                  <p className="text-white text-lg">{userData.name || "No name provided"}</p>
                </div>
              )}
            </div>

            {/* Email Field - Non-editable */}
            <div>
              <label className="flex items-center gap-2 text-gray-400 font-medium mb-2">
                <Mail className="w-4 h-4" />
                Email
              </label>
              <div className="px-4 py-3 bg-gray-700/20 border border-gray-600/20 rounded-xl">
                <p className="text-gray-300">{userData.email}</p>
                <small className="text-gray-500">Email cannot be changed</small>
              </div>
            </div>

            {/* Phone Field */}
            <div>
              <label className="flex items-center gap-2 text-gray-400 font-medium mb-2">
                <Phone className="w-4 h-4" />
                Phone
              </label>
              {editMode ? (
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                  placeholder="Enter your phone number (e.g., +1234567890)"
                />
              ) : (
                <div className="px-4 py-3 bg-gray-700/30 border border-gray-600/30 rounded-xl">
                  <p className="text-white text-lg">{userData.phone || "No phone provided"}</p>
                </div>
              )}
            </div>

            {/* Pincode Field */}
            <div>
              <label className="flex items-center gap-2 text-gray-400 font-medium mb-2">
                <MapPin className="w-4 h-4" />
                Pincode
              </label>
              {editMode ? (
                <input
                  type="text"
                  name="pincode"
                  value={form.pincode}
                  onChange={handleChange}
                  maxLength="6"
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                  placeholder="Enter 6-digit pincode"
                />
              ) : (
                <div className="px-4 py-3 bg-gray-700/30 border border-gray-600/30 rounded-xl">
                  <p className="text-white text-lg">{userData.pincode || "No pincode provided"}</p>
                </div>
              )}
            </div>

            {/* Address Field */}
            <div>
              <label className="flex items-center gap-2 text-gray-400 font-medium mb-2">
                <MapPin className="w-4 h-4" />
                Address
              </label>
              {editMode ? (
                <textarea
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 resize-none"
                  placeholder="Enter your full address"
                />
              ) : (
                <div className="px-4 py-3 bg-gray-700/30 border border-gray-600/30 rounded-xl min-h-24">
                  <p className="text-white text-lg">{userData.address || "No address provided"}</p>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-4 mt-8 pt-6 border-t border-gray-700/30">
            {editMode ? (
              <>
                <button
                  onClick={handleSave}
                  disabled={updating}
                  className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 rounded-xl text-white font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:transform-none flex items-center justify-center gap-2"
                >
                  {updating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Saving Changes...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Save Changes
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setEditMode(false);
                    setForm(userData);
                    setError("");
                  }}
                  className="px-6 py-3 bg-gray-600/50 hover:bg-gray-600/70 border border-gray-500/50 rounded-xl text-white font-medium transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <X className="w-5 h-5" />
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditMode(true)}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-xl text-white font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                <Edit3 className="w-5 h-5" />
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Additional Info Card */}
        <div className="mt-6 bg-gray-800/30 backdrop-blur-xl rounded-2xl border border-gray-700/20 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white">Profile Tips</h3>
          </div>
          <ul className="space-y-2 text-gray-400">
            <li>• Keep your contact information up to date for better service</li>
            <li>• A complete profile helps workers provide accurate quotes</li>
            <li>• Your email cannot be changed for security reasons</li>
            <li>• Adding your pincode helps match you with nearby workers</li>
            <li>• Phone number is used for important service notifications</li>
          </ul>
        </div>
      </div>
    </div>
  );
}