import { create } from "zustand";
import api from "@/lib/axios";


export const useAuthStore = create((set) => ({
  user: null,

  signup: async (name: string, email: string, password: string) => {
    await api.post("/auth/signup", { name, email, password });
  },

    login: async (email: string, password: string) => {
  const res = await api.post("/auth/login", { email, password });

  const token = res.data.token;
  const user = res.data.user;

  console.log("LOGIN RESPONSE:", res.data);

  localStorage.setItem("token", token);
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  
  const socketModule = await import("@/lib/socket");
  socketModule.initSocket();

  set({ user });
  return true;
},


  loadUser: async () => {
    try {
      const res = await api.get("/auth/profile");
      set({ user: res.data });
    } catch (err) {}
  },

  logout: () => {
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
    set({ user: null });
  },
}));
