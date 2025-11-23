
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { getSocket } from "@/lib/socket";

type TCtx = { socket: any | null; connected: boolean };

const SocketContext = createContext<TCtx>({ socket: null, connected: false });

export function SocketProvider({ children }: any) {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const s = getSocket();
    if (!s) {
      setConnected(false);
      return;
    }

    function onConnect() { setConnected(true); }
    function onDisconnect() { setConnected(false); }

    s.on("connect", onConnect);
    s.on("disconnect", onDisconnect);

    // cleanup
    return () => {
      s.off("connect", onConnect);
      s.off("disconnect", onDisconnect);
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket: getSocket(), connected }}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocketContext = () => useContext(SocketContext);
