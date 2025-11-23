
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;


export function initSocket() {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  if (!token) {
    console.warn("No token. Socket not initialized.");
    return null;
  }

  
  if (socket) {
    console.log("Socket already initialized");
    return socket;
  }

 
  socket = io("http://localhost:3000", {
    transports: ["websocket"],
    path: "/socket.io",
    auth: { token },
    autoConnect: true,
  });

  socket.on("connect", () => {
    console.log("SOCKET CONNECTED:", socket.id);
  });

  socket.on("connect_error", (err) => {
    console.error("Socket Error:", err.message);
  });

  return socket;
}


export function getSocket() {
  return socket;
}


export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
