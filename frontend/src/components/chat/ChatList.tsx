"use client";

import { useChatStore } from "@/store/chatStore";
import { useRouter } from "next/navigation";

export default function ChatList() {
  const router = useRouter();
  const chats = useChatStore((s: any) => s.chats);
  const setSelectedChat = useChatStore((s: any) => s.setSelectedChat);

  function openChat(chat: any) {
    setSelectedChat(chat);
    router.push(`/chats/${chat._id}`);
  }

  return (
    <div className="p-4 space-y-3 overflow-y-auto h-full">
      <h2 className="text-xl font-bold mb-4 text-white">Chats</h2>

      {chats.length === 0 && (
        <p className="text-gray-500 text-center">No chats yet</p>
      )}

      {chats.map((chat: any) => {
        const otherUser = chat.participants?.find(
          (u: any) => u._id !== chat.createdBy
        );

        return (
          <div
            key={chat._id}
            onClick={() => openChat(chat)}
            className="flex items-center gap-3 p-3 rounded-lg bg-gray-900 hover:bg-gray-800 cursor-pointer"
          >
            <img
              src={otherUser?.profileImage || "/avatar.png"}
              className="w-12 h-12 rounded-full object-cover"
            />

            <div className="flex-1">
              <p className="font-semibold">{otherUser?.name || "Unknown"}</p>
              <p className="text-sm text-gray-400 truncate">
                {chat.lastMessage || "Say hi 👋"}
              </p>
            </div>

            {otherUser?.isOnline && (
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            )}
          </div>
        );
      })}
    </div>
  );
}
