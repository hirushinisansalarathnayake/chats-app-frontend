import { create } from "zustand";

type ChatStore = {
  chats: any[];
  selectedChat: any;
  fetchChats: () => Promise<void>;
  setSelectedChat: (chat: any) => void;
};

export const useChatStore = create<ChatStore>((set) => ({
  chats: [],
  selectedChat: null,

  fetchChats: async () => {
  
  },

  setSelectedChat: (chat) => set({ selectedChat: chat }),
}));
