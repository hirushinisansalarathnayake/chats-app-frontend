"use client";

import { useEffect } from "react";
import { useMessageStore } from "@/store/messageStore";
import { useParams } from "next/navigation";
import { useSocketContext } from "@/context/SocketProvider";

export default function MessageList() {
  const params = useParams();
  const chatId = params.chatId as string;

  const { messages, load, add, edit, remove } = useMessageStore();
  const { socket } = useSocketContext();

  const list = messages[chatId] || [];

  
  useEffect(() => {
    load(chatId);
  }, [chatId]);

  
  useEffect(() => {
    if (!socket) return;

    
    const encryptedHandler = (msg: any) => add(msg);

    
    const mediaHandler = (msg: any) => add(msg);

   
    const editHandler = (msg: any) => edit(msg);

  
    const deleteHandler = (data: any) =>
      remove({ messageId: data.messageId, chatId });

    socket.on("encryptedMessage", encryptedHandler);
    socket.on("mediaMessage", mediaHandler);
    socket.on("messageEdited", editHandler);
    socket.on("messageDeleted", deleteHandler);

    return () => {
      socket.off("encryptedMessage", encryptedHandler);
      socket.off("mediaMessage", mediaHandler);
      socket.off("messageEdited", editHandler);
      socket.off("messageDeleted", deleteHandler);
    };
  }, [socket, chatId, add, edit, remove]);

  return (
    <div className="flex flex-col gap-2 p-4">
      {list.map((msg: any) => (
        <div
          key={msg._id}
          className="p-2 rounded bg-gray-800 text-white"
        >
          {msg.isDeletedForEveryone
            ? "Message deleted"
            : msg.content || msg.mediaUrl}
        </div>
      ))}
    </div>
  );
}
