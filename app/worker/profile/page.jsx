"use client";

import { useState, useEffect } from "react";
import { User, Mail, Phone, MapPin, Edit3, Save, X, Loader2, AlertCircle, Star, CheckCircle, Plus, Minus, Briefcase, Award, Activity, Clock, Home } from "lucide-react";
import axios from "axios";

export default function WorkerProfilePage() {
  const [workerData, setWorkerData] = useState({
    name: "",
    email: "",
    phone: "",
    pincode: "",
    address: "",
    skills: [],
    availability: true,
    timeSlots: {
      monday: { available: true, startTime: "09:00", endTime: "18:00" },
      tuesday: { available: true, startTime: "09:00", endTime: "18:00" },
      wednesday: { available: true, startTime: "09:00", endTime: "18:00" },
      thursday: { available: true, startTime: "09:00", endTime: "18:00" },
      friday: { available: true, startTime: "09:00", endTime: "18:00" },
      saturday: { available: true, startTime: "09:00", endTime: "18:00" },
      sunday: { available: false, startTime: "09:00", endTime: "18:00" }
    },
    rating: 0,
    verified: false,
    completedJobs: 0,
    workHistory: [],
    reviews: []
  });
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ ...workerData });
  const [newSkill, setNewSkill] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const getToken = () => localStorage.getItem("token");

  const availableSkills = [
    "Electrician", "Plumber", "Carpenter", "Painter", "Mechanic", 
    "Cleaner", "Gardner", "AC Repair", "Appliance Repair", "Pest Control"
  ];

  const dayNames = {
    monday: "Monday",
    tuesday: "Tuesday", 
    wednesday: "Wednesday",
    thursday: "Thursday",
    friday: "Friday",
    saturday: "Saturday",
    sunday: "Sunday"
  };

  useEffect(() => {
    const fetchProfile = async () => {
      setProfileLoading(true);
      setError("");
      try {
        const token = getToken();
        if (!token) {
          setError("No authentication token found");
          return;
        }

        const response = await axios.get('/api/worker/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        console.log('API Response:', response.data);
        
        if (!response.data) {
          throw new Error("Invalid response format");
        }
        
        const profile = {
          name: response.data?.user?.name || "",
          email: response.data?.user?.email || "",
          phone: response.data?.user?.phone || "",
          pincode: response.data?.user?.pincode || "",
          address: response.data?.user?.address || "",
          skills: response.data?.worker?.skills || [],
          availability: response.data?.worker?.availability ?? true,
          timeSlots: response.data?.worker?.timeSlots || {
            monday: { available: true, startTime: "09:00", endTime: "18:00" },
            tuesday: { available: true, startTime: "09:00", endTime: "18:00" },
            wednesday: { available: true, startTime: "09:00", endTime: "18:00" },
            thursday: { available: true, startTime: "09:00", endTime: "18:00" },
            friday: { available: true, startTime: "09:00", endTime: "18:00" },
            saturday: { available: true, startTime: "09:00", endTime: "18:00" },
            sunday: { available: false, startTime: "09:00", endTime: "18:00" }
          },
          rating: response.data?.worker?.rating || 0,
          verified: response.data?.worker?.verified || false,
          completedJobs: response.data?.worker?.completedJobs || 0,
          workHistory: response.data?.worker?.workHistory || [],
          reviews: response.data?.worker?.reviews || []
        };
        
        setWorkerData(profile);
        setForm(profile);
      } catch (error) {
        console.error("Error fetching profile:", error);
        if (error.response?.status === 403) {
          setError("Access denied. Please ensure you're logged in as a worker.");
        } else if (error.response?.status === 404) {
          setError("Worker profile not found.");
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
    const { name, value, type, checked } = e.target;
    setForm({ 
      ...form, 
      [name]: type === 'checkbox' ? checked : value 
    });
  };

  const handleTimeSlotChange = (day, field, value) => {
    setForm({
      ...form,
      timeSlots: {
        ...form.timeSlots,
        [day]: {
          ...form.timeSlots[day],
          [field]: value
        }
      }
    });
  };

  const handleAddSkill = (skill) => {
    if (!form.skills.includes(skill)) {
      setForm({ ...form, skills: [...form.skills, skill] });
    }
  };

  const handleAddCustomSkill = () => {
    if (newSkill.trim() && !form.skills.includes(newSkill.trim())) {
      setForm({ ...form, skills: [...form.skills, newSkill.trim()] });
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setForm({ 
      ...form, 
      skills: form.skills.filter(skill => skill !== skillToRemove) 
    });
  };

  const handleSave = async () => {
    setUpdating(true);
    setError("");
    setSuccess("");
    try {
      const token = getToken();
      await axios.patch('/api/worker/profile', form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWorkerData(form);
      setEditMode(false);
      setSuccess("Profile updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Failed to update profile. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  const getSkillIcon = (skill) => {
    const icons = {
      Electrician: "⚡",
      Plumber: "🔧",
      Carpenter: "🔨",
      Painter: "🎨",
      Mechanic: "⚙️",
      Cleaner: "🧽",
      Gardner: "🌱",
      "AC Repair": "❄️",
      "Appliance Repair": "🔌",
      "Pest Control": "🐛"
    };
    return icons[skill] || "🛠️";
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
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-2">
              <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 bg-clip-text text-transparent">
                Worker Profile
              </span>
            </h1>
            <p className="text-gray-400 text-lg">Manage your professional information and services</p>
          </div>
          {workerData.verified && (
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 border border-emerald-500/30 rounded-xl">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              <span className="text-emerald-400 font-medium">Verified Professional</span>
            </div>
          )}
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

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Column - Basic Info */}
          <div className="xl:col-span-2 space-y-6">
            {/* Basic Information Card */}
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700/30 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-white">Basic Information</h2>
              </div>

              <div className="space-y-6">
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
                      <p className="text-white text-lg">{workerData.name || "No name provided"}</p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="flex items-center gap-2 text-gray-400 font-medium mb-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </label>
                  <div className="px-4 py-3 bg-gray-700/20 border border-gray-600/20 rounded-xl">
                    <p className="text-gray-300">{workerData.email}</p>
                    <small className="text-gray-500">Email cannot be changed</small>
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-gray-400 font-medium mb-2">
                    <Phone className="w-4 h-4" />
                    Phone
                  </label>
                  {editMode ? (
                    <input
                      type="text"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                      placeholder="Enter your phone number"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-gray-700/30 border border-gray-600/30 rounded-xl">
                      <p className="text-white text-lg">{workerData.phone || "No phone provided"}</p>
                    </div>
                  )}
                </div>

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
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                      placeholder="Enter your pincode"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-gray-700/30 border border-gray-600/30 rounded-xl">
                      <p className="text-white text-lg">{workerData.pincode || "No pincode provided"}</p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="flex items-center gap-2 text-gray-400 font-medium mb-2">
                    <Home className="w-4 h-4" />
                    Address
                  </label>
                  {editMode ? (
                    <textarea
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 resize-vertical"
                      placeholder="Enter your full address"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-gray-700/30 border border-gray-600/30 rounded-xl">
                      <p className="text-white text-lg">{workerData.address || "No address provided"}</p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="flex items-center gap-2 text-gray-400 font-medium mb-3">
                    <Activity className="w-4 h-4" />
                    Availability Status
                  </label>
                  {editMode ? (
                    <label className="flex items-center gap-3 p-4 bg-gray-700/30 border border-gray-600/30 rounded-xl cursor-pointer hover:bg-gray-700/40 transition-all duration-300">
                      <input
                        type="checkbox"
                        name="availability"
                        checked={form.availability}
                        onChange={handleChange}
                        className="w-5 h-5 rounded border-gray-600 text-blue-500 focus:ring-blue-500/50"
                      />
                      <span className="text-white">Available for work</span>
                    </label>
                  ) : (
                    <div className="flex items-center gap-3">
                      <div className={`px-4 py-2 rounded-xl border flex items-center gap-2 ${
                        workerData.availability 
                          ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400' 
                          : 'bg-red-500/20 border-red-500/30 text-red-400'
                      }`}>
                        <div className={`w-2 h-2 rounded-full ${
                          workerData.availability ? 'bg-emerald-400' : 'bg-red-400'
                        }`}></div>
                        <span className="font-medium">
                          {workerData.availability ? 'Available' : 'Not Available'}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Skills Card */}
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700/30 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-white">Skills & Services</h2>
              </div>

              {editMode ? (
                <div className="space-y-6">
                  {/* Current Skills */}
                  <div>
                    <label className="text-gray-400 font-medium mb-3 block">Your Skills</label>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {form.skills.map((skill) => (
                        <div
                          key={skill}
                          className="bg-blue-500/20 border border-blue-500/30 text-blue-400 px-4 py-2 rounded-xl text-sm flex items-center gap-2 group"
                        >
                          <span>{getSkillIcon(skill)}</span>
                          <span>{skill}</span>
                          <button
                            onClick={() => handleRemoveSkill(skill)}
                            className="text-red-400 hover:text-red-300 transition-colors duration-200"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Add Custom Skill */}
                  <div>
                    <label className="text-gray-400 font-medium mb-3 block">Add Custom Skill</label>
                    <div className="flex gap-2 mb-4">
                      <input
                        type="text"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        placeholder="Enter custom skill"
                        className="flex-1 px-4 py-2 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                        onKeyPress={(e) => e.key === 'Enter' && handleAddCustomSkill()}
                      />
                      <button
                        onClick={handleAddCustomSkill}
                        className="px-4 py-2 bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-xl hover:bg-blue-500/30 transition-all duration-300 flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Add
                      </button>
                    </div>
                  </div>

                  {/* Available Skills */}
                  <div>
                    <label className="text-gray-400 font-medium mb-3 block">Popular Skills</label>
                    <div className="flex flex-wrap gap-2">
                      {availableSkills
                        .filter(skill => !form.skills.includes(skill))
                        .map((skill) => (
                          <button
                            key={skill}
                            onClick={() => handleAddSkill(skill)}
                            className="bg-gray-700/50 border border-gray-600/50 text-gray-300 px-4 py-2 rounded-xl text-sm hover:bg-gray-600/50 hover:text-white transition-all duration-300 flex items-center gap-2"
                          >
                            <Plus className="w-4 h-4" />
                            <span>{getSkillIcon(skill)}</span>
                            <span>{skill}</span>
                          </button>
                        ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-3">
                  {workerData.skills.map((skill) => (
                    <div
                      key={skill}
                      className="bg-blue-500/20 border border-blue-500/30 text-blue-400 px-4 py-2 rounded-xl text-sm flex items-center gap-2"
                    >
                      <span>{getSkillIcon(skill)}</span>
                      <span>{skill}</span>
                    </div>
                  ))}
                  {workerData.skills.length === 0 && (
                    <p className="text-gray-400">No skills added yet</p>
                  )}
                </div>
              )}
            </div>

            {/* Time Slots Card */}
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700/30 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-600 rounded-xl flex items-center justify-center">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-white">Working Hours</h2>
              </div>

              <div className="space-y-4">
                {Object.entries(form.timeSlots).map(([day, slot]) => (
                  <div key={day} className="p-4 bg-gray-700/30 border border-gray-600/30 rounded-xl">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="flex items-center gap-3 min-w-[100px]">
                        {editMode ? (
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={slot.available}
                              onChange={(e) => handleTimeSlotChange(day, 'available', e.target.checked)}
                              className="w-4 h-4 rounded border-gray-600 text-blue-500 focus:ring-blue-500/50"
                            />
                            <span className="text-white font-medium capitalize">{dayNames[day]}</span>
                          </label>
                        ) : (
                          <span className="text-white font-medium capitalize">{dayNames[day]}</span>
                        )}
                        <div className={`w-2 h-2 rounded-full ${
                          slot.available ? 'bg-emerald-400' : 'bg-red-400'
                        }`}></div>
                      </div>
                      
                      {slot.available && (
                        <div className="flex items-center gap-2 flex-1">
                          {editMode ? (
                            <>
                              <input
                                type="time"
                                value={slot.startTime}
                                onChange={(e) => handleTimeSlotChange(day, 'startTime', e.target.value)}
                                className="px-3 py-2 bg-gray-600/50 border border-gray-500/50 rounded-lg text-white text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
                              />
                              <span className="text-gray-400">to</span>
                              <input
                                type="time"
                                value={slot.endTime}
                                onChange={(e) => handleTimeSlotChange(day, 'endTime', e.target.value)}
                                className="px-3 py-2 bg-gray-600/50 border border-gray-500/50 rounded-lg text-white text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
                              />
                            </>
                          ) : (
                            <span className="text-gray-300">
                              {slot.startTime} - {slot.endTime}
                            </span>
                          )}
                        </div>
                      )}
                      
                      {!slot.available && !editMode && (
                        <span className="text-gray-400 italic">Not available</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Stats & Actions */}
          <div className="space-y-6">
            {/* Stats Card */}
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700/30 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center">
                  <Award className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-white">Professional Stats</h2>
              </div>

              <div className="space-y-6">
                {/* Rating */}
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Star className="w-8 h-8 text-yellow-400 fill-current" />
                    <span className="text-3xl font-bold text-yellow-400">
                      {workerData.rating.toFixed(1)}
                    </span>
                  </div>
                  <p className="text-gray-400">Average Rating</p>
                  <p className="text-gray-500 text-sm mt-1">
                    Based on {workerData.reviews.length} review{workerData.reviews.length !== 1 ? 's' : ''}
                  </p>
                </div>

                {/* Completed Jobs */}
                <div className="text-center p-4 bg-gray-700/30 rounded-xl border border-gray-600/30">
                  <div className="text-2xl font-bold text-white mb-1">
                    {workerData.completedJobs}
                  </div>
                  <p className="text-gray-400 text-sm">Completed Jobs</p>
                </div>

                {/* Work History Count */}
                <div className="text-center p-4 bg-gray-700/30 rounded-xl border border-gray-600/30">
                  <div className="text-2xl font-bold text-white mb-1">
                    {workerData.workHistory.length}
                  </div>
                  <p className="text-gray-400 text-sm">Total Bookings</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700/30 p-6">
              <div className="space-y-4">
                {editMode ? (
                  <>
                    <button
                      onClick={handleSave}
                      disabled={updating}
                      className="w-full px-6 py-3 bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 rounded-xl text-white font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:transform-none flex items-center justify-center gap-2"
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
                        setForm(workerData);
                        setError("");
                        setNewSkill("");
                      }}
                      className="w-full px-6 py-3 bg-gray-600/50 hover:bg-gray-600/70 border border-gray-500/50 rounded-xl text-white font-medium transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <X className="w-5 h-5" />
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setEditMode(true)}
                    className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-xl text-white font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
                  
                    <Edit3 className="w-5 h-5" />
                    Edit Profile
                  </button>
                )}
              </div>
            </div>

            {/* Profile Tips Card */}
            <div className="bg-gray-800/30 backdrop-blur-xl rounded-2xl border border-gray-700/20 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white">Profile Tips</h3>
              </div>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>• Keep your contact information updated for better communication</li>
                <li>• Add all relevant skills to get more job opportunities</li>
                <li>• Update your availability status regularly</li>
                <li>• Complete profile helps build customer trust</li>
                <li>• Set proper working hours to match customer expectations</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Add the missing handleAddCustomSkill function that was referenced but not defined
const handleAddCustomSkill = () => {
  if (newSkill.trim() && !form.skills.includes(newSkill.trim())) {
    setForm({ ...form, skills: [...form.skills, newSkill.trim()] });
    setNewSkill("");
  }
};