import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Notification, Comment } from '../types';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface UIState {
  currentPage: string;
  toasts: Toast[];
  notifications: Notification[];
  comments: Comment[];
  darkMode: boolean;
  isMobileSidebarOpen: boolean;
  
  setCurrentPage: (page: string) => void;
  addToast: (type: 'success' | 'error' | 'info', message: string) => void;
  removeToast: (id: string) => void;
  setNotifications: (notifications: Notification[]) => void;
  setComments: (comments: Comment[]) => void;
  toggleDarkMode: () => void;
  setTheme: (theme: string) => void;
  setMobileSidebarOpen: (isOpen: boolean) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      currentPage: 'landing',
      toasts: [],
      notifications: [],
      comments: [],
      darkMode: false,
      isMobileSidebarOpen: false,
      
      setCurrentPage: (page) => set({ currentPage: page }),
      addToast: (type, message) => {
        const id = Math.random().toString(36).substr(2, 9);
        set((state) => ({
          toasts: [...state.toasts, { id, type, message }],
        }));
      },
      removeToast: (id) =>
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        })),
      setNotifications: (notifications) => set({ notifications }),
      setComments: (comments) => set({ comments }),
      toggleDarkMode: () =>
        set((state) => {
          const newDarkMode = !state.darkMode;
          if (newDarkMode) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
          return { darkMode: newDarkMode };
        }),
      setTheme: (theme) =>
        set(() => {
          const isDark = theme === 'dark';
          if (isDark) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
          return { darkMode: isDark };
        }),
      setMobileSidebarOpen: (isOpen) => set({ isMobileSidebarOpen: isOpen }),
    }),
    {
      name: 'ui-storage',
      partialize: (state) => ({ darkMode: state.darkMode }),
    }
  )
);
