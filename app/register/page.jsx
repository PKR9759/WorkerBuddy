"use client";

import { useState } from "react";
import axios from "@/lib/axios";
import { useRouter } from "next/navigation";
import { User, Lock, Mail, MapPin, Briefcase, Shield, Eye, EyeOff } from "lucide-react";

export default function Register() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    pincode: "",
    userType: "User",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setIsLoading(true);
  
    try {
      const response = await axios.post("/auth/register", form);
      
      // Store token if provided in response
      if (response.data.token) {
        console.log("yes token is there ");
        localStorage.setItem("token", response.data.token);
      }
      
      // alert("Registration successful");
  
      // Redirect based on user type
      if (form.userType === "Worker") {
        router.push("/worker");
      } else {
        router.push("/user");
      }
    } catch (err) {
      alert(err?.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex flex-col justify-center items-center w-2/5 bg-gradient-to-br from-blue-900/20 to-purple-900/20 backdrop-blur-sm border-r border-gray-700/30 px-12">
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-2xl">
              <Shield className="w-16 h-16 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            WorkerBuddy
          </h1>
          <p className="text-xl text-gray-400 max-w-md leading-relaxed">
            Join our platform to connect emergency workers with those who need help most.
          </p>
          <div className="flex items-center justify-center space-x-8 pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">24/7</div>
              <div className="text-sm text-gray-400">Available</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">500+</div>
              <div className="text-sm text-gray-400">Workers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-400">Fast</div>
              <div className="text-sm text-gray-400">Response</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <form
            onSubmit={handleSubmit}
            className="bg-gray-800/50 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-gray-700/30"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
              <p className="text-gray-400">Join the WorkerBuddy community</p>
            </div>

            {/* Name Field */}
            <div className="mb-6 relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                <User className="w-5 h-5" />
              </div>
              <input
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                required
              />
            </div>

            {/* Email Field */}
            <div className="mb-6 relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Mail className="w-5 h-5" />
              </div>
              <input
                name="email"
                type="email"
                placeholder="Email Address"
                value={form.email}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                required
              />
            </div>

            {/* Password Field */}
            <div className="mb-6 relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Lock className="w-5 h-5" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="w-full pl-12 pr-12 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Confirm Password Field */}
            <div className="mb-6 relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Lock className="w-5 h-5" />
              </div>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={form.confirmPassword}
                onChange={handleChange}
                className="w-full pl-12 pr-12 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Pincode Field */}
            <div className="mb-6 relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                <MapPin className="w-5 h-5" />
              </div>
              <input
                name="pincode"
                placeholder="Pincode"
                value={form.pincode}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                required
              />
            </div>

            {/* User Type Selection */}
            <div className="mb-8 relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Briefcase className="w-5 h-5" />
              </div>
              <select
                name="userType"
                value={form.userType}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 appearance-none cursor-pointer"
                required
              >
                <option value="User">User - Need Services</option>
                <option value="Worker">Worker - Provide Services</option>
              </select>
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Creating Account...</span>
                </div>
              ) : (
                "Create Account"
              )}
            </button>

            {/* Login Link */}
            <p className="mt-6 text-center text-gray-400">
              Already have an account?{" "}
              <a 
                href="/login" 
                className="text-blue-400 hover:text-blue-300 font-medium hover:underline transition-colors"
              >
                Sign in here
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}