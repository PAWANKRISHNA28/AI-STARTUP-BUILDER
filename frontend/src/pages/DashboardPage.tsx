import React from 'react';
import { useUIStore } from '../store/useUIStore';
import { useAuthStore } from '../store/useAuthStore';
import { 
  Rocket, Lightbulb, BarChart3, FileText, Target, FolderKanban, LogOut, Plus
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const user = useAuthStore(state => state.user);
  const token = useAuthStore(state => state.token);
  const logout = useAuthStore(state => state.logout);
  const setCurrentPage = useUIStore(state => state.setCurrentPage);
  const [projects, setProjects] = React.useState<any[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = React.useState(true);

  React.useEffect(() => {
    if (token && user) {
      import('../services/api').then(({ api }) => {
        api.listProjects(1, 5)
          .then(data => {
            setProjects(data.items || []);
            setIsLoadingProjects(false);
          })
          .catch(err => {
            console.error('Failed to load projects', err);
            setIsLoadingProjects(false);
          });
      });
    }
  }, [token, user]);

  // If we have a token but no user yet, we are hydrating/loading
  const isLoading = token && !user;

  const handleLogout = async () => {
    try {
      const { api } = await import('../services/api');
      await api.logout();
    } catch (e) {
      console.error("Logout failed", e);
    }
    logout();
    setCurrentPage('login');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] w-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] w-full space-y-6">
        <p className="text-red-500 font-bold text-xl">Your session has expired. Please log in again.</p>
        <button 
          onClick={() => setCurrentPage('login')} 
          className="bg-primary hover:bg-primary-hover text-white px-8 py-3 rounded-xl font-bold transition-colors"
        >
          Go to Login
        </button>
      </div>
    );
  }

  const actionCards = [
    { icon: Rocket, label: 'Create Startup', color: 'text-blue-500', bg: 'bg-blue-100', shadow: 'shadow-blue-500/10', action: 'create-project' },
    { icon: Lightbulb, label: 'AI Idea Generator', color: 'text-amber-500', bg: 'bg-amber-100', shadow: 'shadow-amber-500/10', action: 'chat' },
    { icon: BarChart3, label: 'Market Analysis', color: 'text-green-500', bg: 'bg-green-100', shadow: 'shadow-green-500/10', action: 'analytics' },
    { icon: FileText, label: 'Business Plan', color: 'text-stone-500', bg: 'bg-stone-100', shadow: 'shadow-stone-500/10', action: 'documents' },
    { icon: Target, label: 'Idea Validation', color: 'text-purple-500', bg: 'bg-purple-100', shadow: 'shadow-purple-500/10', action: 'reports' },
    { icon: FolderKanban, label: 'My Startups', color: 'text-orange-500', bg: 'bg-orange-100', shadow: 'shadow-orange-500/10', action: 'projects' },
  ];

  return (
    <div className="space-y-8 pb-24 relative max-w-[1200px] mx-auto w-full">
      {/* Background abstract shapes */}
      <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] -z-10 pointer-events-none translate-x-1/3 -translate-y-1/4" />
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-green-100/30 rounded-full blur-[100px] -z-10 pointer-events-none -translate-x-1/4 translate-y-1/4" />
      
      {/* ------------------------------------------------
          WELCOME SECTION
      ------------------------------------------------ */}
      <div className="pt-2">
        <h1 className="text-4xl font-black text-heading flex items-center gap-3">
          Welcome back, {user.full_name} <span className="text-4xl">👋</span>
        </h1>
        <p className="text-lg font-semibold text-muted-foreground mt-3">
          Ready to build your next startup?
        </p>
      </div>

      {/* ------------------------------------------------
          QUICK ACTIONS
      ------------------------------------------------ */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-heading">Quick Actions & AI Tools</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {actionCards.map((card, i) => (
            <div 
              key={i} 
              className={`card-premium p-4 flex flex-col items-center justify-center h-32 cursor-pointer hover:-translate-y-1 transition-transform group ${card.shadow}`}
              onClick={() => setCurrentPage(card.action as any)}
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110 ${card.bg} ${card.color}`}>
                <card.icon className="w-6 h-6" />
              </div>
              <span className="font-bold text-heading text-sm text-center">{card.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* ------------------------------------------------
              STARTUP OVERVIEW & PROGRESS
          ------------------------------------------------ */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-heading">Startup Progress / Status</h2>
            <div className="card-premium p-6">
              <div className="flex justify-between items-center mb-4">
                <span className="font-bold text-heading">Current Status: Idea Phase</span>
                <span className="text-sm font-semibold text-primary">0% Complete</span>
              </div>
              <div className="w-full bg-border rounded-full h-3 mb-4">
                <div className="bg-primary h-3 rounded-full" style={{ width: '5%' }}></div>
              </div>
              <p className="text-sm text-muted-foreground">You haven't started building yet. Use the tools above to validate and plan your startup.</p>
            </div>
          </div>

          {/* ------------------------------------------------
              RECENT PROJECTS
          ------------------------------------------------ */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-heading">Recent Projects</h2>
            <div className={`card-premium ${projects.length > 0 ? 'p-6' : 'p-12 flex flex-col items-center justify-center text-center min-h-[250px]'}`}>
              {isLoadingProjects ? (
                <div className="flex justify-center items-center h-40">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : projects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {projects.map((project: any) => (
                    <div 
                      key={project.id} 
                      className="border border-border rounded-xl p-4 hover:border-primary/50 cursor-pointer transition-colors"
                      onClick={() => {
                        // In a real app we'd set active project context here
                        setCurrentPage('project-view');
                      }}
                    >
                      <h3 className="font-bold text-lg mb-1">{project.title || "Untitled Startup"}</h3>
                      <p className="text-muted-foreground text-sm line-clamp-2 mb-3">{project.idea_description || "No description provided."}</p>
                      <div className="flex justify-between items-center text-xs font-semibold">
                        <span className="bg-primary/10 text-primary px-2 py-1 rounded-md">{project.status || "Idea Phase"}</span>
                        <span className="text-muted-foreground">{new Date(project.created_at || Date.now()).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                    <FolderKanban className="w-10 h-10 text-muted" />
                  </div>
                  <h3 className="text-xl font-bold text-heading mb-2">No startups yet</h3>
                  <p className="text-muted-foreground mb-8">Create your first startup project to get started.</p>
                  <button 
                    onClick={() => setCurrentPage('create-project')}
                    className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-hover transition-colors shadow-soft-hover"
                  >
                    <Plus className="w-5 h-5" />
                    Create New Startup
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* ------------------------------------------------
            ACCOUNT OVERVIEW
        ------------------------------------------------ */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-heading">Account Overview</h2>
          <div className="card-premium p-6 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-2xl">
                {user.full_name?.charAt(0) || 'U'}
              </div>
              <div>
                <h3 className="font-bold text-heading text-lg">{user.full_name}</h3>
                <p className="text-muted-foreground text-sm">{user.email}</p>
              </div>
            </div>

            <div className="space-y-4 py-4 border-t border-b border-border">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground font-medium text-sm">Role</span>
                <span className="text-xs uppercase tracking-wider font-bold bg-primary/10 text-primary px-3 py-1 rounded-full">
                  {user.role}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground font-medium text-sm">Subscription</span>
                <span className="text-xs uppercase tracking-wider font-bold bg-green-100 text-green-700 px-3 py-1 rounded-full">
                  {user.subscription_status}
                </span>
              </div>
            </div>

            <button 
              onClick={handleLogout} 
              className="w-full flex items-center justify-center gap-2 text-red-600 font-bold hover:bg-red-50 p-3 rounded-xl transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
