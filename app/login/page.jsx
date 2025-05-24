"use client";

import { useState } from "react";
import axios from "@/lib/axios";
import { useRouter } from "next/navigation";
import { Mail, Lock, Shield, Eye, EyeOff, ArrowRight } from "lucide-react";

export default function Login() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const res = await axios.post("/auth/login", {
        email: form.email,
        password: form.password
      });
  
      localStorage.setItem("token", res.data.token);
      // alert("Login successful");
  
      if (res.data.userType === "Worker") {
        router.push("/worker");
      } else {
        router.push("/user");
      }
    } catch (err) {
      alert(err?.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex flex-col justify-center items-center w-2/5 bg-gradient-to-br from-emerald-900/20 to-blue-900/20 backdrop-blur-sm border-r border-gray-700/30 px-12">
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="p-4 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-2xl shadow-2xl animate-pulse">
              <Shield className="w-16 h-16 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            WorkerBuddy
          </h1>
          <p className="text-xl text-gray-400 max-w-md leading-relaxed">
            Welcome back! Access your dashboard and manage your emergency services efficiently.
          </p>
          
          {/* Feature highlights */}
          <div className="grid grid-cols-2 gap-6 pt-8">
            <div className="bg-gray-800/30 p-4 rounded-xl border border-gray-700/30">
              <div className="text-2xl font-bold text-emerald-400 mb-1">Instant</div>
              <div className="text-sm text-gray-400">Connection</div>
            </div>
            <div className="bg-gray-800/30 p-4 rounded-xl border border-gray-700/30">
              <div className="text-2xl font-bold text-blue-400 mb-1">Secure</div>
              <div className="text-sm text-gray-400">Platform</div>
            </div>
            <div className="bg-gray-800/30 p-4 rounded-xl border border-gray-700/30">
              <div className="text-2xl font-bold text-purple-400 mb-1">24/7</div>
              <div className="text-sm text-gray-400">Support</div>
            </div>
            <div className="bg-gray-800/30 p-4 rounded-xl border border-gray-700/30">
              <div className="text-2xl font-bold text-orange-400 mb-1">Fast</div>
              <div className="text-sm text-gray-400">Response</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <form
            onSubmit={handleSubmit}
            className="bg-gray-800/50 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-gray-700/30"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
              <p className="text-gray-400">Sign in to your WorkerBuddy account</p>
            </div>

            {/* Email Field */}
            <div className="mb-6 relative group">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-400 transition-colors">
                <Mail className="w-5 h-5" />
              </div>
              <input
                name="email"
                type="email"
                placeholder="Email Address"
                value={form.email}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-4 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-300"
                required
              />
            </div>

            {/* Password Field */}
            <div className="mb-8 relative group">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-400 transition-colors">
                <Lock className="w-5 h-5" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="w-full pl-12 pr-12 py-4 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-300"
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

            
            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-gradient-to-r from-emerald-500 to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:from-emerald-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2 group"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Signing In...</span>
                </div>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            {/* Register Link */}
            <div className="mt-8 text-center">
              <p className="text-gray-400 mb-4">Don't have an account?</p>
              <a 
                href="/register" 
                className="inline-flex items-center space-x-2 text-emerald-400 hover:text-emerald-300 font-medium transition-colors group"
              >
                <span>Create your account</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>


          </form>
        </div>
      </div>
    </div>
  );
}