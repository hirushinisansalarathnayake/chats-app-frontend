// src/components/chat/ChatHeader.tsx
"use client";
import { useEffect, useState } from "react";
import { useSocket } from "@/hooks/useSocket";
import { useChatStore } from "@/store/chatStore";

export default function ChatHeader() {
  const chat = useChatStore((s: any) => s.selectedChat);
  const [isOnline, setIsOnline] = useState(false);
  const [lastSeen, setLastSeen] = useState<string | null>(null);
  const socket = useSocket();

  useEffect(() => {
    if (!socket || !chat) return;
    const other = chat.participants?.find((p: any) => p._id !== chat.createdBy);
    if (!other) return;

    const onUserOnline = (p: any) => {
      if (p.userId === other._id) {
        setIsOnline(true);
      }
    };
    const onUserOffline = (p: any) => {
      if (p.userId === other._id) {
        setIsOnline(false);
        setLastSeen(p.lastSeen || new Date().toISOString());
      }
    };

    socket.on("userOnline", onUserOnline);
    socket.on("userOffline", onUserOffline);

    return () => {
      socket.off("userOnline", onUserOnline);
      socket.off("userOffline", onUserOffline);
    };
  }, [socket, chat]);

  if (!chat) return null;
  const otherUser = chat.participants?.find((p: any) => p._id !== chat.createdBy);

  return (
    <div className="p-4 bg-gray-900 border-b border-gray-800 flex items-center gap-3">
      <img src={otherUser?.profileImage || "/avatar.png"} className="w-10 h-10 rounded-full" />
      <div>
        <div className="font-semibold">{chat.isGroup ? chat.groupName : otherUser?.name}</div>
        <div className="text-xs text-gray-400">{isOnline ? "Online" : `Last seen ${lastSeen ? new Date(lastSeen).toLocaleString() : "unknown"}`}</div>
      </div>
    </div>
  );
}
