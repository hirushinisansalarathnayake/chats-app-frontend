"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import ChatHeader from "@/components/chat/ChatHeader";
import MessageList from "@/components/chat/MessageList";
import MessageInput from "@/components/chat/MessageInput";
import { useChatStore } from "@/store/chatStore";
import api from "@/lib/axios";

export default function ChatPage() {
  const { chatId } = useParams();
  const setSelectedChat = useChatStore((s: any) => s.setSelectedChat);

  useEffect(() => {
    async function loadChat() {
      const res = await api.get("/chats");
      const chat = res.data.find((c: any) => c._id === chatId);
      setSelectedChat(chat);
    }
    loadChat();
  }, [chatId]);

  return (
    <div className="h-screen flex flex-col bg-gray-950 text-white">
      <ChatHeader />
      <MessageList chatId={chatId as string} />
      <MessageInput chatId={chatId as string} />
    </div>
  );
}
