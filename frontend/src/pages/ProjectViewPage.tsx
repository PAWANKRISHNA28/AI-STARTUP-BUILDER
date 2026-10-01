import React, { useState, useEffect, useRef } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import Tilt from 'react-parallax-tilt';
import { useUIStore } from '../store/useUIStore';
import { useProjectStore } from '../store/useProjectStore';
import { api } from '../services/api';
import { ProjectChat, AgentLog, ProjectVersion, Comment, ActivityLog, SharedProject } from '../types';
import { 
  FileText, Presentation, FileSpreadsheet, Download, Sparkles, 
  CheckCircle2, TrendingUp, Database, ShieldCheck, Layers, 
  DollarSign, Users, Layout, Calendar, ChevronLeft, ChevronRight,
  MessageSquare, Terminal, Send, Loader2, AlertCircle, History,
  UserPlus, Activity, Plus, RefreshCw, RotateCcw, Copy, FolderLock,
  Search, Bot, Settings, Eye, Menu
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';

export const ProjectViewPage: React.FC = () => {
  const activeProject = useProjectStore(state => state.activeProject);
  const activeBlueprint = useProjectStore(state => state.activeBlueprint);
  const setActiveBlueprint = useProjectStore(state => state.setActiveBlueprint);
  const setCurrentPage = useUIStore(state => state.setCurrentPage);
  const addToast = useUIStore(state => state.addToast);
  const updateProjectInStore = useProjectStore(state => state.updateProjectInStore);

  const [activeTab, setActiveTab] = useState('summary');
  const [isBlueprintLoading, setIsBlueprintLoading] = useState(true);
  const [chatMessages, setChatMessages] = useState<ProjectChat[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatSending, setIsChatSending] = useState(false);
  const [agentLogs, setAgentLogs] = useState<AgentLog[]>([]);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-Save States
  const [saveState, setSaveState] = useState<'saved' | 'saving' | 'last_saved'>('saved');
  const [lastSavedTime, setLastSavedTime] = useState<string>('');

  useEffect(() => {
    if (!activeProject) return;

    const loadWorkspaceData = async () => {
      setIsBlueprintLoading(true);
      try {
        if (activeProject.status === 'completed') {
          const bp = await api.getBlueprint(activeProject.id);
          setActiveBlueprint(bp);
        } else {
          setActiveBlueprint(null);
        }

        const [chats, acts] = await Promise.all([
          api.getProjectChat(activeProject.id),
          api.listProjectActivities(activeProject.id)
        ]);

        setChatMessages(chats);
        setActivities(acts);
      } catch (err) {
        console.error("Failed to load workspace data", err);
      } finally {
        setIsBlueprintLoading(false);
      }
    };
    loadWorkspaceData();
  }, [activeProject, setActiveBlueprint]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !activeProject || isChatSending) return;

    const messageText = chatInput;
    setChatInput('');
    setIsChatSending(true);

    const tempUserMsg: ProjectChat = {
      id: Math.random().toString(),
      project_id: activeProject.id,
      role: 'user',
      message: messageText,
      timestamp: new Date().toISOString()
    };
    setChatMessages(prev => [...prev, tempUserMsg]);

    try {
      await api.sendProjectChatMessage(activeProject.id, messageText);
      const updatedChats = await api.getProjectChat(activeProject.id);
      setChatMessages(updatedChats);
    } catch (err) {
      addToast('error', 'Failed to send message');
    } finally {
      setIsChatSending(false);
    }
  };

  if (!activeProject) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 text-center text-muted-foreground">
        Select a project from the Recent Projects list to view its workspace.
      </div>
    );
  }

  const bpData = activeBlueprint?.data;
  const title = bpData?.meta?.title || activeProject.title || "Project";
  const idea = bpData?.meta?.idea || activeProject.idea_description;

  const tabs = [
    { id: 'summary', label: 'Executive Summary', icon: Sparkles },
    { id: 'market', label: 'Market & Competitors', icon: TrendingUp },
    { id: 'business', label: 'Business Model', icon: Layers },
    { id: 'finance', label: 'Financials', icon: DollarSign },
    { id: 'architecture', label: 'Architecture', icon: Database },
    { id: 'wireframes', label: 'Wireframes', icon: Layout },
    { id: 'pitch', label: 'Pitch Deck', icon: Presentation },
  ];

  const tamData = [
    { name: 'TAM', value: bpData?.market_research?.tam ? parseInt(bpData.market_research.tam.replace(/[^0-9]/g, '')) || 500 : 500 },
    { name: 'SAM', value: bpData?.market_research?.sam ? parseInt(bpData.market_research.sam.replace(/[^0-9]/g, '')) || 150 : 150 },
    { name: 'SOM', value: bpData?.market_research?.som ? parseInt(bpData.market_research.som.replace(/[^0-9]/g, '')) || 25 : 25 },
  ];

  return (
    <div className="flex flex-1 h-[calc(100vh-4rem)] overflow-hidden bg-background">
      
      {/* LEFT PANE: History & Context */}
      <div className="hidden lg:flex w-64 flex-col border-r border-border/50 bg-background/50 backdrop-blur-sm">
        <div className="p-4 border-b border-border/50">
          <h2 className="font-bold text-sm text-foreground truncate">{title}</h2>
          <p className="text-xs text-muted-foreground truncate">{idea}</p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-3 space-y-6 scrollbar-none">
          {/* Agent Tools */}
          <div className="space-y-2">
            <span className="px-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Agent Tools</span>
            <div className="space-y-1">
              <button className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-all">
                <Bot className="w-4 h-4" /> AI Co-Founder
              </button>
              <button className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-all">
                <Search className="w-4 h-4" /> Deep Research
              </button>
              <button className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-all">
                <Settings className="w-4 h-4" /> Project Settings
              </button>
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="space-y-2">
            <span className="px-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Recent Activity</span>
            <div className="space-y-3 px-2 mt-2">
              {activities.slice(0, 5).map((act, i) => (
                <div key={i} className="flex gap-2">
                  <div className="relative flex flex-col items-center">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-1"></div>
                    {i !== activities.length - 1 && <div className="w-px h-full bg-border/50 mt-1"></div>}
                  </div>
                  <div className="flex-1 pb-2">
                    <p className="text-[10px] font-medium text-foreground">{act.description || act.activity_type}</p>
                    <p className="text-[9px] text-muted-foreground">{new Date(act.timestamp).toLocaleTimeString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CENTER PANE: Chat & Interaction */}
      <div className="flex-1 flex flex-col relative min-w-[300px] bg-background">
        <div className="h-14 border-b border-border/50 flex items-center justify-between px-4 glass-panel rounded-none">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <MessageSquare className="w-4 h-4 text-primary" />
            Workspace Chat
          </div>
          <div className="flex items-center gap-2 text-xs">
            {saveState === 'saving' && <Loader2 className="w-3 h-3 animate-spin text-muted-foreground" />}
            <span className="text-muted-foreground text-[10px]">
              {saveState === 'saving' ? 'Saving...' : 'All changes saved'}
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scrollbar-none">
          {chatMessages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 max-w-md mx-auto">
              <div className="w-16 h-16 bg-blue-500/10 rounded-3xl flex items-center justify-center text-blue-500">
                <Sparkles className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-foreground">How can I help you build {title}?</h3>
              <p className="text-sm text-muted-foreground">
                Ask me to refine your business model, generate new marketing copy, or analyze competitors.
              </p>
              <div className="grid grid-cols-2 gap-2 w-full mt-4">
                <button onClick={() => setChatInput("Analyze my competitors")} className="p-3 text-xs border border-border/50 rounded-xl hover:bg-muted text-left">
                  Analyze my competitors &rarr;
                </button>
                <button onClick={() => setChatInput("Write a landing page copy")} className="p-3 text-xs border border-border/50 rounded-xl hover:bg-muted text-left">
                  Write a landing page copy &rarr;
                </button>
              </div>
            </div>
          ) : (
            chatMessages.map((msg, idx) => (
              <m.div 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "0px" }}
                key={idx} 
                className={`flex gap-4 max-w-3xl mx-auto ${msg.role === 'user' ? 'justify-end' : ''}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex-shrink-0 flex items-center justify-center text-white shadow-soft">
                    <Sparkles className="w-4 h-4" />
                  </div>
                )}
                <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-foreground text-background rounded-tr-sm' 
                    : 'bg-muted/40 border border-border/50 rounded-tl-sm text-foreground'
                }`}>
                  {msg.message}
                </div>
              </m.div>
            ))
          )}
          {isChatSending && (
            <div className="flex gap-4 max-w-3xl mx-auto">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex-shrink-0 flex items-center justify-center text-white shadow-soft">
                <Sparkles className="w-4 h-4 animate-pulse" />
              </div>
              <div className="p-4 rounded-2xl bg-muted/40 border border-border/50 rounded-tl-sm text-foreground flex items-center gap-2">
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <div className="p-4 bg-background">
          <form onSubmit={handleSendMessage} className="max-w-3xl mx-auto relative group">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask anything about your startup..."
              className="w-full pl-5 pr-14 py-4 rounded-2xl border border-border/80 bg-muted/20 focus:bg-background focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all text-sm shadow-sm"
            />
            <button
              type="submit"
              disabled={isChatSending || !chatInput.trim()}
              className="absolute right-2 top-2 bottom-2 aspect-square rounded-xl bg-foreground text-background flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="text-center mt-2 text-[10px] text-muted-foreground">
            AI can make mistakes. Verify important business decisions.
          </div>
        </div>
      </div>

      {/* RIGHT PANE: Artifacts / Analytics */}
      <div className="hidden xl:flex w-[400px] flex-col border-l border-border/50 bg-muted/10">
        <div className="h-14 border-b border-border/50 flex items-center gap-2 px-4 bg-background/50 backdrop-blur-sm">
          <Layers className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-semibold text-foreground">Project Artifacts</span>
        </div>
        
        <div className="flex-1 overflow-y-auto scrollbar-none p-4 space-y-6">
          {/* Artifact Navigation */}
          <div className="flex flex-wrap gap-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                  activeTab === tab.id 
                    ? 'bg-foreground text-background' 
                    : 'bg-background border border-border/50 text-muted-foreground hover:bg-muted'
                }`}
              >
                <tab.icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <m.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "0px" }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* Summary View */}
              {activeTab === 'summary' && (
                <div className="space-y-4">
                  <Tilt tiltMaxAngleX={5} tiltMaxAngleY={5} scale={1.02} transitionSpeed={2500}>
                    <div className="card-premium p-5 rounded-2xl space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">Validation Score</span>
                        <span className="text-xs font-black text-emerald-600 bg-emerald-500/20 px-2 py-0.5 rounded-full shadow-inner">HIGH</span>
                      </div>
                      <div className="text-5xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                        {bpData?.idea_analyzer?.validation_score || 92}<span className="text-2xl text-muted-foreground font-bold">/100</span>
                      </div>
                    </div>
                  </Tilt>

                  <Tilt tiltMaxAngleX={3} tiltMaxAngleY={3} scale={1.01} transitionSpeed={2500}>
                    <div className="card-premium p-5 rounded-2xl space-y-2 border-l-4 border-l-primary relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 blur-[30px] rounded-full pointer-events-none" />
                      <span className="text-[10px] font-black text-primary tracking-widest uppercase">Core Problem</span>
                      <p className="text-xs font-semibold text-foreground/80 leading-relaxed relative z-10">
                        {bpData?.idea_analyzer?.problem_statement || "Target user segments experience high delivery transaction fees."}
                      </p>
                    </div>
                  </Tilt>
                  <Tilt tiltMaxAngleX={3} tiltMaxAngleY={3} scale={1.01} transitionSpeed={2500}>
                    <div className="card-premium p-5 rounded-2xl space-y-2 border-l-4 border-l-accent relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-accent/10 blur-[30px] rounded-full pointer-events-none" />
                      <span className="text-[10px] font-black text-accent tracking-widest uppercase">Solution Overview</span>
                      <p className="text-xs font-semibold text-foreground/80 leading-relaxed relative z-10">
                        {bpData?.idea_analyzer?.solution_overview || "An optimized solution with real-time UI splitter and cost automation API handlers."}
                      </p>
                    </div>
                  </Tilt>
                </div>
              )}

              {/* Market View */}
              {activeTab === 'market' && (
                <div className="space-y-4">
                  <Tilt tiltMaxAngleX={2} tiltMaxAngleY={2} scale={1.01} transitionSpeed={2500}>
                    <div className="card-premium p-5 rounded-2xl space-y-4">
                      <h3 className="text-sm font-black text-foreground">Market Sizing (TAM/SAM/SOM)</h3>
                      <div className="h-48 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={tamData}>
                            <XAxis dataKey="name" stroke="#94A3B8" fontSize={10} fontWeight="bold" tickLine={false} axisLine={false} />
                            <Tooltip cursor={{ fill: 'rgba(255,255,255,0.1)' }} contentStyle={{ borderRadius: '12px', border: 'none', background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(10px)', boxShadow: '0 8px 32px rgba(0,0,0,0.1)', fontWeight: 'bold' }} />
                            <Bar dataKey="value" fill="#5B8CFF" radius={[6, 6, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </Tilt>
                </div>
              )}

              {/* Placeholder for other tabs */}
              {['business', 'finance', 'architecture', 'wireframes', 'pitch'].includes(activeTab) && (
                <Tilt tiltMaxAngleX={2} tiltMaxAngleY={2} scale={1.01} transitionSpeed={2500}>
                  <div className="card-premium p-8 rounded-2xl text-center space-y-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary shadow-inner">
                      <Eye className="w-6 h-6" />
                    </div>
                    <h3 className="text-sm font-black text-foreground capitalize">{activeTab} Artifacts</h3>
                    <p className="text-xs font-medium text-muted-foreground">
                      This section contains generated artifacts for the {activeTab}. 
                      In a full implementation, this renders the specific content for {title}.
                    </p>
                    <button className="px-5 py-2.5 mt-2 btn-primary text-xs font-bold rounded-xl shadow-premium transition-transform hover:scale-105">
                      Expand View
                    </button>
                  </div>
                </Tilt>
              )}
            </m.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
