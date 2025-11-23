"use client";

import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

export function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const tokenRef = useRef<string | null>(null);

  useEffect(() => {
    
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    tokenRef.current = token;

    if (!token) return;

    const s = io("http://localhost:3000", {
      path: "/socket.io",
      transports: ["websocket", "polling"],
      auth: { token },
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    s.on("connect", () => {
      console.log("socket connected", s.id);
    });

    s.on("connect_error", (err: any) => {
      console.warn("socket connect_error", err.message);
    });

    setSocket(s);

    return () => {
      s.disconnect();
      setSocket(null);
    };
  }, []);

  return socket;
}
