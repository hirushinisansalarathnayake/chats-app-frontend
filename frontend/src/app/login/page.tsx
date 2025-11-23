"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((s: any) => s.login);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin() {
    try {
      const ok = await login(email, password);
      if (!ok) return;

      
      setTimeout(() => router.push("/chats"), 100);
    } catch (err) {
      alert("Invalid email or password");
    }
  }

  return (
    <div className="h-screen flex items-center justify-center bg-gray-950">
      <div className="bg-gray-900 p-6 rounded-xl w-96 shadow-xl">
        <h1 className="text-white text-2xl mb-5 text-center">Welcome Back</h1>

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
          onClick={handleLogin}
          className="w-full p-3 bg-blue-500 rounded text-white font-bold hover:bg-blue-600"
        >
          Login
        </button>

        <p className="text-gray-400 text-center mt-4 text-sm">
          Don’t have an account?{" "}
          <span
            className="text-blue-400 cursor-pointer"
            onClick={() => router.push("/signup")}
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
}
