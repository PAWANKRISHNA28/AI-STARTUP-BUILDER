import { create } from 'zustand';

interface ChatState {
  chatMessages: any[];
  isAIThinking: boolean;
  
  addChatMessage: (msg: any) => void;
  setAIThinking: (isThinking: boolean) => void;
  clearChat: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  chatMessages: [],
  isAIThinking: false,
  
  addChatMessage: (msg) => set((state) => ({ chatMessages: [...state.chatMessages, msg] })),
  setAIThinking: (isThinking) => set({ isAIThinking: isThinking }),
  clearChat: () => set({ chatMessages: [] }),
}));
