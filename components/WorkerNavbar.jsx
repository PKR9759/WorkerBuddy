"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function WorkerNavbar() {
  const pathname = usePathname();

  const links = [
    { href: "/worker", label: "Home" },
    { href: "/worker/profile", label: "Profile" },
    { href: "/login", label: "Logout" },
  ];

  return (
    <nav className="sticky top-0 bg-gray-900 shadow-md z-50">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <Link href="/worker">
          <h1 className="text-2xl font-bold text-white cursor-pointer">WorkerBuddy</h1>
        </Link>

        <ul className="flex space-x-8 text-white font-semibold">
          {links.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className={`hover:text-blue-400 transition ${
                  pathname === href ? "text-blue-400 underline" : ""
                }`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
