import React from 'react';
import { m } from 'framer-motion';
import { useUIStore } from '../store/useUIStore';
import { useAuthStore } from '../store/useAuthStore';
import { 
  FolderKanban, MessageSquare, BarChart3, FileText, LayoutDashboard,
  Target, Settings, ChevronRight, Crown, ChevronDown
} from 'lucide-react';
// removed LogoIcon

export const Sidebar: React.FC = React.memo(() => {
  const user = useAuthStore(state => state.user);
  const currentPage = useUIStore(state => state.currentPage);
  const setCurrentPage = useUIStore(state => state.setCurrentPage);
  const isMobileSidebarOpen = useUIStore(state => state.isMobileSidebarOpen);
  const setMobileSidebarOpen = useUIStore(state => state.setMobileSidebarOpen);

  const handleNavigate = (id: string) => {
    setCurrentPage(id);
    if (window.innerWidth < 768) {
      setMobileSidebarOpen(false);
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'projects', label: 'Projects', icon: FolderKanban },
    { id: 'chat', label: 'AI Chat', icon: MessageSquare },
    { id: 'market-research', label: 'Market Research', icon: Target },
    { id: 'business-plans', label: 'Business Plan', icon: FileText },
    { id: 'financials', label: 'Financials', icon: BarChart3 },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'visualizations', label: 'Visualizations', icon: Target },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'integrations', label: 'Integrations', icon: LayoutDashboard },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className={`w-[260px] bg-card border border-border/60 shadow-md flex flex-col h-[calc(100vh-2rem)] mt-4 ml-4 mb-4 rounded-3xl overflow-hidden ${
      isMobileSidebarOpen 
        ? "fixed inset-y-0 left-0 z-50 md:relative md:z-0" 
        : "hidden md:flex"
    }`}>
      {/* Brand Header */}
      <div className="p-6 pb-2">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleNavigate('dashboard')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-green-400 to-emerald-500 p-2 shadow-sm flex items-center justify-center">
            {/* Simple Box icon SVG for logo */}
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
          </div>
          <div>
            <h1 className="text-[15px] font-black text-heading leading-tight tracking-tight uppercase">AI Startup<br/>Builder</h1>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto scrollbar-none px-4 py-4 space-y-1">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button 
              key={item.id}
              onClick={() => handleNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-[13px] font-semibold rounded-2xl transition-all duration-200 group ${
                isActive 
                  ? 'text-[#4A7BE5] bg-[#4A7BE5]/10' // Matching the green/blue active state from the image. Image looks like a pale green. Wait, the image shows "Dashboard" active with a pale green background and dark text.
                  : 'text-muted-foreground hover:text-foreground hover:bg-black/5'
              }`}
              style={isActive ? { backgroundColor: '#E8F5E9', color: '#1B5E20' } : {}}
            >
              <Icon className={`w-[18px] h-[18px] ${isActive ? 'text-[#2E7D32]' : 'text-muted-foreground'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Footer Area: Upgrade & Profile */}
      <div className="p-4 pt-0 space-y-4">
        {/* Upgrade Card */}
        <div className="bg-[#FFF6E5] rounded-2xl p-4 border border-[#FFE0B2] cursor-pointer hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-bold text-[13px] text-orange-900 flex items-center gap-2">
              <Crown className="w-4 h-4 text-orange-500 fill-orange-500" /> Upgrade to Pro
            </h4>
            <ChevronRight className="w-4 h-4 text-orange-400 group-hover:translate-x-1 transition-transform" />
          </div>
          <p className="text-[11px] font-medium text-orange-700/80">Unlock all premium features</p>
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-3 p-2 rounded-2xl hover:bg-black/5 cursor-pointer transition-colors">
          <img 
            src={`https://api.dicebear.com/7.x/notionists/svg?seed=${user?.full_name || 'Krishna'}&backgroundColor=f0efeb`} 
            alt="Profile" 
            loading="lazy"
            className="w-10 h-10 rounded-full bg-white shadow-sm"
          />
          <div className="flex-1">
            <p className="text-[13px] font-bold text-heading leading-tight">{user?.full_name?.split(' ')[0] || 'Krishna'}</p>
            <p className="text-[11px] font-semibold text-muted-foreground">Pro Plan</p>
          </div>
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </div>
      </div>
    </aside>
  );
});
