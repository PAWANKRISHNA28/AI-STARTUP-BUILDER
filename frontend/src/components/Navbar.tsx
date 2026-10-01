import React from 'react';
import { m } from 'framer-motion';
import { useUIStore } from '../store/useUIStore';
import { useAuthStore } from '../store/useAuthStore';
import { Search, Menu, Bell, Sun, ChevronDown } from 'lucide-react';

interface NavbarProps {
  onSearchClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = React.memo(({ onSearchClick }) => {
  const user = useAuthStore(state => state.user);
  const currentPage = useUIStore(state => state.currentPage);
  const setMobileSidebarOpen = useUIStore(state => state.setMobileSidebarOpen);
  const isMobileSidebarOpen = useUIStore(state => state.isMobileSidebarOpen);

  const getPageTitle = () => {
    switch (currentPage) {
      case 'dashboard': return 'Dashboard';
      case 'projects': return 'Projects';
      case 'analytics': return 'Analytics';
      case 'reports': return 'Reports';
      case 'chat': return 'AI Chat';
      case 'settings': return 'Settings';
      default: return 'Dashboard';
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-20 md:ml-64 z-40 bg-transparent flex items-center justify-between px-6 md:px-10">
      
      {/* Left side: Logo or Mobile Menu */}
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <button 
              onClick={() => setMobileSidebarOpen(!isMobileSidebarOpen)}
              className="md:hidden p-2 -ml-2 text-muted-foreground hover:text-foreground transition rounded-full hover:bg-black/5"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold text-heading flex items-center gap-3">
              <Menu className="w-5 h-5 text-muted-foreground hidden md:block" />
              {getPageTitle()}
            </h2>
          </>
        ) : (
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="text-secondary">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-display font-bold text-heading text-lg tracking-tight">AI STARTUP</span>
              <span className="font-display font-bold text-secondary text-xs tracking-widest uppercase">Builder</span>
            </div>
          </div>
        )}
      </div>

      {/* Center: Navigation Links (Only on Landing Page / !user) */}
      {!user && (
        <div className="hidden lg:flex items-center gap-8 font-medium text-sm text-heading">
        </div>
      )}

      {/* Middle: Search Bar (Hidden on Mobile, shown on tablet+) */}
      {user && onSearchClick && (
        <div className="hidden md:flex flex-1 max-w-md mx-8 relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          </div>
          <input
            type="text"
            className="w-full bg-white/60 hover:bg-white/80 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all duration-300 border border-border/60 rounded-full py-2.5 pl-10 pr-12 text-sm text-foreground shadow-sm placeholder:text-muted-foreground outline-none"
            placeholder="Search anything..."
            onClick={onSearchClick}
            readOnly
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <kbd className="hidden sm:inline-flex items-center gap-1 bg-background-secondary border border-border px-1.5 py-0.5 rounded-md text-[10px] font-medium text-muted-foreground">
              <span className="text-xs">⌘</span>K
            </kbd>
          </div>
        </div>
      )}

      {/* Right side: Actions & Profile */}
      <div className="flex items-center gap-3 md:gap-5">
        {user ? (
          <>
            {/* Search Icon for Mobile */}
            <button 
              onClick={onSearchClick}
              className="md:hidden p-2.5 text-muted-foreground hover:text-foreground hover:bg-black/5 rounded-full transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Messages */}
            <button aria-label="Messages" className="p-2.5 text-muted-foreground hover:text-foreground hover:bg-black/5 rounded-full transition-colors relative">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
            </button>

            {/* Notifications */}
            <button aria-label="Notifications" className="p-2.5 text-muted-foreground hover:text-foreground hover:bg-black/5 rounded-full transition-colors relative">
              <Bell className="w-5 h-5" />
              <div className="absolute top-1.5 right-2 w-2 h-2 bg-orange-500 rounded-full border border-white flex items-center justify-center text-[8px] text-white font-bold pb-px">
                3
              </div>
            </button>

            {/* Profile Dropdown */}
            <div className="flex items-center gap-3 pl-2 md:pl-4 md:border-l border-border/50 cursor-pointer group">
              <img 
                src={`https://api.dicebear.com/7.x/notionists/svg?seed=${user.full_name}&backgroundColor=f0efeb`} 
                alt="Profile" 
                loading="lazy"
                className="w-9 h-9 rounded-full border-2 border-white shadow-sm"
              />
              <div className="hidden md:block">
                <p className="text-sm font-bold text-heading leading-tight">{user.full_name.split(' ')[0]}</p>
                <p className="text-[10px] font-semibold text-muted-foreground">Pro Plan</p>
              </div>
              <ChevronDown className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors hidden md:block" />
            </div>
          </>
        ) : (
          <>
            <div className="hidden sm:flex items-center bg-black/5 dark:bg-white/5 rounded-full p-0.5 mr-4">
              <button aria-label="Light mode" className="p-1.5 rounded-full bg-background-secondary text-primary shadow-sm"><Sun className="w-4 h-4" /></button>
              <button aria-label="Dark mode" className="p-1.5 rounded-full text-muted-foreground hover:text-foreground"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg></button>
            </div>
            <button className="btn-primary text-sm font-bold flex items-center gap-2">Sign In</button>
          </>
        )}
      </div>

    </header>
  );
});
