"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-gray-900 text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/user">
          <span className="text-2xl font-bold tracking-wide">WorkerBuddy</span>
        </Link>
        <div className="space-x-6">
          <Link href="/user">
            <span className="hover:text-blue-400">Home</span>
          </Link>
          <Link href="/user/history">
            <span className="hover:text-blue-400">History</span>
          </Link>
          <Link href="/user/profile">
            <span className="hover:text-blue-400">Profile</span>
          </Link>
          <Link href="/logout">
            <span className="hover:text-red-400">Logout</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
