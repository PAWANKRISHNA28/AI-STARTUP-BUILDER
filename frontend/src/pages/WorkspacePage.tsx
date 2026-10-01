import React, { useState } from 'react';
import { useUIStore } from '../store/useUIStore';
import { useProjectStore } from '../store/useProjectStore';
import { api } from '../services/api';
import { Project } from '../types';
import { Users, UserPlus, FolderOpen, ArrowUpRight, Kanban, Calendar as CalendarIcon, LayoutDashboard } from 'lucide-react';
import { KanbanBoard } from '../components/KanbanBoard';
import { StartupCalendar } from '../components/StartupCalendar';
import { m, AnimatePresence } from 'framer-motion';

export const WorkspacePage: React.FC = () => {
  const projects = useProjectStore(state => state.projects);
  const addToast = useUIStore(state => state.addToast);
  const setCurrentPage = useUIStore(state => state.setCurrentPage);
  const setActiveProject = useProjectStore(state => state.setActiveProject);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'viewer' | 'editor' | 'admin'>('viewer');
  const [activeTab, setActiveTab] = useState<'directory' | 'kanban' | 'calendar'>('directory');
  
  const sharedProjects = projects.filter(p => p.shares && p.shares.length > 0 && !p.deleted_at);

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    addToast('success', `Invitation successfully sent to ${inviteEmail} as ${inviteRole}!`);
    setInviteEmail('');
  };

  const handleOpenProject = (proj: Project) => {
    setActiveProject(proj);
    setCurrentPage('project-view');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] w-full">
      {/* Workspace Header */}
      <div className="px-6 py-4 border-b border-border/50 bg-background/50 backdrop-blur-sm flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Team Workspace</h1>
          <p className="text-sm text-muted-foreground">Collaborate with your team across all active projects.</p>
        </div>
        
        {/* Tabs */}
        <div className="flex items-center gap-2 p-1 bg-muted/30 rounded-full border border-border/50">
          <button 
            onClick={() => setActiveTab('directory')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
              activeTab === 'directory' ? 'bg-foreground text-background shadow-apple' : 'text-muted-foreground hover:bg-muted'
            }`}
          >
            <Users className="w-4 h-4" /> Directory
          </button>
          <button 
            onClick={() => setActiveTab('kanban')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
              activeTab === 'kanban' ? 'bg-foreground text-background shadow-apple' : 'text-muted-foreground hover:bg-muted'
            }`}
          >
            <Kanban className="w-4 h-4" /> Global Kanban
          </button>
          <button 
            onClick={() => setActiveTab('calendar')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
              activeTab === 'calendar' ? 'bg-foreground text-background shadow-apple' : 'text-muted-foreground hover:bg-muted'
            }`}
          >
            <CalendarIcon className="w-4 h-4" /> Team Calendar
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          <m.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "0px" }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="h-full w-full"
          >
            {activeTab === 'kanban' && <KanbanBoard projectId="global" />}
            {activeTab === 'calendar' && <StartupCalendar projectId="global" />}
            
            {activeTab === 'directory' && (
              <div className="p-6 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-y-auto h-full">
                {/* Left: Invite Form & Team Directory */}
                <div className="lg:col-span-1 space-y-6">
                  <div className="glass-panel p-6 rounded-3xl border border-border/50 shadow-soft space-y-4">
                    <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider flex items-center gap-1.5">
                      <UserPlus className="w-4 h-4 text-blue-500" /> Invite Collaborator
                    </span>
                    
                    <form onSubmit={handleInvite} className="space-y-3">
                      <input
                        type="email"
                        placeholder="Enter collaborator email..."
                        value={inviteEmail}
                        onChange={e => setInviteEmail(e.target.value)}
                        required
                        className="w-full px-4 py-3 rounded-2xl border border-border/50 bg-background/50 text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm"
                      />
                      <select
                        value={inviteRole}
                        onChange={e => setInviteRole(e.target.value as any)}
                        className="w-full px-4 py-3 rounded-2xl border border-border/50 bg-background/50 text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm appearance-none cursor-pointer"
                      >
                        <option value="viewer">Viewer (Read-only)</option>
                        <option value="editor">Editor (Write access)</option>
                        <option value="admin">Admin (Full access)</option>
                      </select>
                      <button
                        type="submit"
                        className="w-full py-3 rounded-2xl bg-foreground text-background text-sm font-bold shadow-apple hover:scale-[1.02] transition-transform"
                      >
                        Send Invite Link
                      </button>
                    </form>
                  </div>

                  <div className="glass-panel p-6 rounded-3xl border border-border/50 shadow-soft space-y-4">
                    <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider block">Workspace Directory</span>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center justify-between p-3 rounded-2xl bg-muted/30 border border-border/50">
                        <div>
                          <span className="font-bold text-foreground block">Founder (You)</span>
                          <span className="text-[10px] text-muted-foreground">owner@startup.io</span>
                        </div>
                        <span className="text-[9px] bg-blue-500/10 text-blue-600 px-2 py-1 rounded-full font-bold uppercase">Admin</span>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-2xl bg-background border border-border/50">
                        <div>
                          <span className="font-semibold text-foreground block">Sarah Jenkins</span>
                          <span className="text-[10px] text-muted-foreground">sarah.j@venture.vc</span>
                        </div>
                        <span className="text-[9px] bg-muted text-muted-foreground px-2 py-1 rounded-full font-bold uppercase">Viewer</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Collaborative Projects Hub */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="glass-panel p-6 rounded-3xl border border-border/50 shadow-soft space-y-4 h-full">
                    <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider flex items-center gap-1.5">
                      <FolderOpen className="w-4 h-4 text-emerald-500" /> Shared Projects Hub
                    </span>
                    
                    {sharedProjects.length === 0 ? (
                      <div className="py-20 flex flex-col items-center justify-center text-center space-y-3">
                        <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center text-muted-foreground">
                          <LayoutDashboard className="w-5 h-5" />
                        </div>
                        <p className="text-sm text-muted-foreground max-w-sm">
                          No active shared projects. Share any project from the Dashboard to collaborate with your team here.
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {sharedProjects.map((proj) => (
                          <div
                            key={proj.id}
                            onClick={() => handleOpenProject(proj)}
                            className="p-5 rounded-2xl bg-background hover:bg-muted/50 border border-border/50 transition-all cursor-pointer flex flex-col justify-between gap-4 group shadow-sm hover:shadow-soft"
                          >
                            <div>
                              <h4 className="font-bold text-foreground text-sm flex items-center justify-between">
                                {proj.title}
                                <ArrowUpRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                              </h4>
                              <p className="text-xs text-muted-foreground mt-1 leading-relaxed line-clamp-2">{proj.idea_description}</p>
                            </div>
                            <div className="flex items-center gap-2 mt-auto">
                              <span className="px-2 py-1 rounded-full bg-muted text-muted-foreground text-[9px] font-bold uppercase tracking-wider">
                                {proj.shares.length} Collaborators
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </m.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

