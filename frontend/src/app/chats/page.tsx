"use client";

import { useEffect, useState, useCallback } from "react";
import api from "@/lib/axios";
import { useAuthStore } from "@/store/authStore";
import { initSocket, getSocket } from "@/lib/socket";

export default function ChatsPage() {
  const [users, setUsers] = useState([]);
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [messageText, setMessageText] = useState("");

  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedMsgs, setSelectedMsgs] = useState<string[]>([]);

  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const user = useAuthStore((s: any) => s.user);
  const loadUser = useAuthStore((s: any) => s.loadUser);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return (window.location.href = "/login");

    if (!user) loadUser();
    initSocket();
    loadUsers();
  }, []);

  async function loadUsers() {
    const res = await api.get("/users");
    setUsers(res.data);
  }

  
  async function loadMessages(chatId: string) {
    const res = await api.get(`/messages?chatId=${chatId}`);
    setMessages(res.data);
  }

  
  async function openChat(otherUser: any) {
    const res = await api.post("/chats/create", {
      receiverId: otherUser._id,
    });

    const chat = res.data;

    setSelectedChat({
      ...otherUser,
      chatId: chat._id,
    });

    await loadMessages(chat._id);

    getSocket()?.emit("joinChat", chat._id);

    setSelectionMode(false);
    setSelectedMsgs([]);
  }


  const handleNewEncrypted = useCallback(
    (msg: any) => {
      if (msg.chatId === selectedChat?.chatId) {
        setMessages((prev) => [...prev, msg]);
      }
    },
    [selectedChat?.chatId]
  );

  
  const handleMessageDeleted = useCallback((data: any) => {
    setMessages((prev) =>
      prev.map((m) => {
        if (m._id !== data.messageId) return m;

        if (data.deleteForEveryone)
          return {
            ...m,
            ciphertext: null,
            isDeletedForEveryone: true,
            deletedFor: [],
          };

        return {
          ...m,
          deletedFor: [...(m.deletedFor || []), data.userId],
        };
      })
    );
  }, []);

 
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    socket.off("newEncryptedMessage");
    socket.off("messageDeleted");

    socket.on("newEncryptedMessage", handleNewEncrypted);
    socket.on("messageDeleted", handleMessageDeleted);

    return () => {
      socket.off("newEncryptedMessage");
      socket.off("messageDeleted");
    };
  }, [handleNewEncrypted, handleMessageDeleted]);

  
  function sendMessage() {
    if (!messageText.trim()) return;

    const socket = getSocket();

    socket?.emit("sendEncryptedMessage", {
      senderId: user._id,
      chatId: selectedChat.chatId,
      ciphertext: messageText,
    });

 
    setMessages((prev) => [
      ...prev,
      {
        _id: `local-${Date.now()}`,
        ciphertext: messageText,
        senderId: user._id,
        chatId: selectedChat.chatId,
        createdAt: Date.now(),
      },
    ]);

    setMessageText("");
  }

  
  function toggleSelection(msgId: string) {
    if (!selectionMode) {
      setSelectionMode(true);
      setSelectedMsgs([msgId]);
      return;
    }

    if (selectedMsgs.includes(msgId)) {
      const newArr = selectedMsgs.filter((id) => id !== msgId);
      if (newArr.length === 0) {
        setSelectionMode(false);
      }
      setSelectedMsgs(newArr);
    } else {
      setSelectedMsgs([...selectedMsgs, msgId]);
    }
  }

  
  function deleteForMe() {
    selectedMsgs.forEach((msgId) => {
      getSocket()?.emit("deleteMessage", {
        messageId: msgId,
        chatId: selectedChat.chatId,
        deleteForEveryone: false,
      });
    });

    
    setMessages((prev) =>
      prev.filter((m) => !selectedMsgs.includes(m._id))
    );

    setSelectionMode(false);
    setSelectedMsgs([]);
  }

  function deleteForEveryone() {
    selectedMsgs.forEach((msgId) => {
      getSocket()?.emit("deleteMessage", {
        messageId: msgId,
        chatId: selectedChat.chatId,
        deleteForEveryone: true,
      });
    });

    
    setMessages((prev) =>
      prev.map((m) =>
        selectedMsgs.includes(m._id)
          ? { ...m, ciphertext: null, isDeletedForEveryone: true }
          : m
      )
    );

    setSelectionMode(false);
    setSelectedMsgs([]);
  }

  
  return (
    <div className="flex h-screen">
     
      <div className="w-1/3 bg-gray-900 p-4 text-white overflow-y-auto">
        <h2 className="text-xl mb-4">Chats</h2>

        {users.map((u: any) => (
          <div
            key={u._id}
            onClick={() => openChat(u)}
            className="p-3 bg-gray-800 mb-2 rounded cursor-pointer"
          >
            {u.name}
          </div>
        ))}
      </div>

     
      <div className="w-2/3 bg-gray-950 text-white flex flex-col">

       
        <div className="p-4 bg-gray-900 flex justify-between items-center">

          <div className="text-lg">
            {selectedChat ? `Chat with ${selectedChat.name}` : "Select chat"}
          </div>

          {selectionMode && (
            <div className="flex gap-4">
              <button
                className="text-red-400"
                onClick={deleteForEveryone}
              >
                Delete for Everyone
              </button>

              <button
                className="text-yellow-300"
                onClick={deleteForMe}
              >
                Delete for Me
              </button>
            </div>
          )}
        </div>

       
        <div className="flex-1 p-4 overflow-y-auto">
          {messages.map((msg) => {
            if (msg.deletedFor?.includes(user?._id)) return null;

            const isMine = msg.senderId === user?._id;
            const selected = selectedMsgs.includes(msg._id);

            return (
              <div
                key={msg._id}
                onClick={() => toggleSelection(msg._id)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  toggleSelection(msg._id);
                }}
                className={`relative mb-2 p-2 rounded-lg w-fit cursor-pointer
                  ${isMine ? "bg-blue-600 ml-auto" : "bg-gray-700"}
                  ${selected ? "ring-2 ring-green-400" : ""}
                `}
              >
                {msg.isDeletedForEveryone ? (
                  <span className="italic text-gray-400 text-sm">
                    Message deleted
                  </span>
                ) : (
                  msg.ciphertext
                )}
              </div>
            );
          })}
        </div>

       
        {selectedChat && (
          <div className="p-4 flex gap-2">
            <input
              className="flex-1 p-3 bg-gray-800 rounded"
              placeholder="Type message…"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
            />
            <button
              onClick={sendMessage}
              className="p-3 bg-blue-600 rounded"
            >
              Send
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
