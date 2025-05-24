"use client";

import { User, LogIn, Send, Search, Calendar, Shield, Star, Users, CheckCircle, Zap, Briefcase, Award } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 text-white">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-6 py-4 bg-gray-800/50 backdrop-blur-xl border-b border-gray-700/30 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 bg-clip-text text-transparent">
            WorkerBuddy
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="px-4 py-2 text-gray-300 hover:text-white transition-all duration-300 flex items-center gap-2 hover:bg-gray-700/30 rounded-lg">
            <LogIn className="w-4 h-4" />
            Login
          </Link>
          <Link href="/register" className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-xl text-white font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2">
            <User className="w-4 h-4" />
            Register
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-6 text-center relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10">
          <div className="max-w-4xl mx-auto mb-8">
            <h2 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Connecting Users with 
              <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 bg-clip-text text-transparent block">
                Skilled Workers
              </span>
            </h2>
            <p className="text-gray-400 max-w-3xl mx-auto text-xl leading-relaxed">
              WorkerBuddy is the ultimate platform that seamlessly connects users with verified skilled workers. 
              Post your work, find experts, and manage everything with ease. We're the bridge between your needs and professional solutions.
            </p>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mb-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400">500+</div>
              <div className="text-gray-400">Verified Workers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400">1000+</div>
              <div className="text-gray-400">Jobs Completed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-400">4.8★</div>
              <div className="text-gray-400">Average Rating</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link href="/login">
              <button className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-xl text-white font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-3">
                <Zap className="w-5 h-5" />
                Get Started Now
              </button>
            </Link>
            <Link href="/register">
              <button className="px-8 py-4 bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 hover:border-purple-500/50 rounded-xl text-white font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-3">
                <Award className="w-5 h-5" />
                Join as Worker
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Platform Capabilities */}
      <section className="py-20 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl md:text-5xl font-bold mb-4">
              What You Can Do on 
              <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 bg-clip-text text-transparent">
                WorkerBuddy
              </span>
            </h3>
            <p className="text-gray-400 text-xl max-w-2xl mx-auto">
              Discover the powerful features that make WorkerBuddy the perfect platform for connecting with skilled professionals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700/30 p-8 hover:shadow-xl transition-all duration-300 transform hover:scale-105 group">
              <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Search className="w-7 h-7 text-white" />
              </div>
              <h4 className="text-2xl font-semibold mb-4 text-white">Find Workers</h4>
              <p className="text-gray-400 leading-relaxed">
                Search and explore verified workers across various categories. View detailed profiles, ratings, and reviews to make informed decisions.
              </p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700/30 p-8 hover:shadow-xl transition-all duration-300 transform hover:scale-105 group">
              <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Send className="w-7 h-7 text-white" />
              </div>
              <h4 className="text-2xl font-semibold mb-4 text-white">Post Your Work</h4>
              <p className="text-gray-400 leading-relaxed">
                Post detailed job requirements and let skilled workers reach out to you directly. Get multiple quotes and choose the best fit.
              </p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700/30 p-8 hover:shadow-xl transition-all duration-300 transform hover:scale-105 group">
              <div className="w-14 h-14 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Calendar className="w-7 h-7 text-white" />
              </div>
              <h4 className="text-2xl font-semibold mb-4 text-white">Book Workers</h4>
              <p className="text-gray-400 leading-relaxed">
                Schedule work timings that fit your schedule. Manage appointments and track progress through our intuitive booking system.
              </p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700/30 p-8 hover:shadow-xl transition-all duration-300 transform hover:scale-105 group">
              <div className="w-14 h-14 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <User className="w-7 h-7 text-white" />
              </div>
              <h4 className="text-2xl font-semibold mb-4 text-white">Register as Worker</h4>
              <p className="text-gray-400 leading-relaxed">
                Create your professional profile, showcase your expertise, and start receiving job requests from customers in your area.
              </p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700/30 p-8 hover:shadow-xl transition-all duration-300 transform hover:scale-105 group">
              <div className="w-14 h-14 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <h4 className="text-2xl font-semibold mb-4 text-white">Secure Platform</h4>
              <p className="text-gray-400 leading-relaxed">
                Role-based authentication with separate dashboards. Your data is protected with enterprise-grade security measures.
              </p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700/30 p-8 hover:shadow-xl transition-all duration-300 transform hover:scale-105 group">
              <div className="w-14 h-14 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Star className="w-7 h-7 text-white" />
              </div>
              <h4 className="text-2xl font-semibold mb-4 text-white">Rating System</h4>
              <p className="text-gray-400 leading-relaxed">
                Rate and review workers after job completion. Build trust in the community with transparent feedback and quality assurance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose WorkerBuddy */}
      <section className="py-20 px-6 bg-gray-800/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              Why Choose WorkerBuddy?
            </h3>
            <p className="text-gray-400 text-xl">
              We're not just a platform - we're your trusted partner in getting work done right
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-white mb-2">Verified Professionals</h4>
                  <p className="text-gray-400">All workers go through our rigorous verification process to ensure quality and reliability.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-white mb-2">Local Experts</h4>
                  <p className="text-gray-400">Connect with skilled workers in your area who understand local requirements and standards.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-white mb-2">Quick Matching</h4>
                  <p className="text-gray-400">Our smart algorithm connects you with the right professionals based on your specific needs.</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700/30 p-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Award className="w-10 h-10 text-white" />
                </div>
                <h4 className="text-2xl font-semibold text-white mb-4">Ready to Get Started?</h4>
                <p className="text-gray-400 mb-6">
                  Join thousands of satisfied customers and workers who trust WorkerBuddy for their service needs.
                </p>
                <div className="space-y-3">
                  <Link href="/register" className="block">
                    <button className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-xl text-white font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                      Start Your Journey
                    </button>
                  </Link>
                  <Link href="/login" className="block">
                    <button className="w-full px-6 py-3 bg-gray-700/50 hover:bg-gray-600/50 border border-gray-600/50 rounded-xl text-white font-medium transition-all duration-300">
                      Already have an account?
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900/50 backdrop-blur-xl border-t border-gray-700/30 py-12 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Briefcase className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 bg-clip-text text-transparent">
              WorkerBuddy
            </span>
          </div>
          <p className="text-gray-400 mb-4">
            Connecting skilled professionals with those who need their expertise.
          </p>
          <p className="text-gray-500 text-sm">
            © 2025 WorkerBuddy. All rights reserved. Built with ❤️ for the community.
          </p>
        </div>
      </footer>
    </div>
  );
}