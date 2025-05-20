"use client";

import { FiUser, FiLogIn, FiSend, FiSearch, FiCalendar, FiShield } from "react-icons/fi";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-6 py-4 bg-gray-800 shadow-md sticky top-0 z-50">
        <h1 className="text-2xl font-bold">WorkerBuddy</h1>
        <div className="space-x-6">
          <Link href="/login" className="hover:text-blue-400 flex items-center gap-1">
            <FiLogIn /> Login
          </Link>
          <Link href="/register" className="hover:text-blue-400 flex items-center gap-1">
            <FiUser /> Register
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-6 text-center bg-gray-900">
        <h2 className="text-5xl font-bold mb-4">Connecting Users with Skilled Workers</h2>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
          WorkerBuddy is a platform that allows users to post their work and connect with registered workers. We act as a middle layer – you manage your work and bookings directly.
        </p>
        <div className="mt-8 flex justify-center gap-6">
          <Link href="/login">
            <button className="bg-white text-gray-900 px-6 py-3 rounded-md font-semibold hover:shadow-lg transition">
              Get Started
            </button>
          </Link>
          <Link href="/register">
            <button className="border border-white px-6 py-3 rounded-md font-semibold hover:bg-white hover:text-gray-900 transition">
              Join as a Worker
            </button>
          </Link>
        </div>
      </section>

      {/* Platform Capabilities */}
      <section className="bg-gray-800 py-20 px-6">
        <h3 className="text-4xl font-bold text-center mb-12">What You Can Do on WorkerBuddy</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">

          <div className="bg-gray-700 p-6 rounded-lg shadow-md">
            <FiSearch className="w-8 h-8 text-blue-400 mb-4" />
            <h4 className="text-xl font-semibold mb-2">Find Workers</h4>
            <p className="text-gray-400">Search and explore workers across various categories and view their profiles.</p>
          </div>

          <div className="bg-gray-700 p-6 rounded-lg shadow-md">
            <FiSend className="w-8 h-8 text-blue-400 mb-4" />
            <h4 className="text-xl font-semibold mb-2">Post Your Work</h4>
            <p className="text-gray-400">Post job requirements and let workers reach out to you directly through the platform.</p>
          </div>

          <div className="bg-gray-700 p-6 rounded-lg shadow-md">
            <FiCalendar className="w-8 h-8 text-blue-400 mb-4" />
            <h4 className="text-xl font-semibold mb-2">Book Workers</h4>
            <p className="text-gray-400">Schedule work timings and finalize bookings with available workers.</p>
          </div>

          <div className="bg-gray-700 p-6 rounded-lg shadow-md">
            <FiUser className="w-8 h-8 text-blue-400 mb-4" />
            <h4 className="text-xl font-semibold mb-2">Register as Worker</h4>
            <p className="text-gray-400">Create your worker profile, set your expertise, and manage incoming jobs.</p>
          </div>

          <div className="bg-gray-700 p-6 rounded-lg shadow-md">
            <FiShield className="w-8 h-8 text-blue-400 mb-4" />
            <h4 className="text-xl font-semibold mb-2">Secure Access</h4>
            <p className="text-gray-400">Role-based login with separate dashboards for users and workers.</p>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-8 text-center text-gray-500">
        © 2025 WorkerBuddy. All rights reserved.
      </footer>
    </div>
  );
}
