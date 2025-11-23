"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const signup = useAuthStore((s: any) => s.signup);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSignup() {
    try {
      await signup(name, email, password);
      alert("Signup successful! Please login.");
      router.push("/login");
    } catch (err) {
      alert("Signup failed. Email may already exist.");
    }
  }

  return (
    <div className="h-screen flex items-center justify-center bg-gray-950">
      <div className="bg-gray-900 p-6 rounded-xl w-96 shadow-xl">
        <h1 className="text-white text-2xl mb-5 text-center">Create Account</h1>

        <input
          className="w-full p-3 rounded mb-3 bg-gray-800 text-white"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="w-full p-3 rounded mb-3 bg-gray-800 text-white"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full p-3 rounded mb-5 bg-gray-800 text-white"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleSignup}
          className="w-full p-3 bg-green-500 rounded text-white font-bold hover:bg-green-600"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}
