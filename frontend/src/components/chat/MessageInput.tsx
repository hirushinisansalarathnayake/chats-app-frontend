// src/components/chat/MessageInput.tsx
"use client";

import { useState, useRef } from "react";
import { useSocket } from "@/hooks/useSocket";
import api from "@/lib/axios";
import { useAuthStore } from "@/store/authStore";
import { useEncryption } from "@/hooks/useEncryption";

export default function MessageInput({ chatId }: { chatId: string }) {
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const socket = useSocket();
  const user = useAuthStore((s: any) => s.user);
  const { generateEphemeral, encryptMessagePlaintext } = useEncryption();
  const typingTimeoutRef = useRef<any>(null);

  function emitTyping() {
    if (!socket) return;
    socket.emit("typing", { chatId, userId: user?._id });
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stopTyping", { chatId, userId: user?._id });
    }, 1200);
  }

  async function sendText() {
    if (!text.trim()) return;
  
    const ephemeral = generateEphemeral();
    const payload = {
      chatId,
      senderId: user?._id,
      ciphertext: btoa(text), 
      nonce: btoa("nonce"),
      senderEphemeralPub: ephemeral.publicKey,
      senderDeviceId: "browser",
    };

    socket?.emit("sendEncryptedMessage", payload);

    setText("");
  }

  async function sendMedia() {
    if (!file) return;
    const form = new FormData();
    form.append("file", file);
    form.append("chatId", chatId);
    form.append("senderId", user?._id);

    await api.post("/messages/upload", form, { headers: { "Content-Type": "multipart/form-data" } });

    setFile(null);
  }

  return (
    <div className="p-4 bg-gray-900 border-t border-gray-800 flex gap-2 items-center">
      <input type="file" onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)} />

      <input
        className="flex-1 p-3 bg-gray-800 text-white rounded-lg"
        placeholder="Type a message..."
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          emitTyping();
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendText();
          }
        }}
      />

      {file ? (
        <button onClick={sendMedia} className="px-4 bg-green-600 rounded text-white">Upload</button>
      ) : (
        <button onClick={sendText} className="px-4 bg-blue-600 rounded text-white">Send</button>
      )}
    </div>
  );
}
