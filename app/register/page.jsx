"use client";

import { useState } from "react";
import axios from "@/lib/axios";
import { useRouter } from "next/navigation";
import { FiUser, FiLock, FiMail } from "react-icons/fi";

export default function Register() {
  const router = useRouter();
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

    try {
      await axios.post("/auth/register", form);
      alert("Registration successful");
      router.push("/user");
    } catch (err) {
      alert(err?.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden md:flex flex-col justify-center items-center w-1/3 bg-gray-900 border-r border-gray-700 px-10">
        <div className="mb-10 flex flex-col items-center">
          <FiUser className="text-white w-20 h-20 mb-4" />
          <h1 className="text-4xl font-extrabold text-white tracking-wide">WorkerBuddy</h1>
        </div>
        <p className="text-gray-400 text-center">Create a new account to get started.</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex-1 max-w-md mx-auto p-8 text-white bg-gray-800 rounded-lg shadow-xl m-6"
      >
        <h2 className="text-3xl font-bold mb-8 text-center tracking-wide">Register</h2>

        <div className="mb-4 relative">
          <FiUser className="absolute left-3 top-3 text-white w-5 h-5" />
          <input
            name="name"
            placeholder="Name"
            onChange={handleChange}
            className="pl-10 w-full p-3 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
            required
          />
        </div>

        <div className="mb-4 relative">
          <FiMail className="absolute left-3 top-3 text-white w-5 h-5" />
          <input
            name="email"
            placeholder="Email"
            onChange={handleChange}
            type="email"
            className="pl-10 w-full p-3 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
            required
          />
        </div>

        <div className="mb-4 relative">
          <FiLock className="absolute left-3 top-3 text-white w-5 h-5" />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="pl-10 w-full p-3 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
            required
          />
        </div>

        <div className="mb-4 relative">
          <FiLock className="absolute left-3 top-3 text-white w-5 h-5" />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            onChange={handleChange}
            className="pl-10 w-full p-3 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
            required
          />
        </div>

        <input
          name="pincode"
          placeholder="Pincode"
          onChange={handleChange}
          className="mb-6 w-full p-3 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
          required
        />

        <select
          name="userType"
          value={form.userType}
          onChange={handleChange}
          className="mb-6 w-full p-3 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-white"
          required
        >
          <option value="User">User</option>
          <option value="Worker">Worker</option>
          
        </select>

        <button
          type="submit"
          className="w-full py-3 bg-white text-gray-900 font-semibold rounded-md shadow-lg hover:shadow-xl transition-shadow duration-300"
        >
          Register
        </button>

        <p className="mt-4 text-center text-gray-400">
          Already have an account?{" "}
          <a href="/login" className="text-blue-400 hover:underline">
            Login here
          </a>
        </p>
      </form>
    </div>
  );
}
