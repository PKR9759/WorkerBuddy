"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Shield, Home, Clock, User, LogOut } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const links = [
    { href: "/user", label: "Home", icon: Home },
    { href: "/user/history", label: "History", icon: Clock },
    { href: "/user/profile", label: "Profile", icon: User },
  ];

  return (
    <nav className="sticky top-0 bg-gradient-to-r from-slate-900 via-gray-900 to-slate-900 backdrop-blur-lg shadow-xl z-50 border-b border-gray-700/30">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/user" className="group">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-xl shadow-lg group-hover:shadow-emerald-500/25 transition-all duration-300 group-hover:scale-105">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent group-hover:from-emerald-400 group-hover:to-blue-400 transition-all duration-300">
              WorkerBuddy
            </h1>
          </div>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center space-x-2">
          {links.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            
            return (
              <Link
                key={href}
                href={href}
                className={`group relative flex items-center space-x-2 px-5 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  isActive
                    ? "bg-gradient-to-r from-emerald-500/20 to-blue-500/20 text-emerald-400 shadow-lg shadow-emerald-500/10 border border-emerald-500/20"
                    : "text-gray-300 hover:text-white hover:bg-white/10 hover:shadow-lg hover:shadow-white/5"
                }`}
              >
                <Icon className={`w-5 h-5 transition-all duration-300 group-hover:scale-110 ${
                  isActive ? "text-emerald-400" : ""
                }`} />
                <span className="tracking-wide">{label}</span>
                
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gradient-to-r from-emerald-400 to-blue-400 rounded-full animate-pulse"></div>
                )}
                
                {/* Hover glow effect */}
                <div className="absolute inset-0 rounded-xl transition-opacity duration-300 group-hover:bg-gradient-to-r group-hover:from-emerald-500/5 group-hover:to-blue-500/5 opacity-0 group-hover:opacity-100"></div>
              </Link>
            );
          })}

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="group relative flex items-center space-x-2 px-5 py-3 rounded-xl font-semibold text-gray-300 hover:text-red-400 hover:bg-red-500/10 hover:shadow-lg hover:shadow-red-500/10 transition-all duration-300"
          >
            <LogOut className="w-5 h-5 transition-all duration-300 group-hover:scale-110" />
            <span className="tracking-wide">Logout</span>
            
            {/* Hover glow effect */}
            <div className="absolute inset-0 rounded-xl transition-opacity duration-300 group-hover:bg-red-500/5 opacity-0 group-hover:opacity-100"></div>
          </button>
        </div>
      </div>
    </nav>
  );
}