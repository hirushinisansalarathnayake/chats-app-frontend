"use client";

import { create } from "zustand";
import api from "@/lib/axios";

interface Message {
  _id: string;
  chatId: string;
  senderId: string;
  ciphertext?: string;
  mediaUrl?: string;
  mediaType?: string;
  editedAt?: string;
  deliveredAt?: string;
  seenAt?: string;
  isDeletedForEveryone?: boolean;
  deletedFor?: string[];
}

interface Store {
  messages: Record<string, Message[]>;   

  load: (chatId: string) => Promise<void>;
  add: (msg: Message) => void;
  edit: (msg: Message) => void;
  remove: (msg: { messageId: string; chatId: string }) => void;
}

export const useMessageStore = create<Store>((set, get) => ({
  messages: {},

 
  load: async (chatId: string) => {
    const res = await api.get(`/messages?chatId=${chatId}`);

    set((state) => ({
      messages: {
        ...state.messages,
        [chatId]: res.data,
      },
    }));
  },

  
  add: (msg) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [msg.chatId]: [...(state.messages[msg.chatId] || []), msg],
      },
    })),

  
  edit: (msg) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [msg.chatId]: state.messages[msg.chatId].map((m) =>
          m._id === msg._id ? msg : m
        ),
      },
    })),


  remove: ({ messageId, chatId }) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [chatId]: state.messages[chatId].filter((m) => m._id !== messageId),
      },
    })),
}));
