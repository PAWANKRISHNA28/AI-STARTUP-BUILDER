import os
import re

STORE_DIR = r"c:\Users\mpawa\OneDrive\Desktop\AI STARTUP BUILDER\frontend\src\store"
FRONTEND_SRC = r"c:\Users\mpawa\OneDrive\Desktop\AI STARTUP BUILDER\frontend\src"

# 1. GENERATE STORES
os.makedirs(STORE_DIR, exist_ok=True)

auth_store = """import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
  updateUserPreferences: (prefs: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      logout: () => set({ user: null, token: null }),
      updateUserPreferences: (prefs) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...prefs } : null,
        })),
    }),
    { name: 'auth-storage' }
  )
);
"""

project_store = """import { create } from 'zustand';
import { Project, Blueprint, ProjectVersion } from '../types';

interface ProjectState {
  projects: Project[];
  totalProjects: number;
  projectsPage: number;
  projectsLimit: number;
  hasMoreProjects: boolean;
  activeProject: Project | null;
  activeBlueprint: Blueprint | null;
  versions: ProjectVersion[];
  
  setProjects: (projects: Project[]) => void;
  addProjects: (projects: Project[]) => void;
  updateProjectInStore: (project: Project) => void;
  setPagination: (pagination: { total: number; page: number; limit: number; has_more: boolean }) => void;
  setActiveProject: (project: Project | null) => void;
  setActiveBlueprint: (blueprint: Blueprint | null) => void;
  setVersions: (versions: ProjectVersion[]) => void;
}

export const useProjectStore = create<ProjectState>((set) => ({
  projects: [],
  totalProjects: 0,
  projectsPage: 1,
  projectsLimit: 10,
  hasMoreProjects: false,
  activeProject: null,
  activeBlueprint: null,
  versions: [],
  
  setProjects: (projects) => set({ projects }),
  addProjects: (newProjects) => set((state) => ({ projects: [...state.projects, ...newProjects] })),
  updateProjectInStore: (updatedProject) =>
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === updatedProject.id ? updatedProject : p
      ),
      activeProject:
        state.activeProject?.id === updatedProject.id
          ? updatedProject
          : state.activeProject,
    })),
  setPagination: (pag) =>
    set({
      totalProjects: pag.total,
      projectsPage: pag.page,
      projectsLimit: pag.limit,
      hasMoreProjects: pag.has_more,
    }),
  setActiveProject: (project) => set({ activeProject: project }),
  setActiveBlueprint: (blueprint) => set({ activeBlueprint: blueprint }),
  setVersions: (versions) => set({ versions }),
}));
"""

ui_store = """import { create } from 'zustand';
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
"""

chat_store = """import { create } from 'zustand';

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
  setAIThinking: (isThinking) => set({ isAIThinking }),
  clearChat: () => set({ chatMessages: [] }),
}));
"""

onboarding_store = """import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface OnboardingState {
  onboardingStep: number;
  setOnboardingStep: (step: number) => void;
  completeOnboarding: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      onboardingStep: 1,
      setOnboardingStep: (step) => set({ onboardingStep: step }),
      completeOnboarding: () => set({ onboardingStep: -1 }),
    }),
    { name: 'onboarding-storage' }
  )
);
"""

with open(os.path.join(STORE_DIR, 'useAuthStore.ts'), 'w') as f: f.write(auth_store)
with open(os.path.join(STORE_DIR, 'useProjectStore.ts'), 'w') as f: f.write(project_store)
with open(os.path.join(STORE_DIR, 'useUIStore.ts'), 'w') as f: f.write(ui_store)
with open(os.path.join(STORE_DIR, 'useChatStore.ts'), 'w') as f: f.write(chat_store)
with open(os.path.join(STORE_DIR, 'useOnboardingStore.ts'), 'w') as f: f.write(onboarding_store)

# Map states to store names
STORE_MAP = {
    'useAuthStore': ['user', 'token', 'setUser', 'setToken', 'logout', 'updateUserPreferences'],
    'useProjectStore': ['projects', 'totalProjects', 'projectsPage', 'projectsLimit', 'hasMoreProjects', 'activeProject', 'activeBlueprint', 'versions', 'setProjects', 'addProjects', 'updateProjectInStore', 'setPagination', 'setActiveProject', 'setActiveBlueprint', 'setVersions'],
    'useUIStore': ['currentPage', 'toasts', 'notifications', 'comments', 'darkMode', 'isMobileSidebarOpen', 'setCurrentPage', 'addToast', 'removeToast', 'setNotifications', 'setComments', 'toggleDarkMode', 'setTheme', 'setMobileSidebarOpen'],
    'useChatStore': ['chatMessages', 'isAIThinking', 'addChatMessage', 'setAIThinking', 'clearChat'],
    'useOnboardingStore': ['onboardingStep', 'setOnboardingStep', 'completeOnboarding']
}

REVERSE_MAP = {}
for store, states in STORE_MAP.items():
    for state in states:
        REVERSE_MAP[state] = store

# 2. MIGRATION SCRIPT
def migrate_file(filepath):
    if not filepath.endswith(('.tsx', '.ts')) or 'useStore.ts' in filepath or filepath.endswith('store.ts'):
        return
        
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    if 'useStore' not in content:
        return

    # Find all useStore calls: e.g. const user = useStore(state => state.user);
    # Or const { user } = useStore();
    
    needed_stores = set()
    
    # Replace useStore(state => state.XXX) with correct store
    def replace_selector(match):
        state_var = match.group(1).strip()
        store_name = REVERSE_MAP.get(state_var)
        if store_name:
            needed_stores.add(store_name)
            return match.group(0).replace('useStore', store_name)
        return match.group(0) # fallback

    new_content = re.sub(r'useStore\(\s*\w+\s*=>\s*\w+\.(\w+)\s*\)', replace_selector, content)
    
    # Also support multiline or nested but regex is hard. Let's try to catch simple ones.
    
    if needed_stores:
        # replace import
        # import { useStore } from '../store/useStore'
        
        # Determine relative path correctly by finding the existing import
        import_match = re.search(r"import\s+\{\s*useStore\s*\}\s+from\s+['\"](.*?)['\"];?", new_content)
        if import_match:
            old_import_path = import_match.group(1) # e.g. '../store/useStore'
            base_dir = old_import_path.replace('/useStore', '').replace('useStore', '')
            if base_dir.endswith('/'):
                base_dir = base_dir[:-1]
            if not base_dir:
                base_dir = './store'
                
            new_imports = []
            for store in needed_stores:
                new_imports.append(f"import {{ {store} }} from '{base_dir}/{store}';")
            
            new_content = new_content.replace(import_match.group(0), '\n'.join(new_imports))
    
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Migrated: {filepath}")

for root, _, files in os.walk(FRONTEND_SRC):
    for file in files:
        migrate_file(os.path.join(root, file))
        
print("Zustand migration complete.")
