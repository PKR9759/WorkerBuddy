"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield, User, Star, LogOut } from "lucide-react";

export default function WorkerNavbar() {
  const pathname = usePathname();

  const links = [
    { href: "/worker", label: "Home", icon: Shield },
    { href: "/worker/profile", label: "Profile", icon: User },
    { href: "/worker/reviews", label: "Reviews", icon: Star },
    { href: "/login", label: "Logout", icon: LogOut },
  ];

  return (
    <nav className="sticky top-0 bg-gradient-to-r from-slate-900 via-gray-900 to-slate-900 backdrop-blur-lg shadow-xl z-50 border-b border-gray-700/30">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/worker" className="group">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg group-hover:shadow-blue-500/25 transition-all duration-300 group-hover:scale-105">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent group-hover:from-blue-400 group-hover:to-purple-400 transition-all duration-300">
              WorkerBuddy
            </h1>
          </div>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center space-x-2">
          {links.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            const isLogout = label === "Logout";
            
            return (
              <Link
                key={href}
                href={href}
                className={`group relative flex items-center space-x-2 px-5 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  isActive
                    ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-400 shadow-lg shadow-blue-500/10 border border-blue-500/20"
                    : isLogout
                    ? "text-gray-300 hover:text-red-400 hover:bg-red-500/10 hover:shadow-lg hover:shadow-red-500/10"
                    : "text-gray-300 hover:text-white hover:bg-white/10 hover:shadow-lg hover:shadow-white/5"
                }`}
              >
                <Icon className={`w-5 h-5 transition-all duration-300 group-hover:scale-110 ${
                  isActive ? "text-blue-400" : ""
                }`} />
                <span className="tracking-wide">{label}</span>
                
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse"></div>
                )}
                
                {/* Hover glow effect */}
                <div className={`absolute inset-0 rounded-xl transition-opacity duration-300 ${
                  isLogout 
                    ? "group-hover:bg-red-500/5 opacity-0 group-hover:opacity-100"
                    : "group-hover:bg-gradient-to-r group-hover:from-blue-500/5 group-hover:to-purple-500/5 opacity-0 group-hover:opacity-100"
                }`}></div>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}