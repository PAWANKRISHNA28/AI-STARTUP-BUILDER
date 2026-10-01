import React, { useState } from 'react';
import { useUIStore } from '../store/useUIStore';
import { useProjectStore } from '../store/useProjectStore';
import { api } from '../services/api';
import { FileText, FileSignature, FileCode, Presentation, FileKey, Shield, Search, ExternalLink, Download, Plus, Bot, Users } from 'lucide-react';
import { m, AnimatePresence } from 'framer-motion';

const DOCUMENT_TYPES = [
  { id: 'business_plan', title: 'Business Plan', icon: FileText, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { id: 'pitch_deck', title: 'Pitch Deck', icon: Presentation, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  { id: 'nda', title: 'Non-Disclosure Agreement', icon: FileKey, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  { id: 'founder_agreement', title: 'Founder Agreement', icon: Users, color: 'text-orange-500', bg: 'bg-orange-500/10' },
  { id: 'privacy_policy', title: 'Privacy Policy', icon: Shield, color: 'text-rose-500', bg: 'bg-rose-500/10' },
  { id: 'terms', title: 'Terms & Conditions', icon: FileSignature, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
];

export const DocumentsPage: React.FC = () => {
  const projects = useProjectStore(state => state.projects);
  const addToast = useUIStore(state => state.addToast);
  const setCurrentPage = useUIStore(state => state.setCurrentPage);
  const setActiveProject = useProjectStore(state => state.setActiveProject);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const completedProjects = projects.filter(
    p => p.status === 'completed' && 
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleGenerate = (type: string) => {
    addToast('success', 'AI is generating the document. This will take a moment.');
  };

  const handleOpenWorkspace = (proj: any) => {
    setActiveProject(proj);
    setCurrentPage('project-view');
  };

  const handleDownload = async (projId: string, format: string) => {
    try {
      const url = api.getExportUrl(projId, format);
      window.open(url, '_blank');
      addToast('success', `Downloading ${format.toUpperCase()} document...`);
    } catch (e) {
      addToast('error', 'Download failed');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <m.div 
      className="space-y-8 max-w-6xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "100px" }}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Startup Documents</h1>
          <p className="text-sm text-muted-foreground mt-1">Generate and manage essential legal and business documents via AI.</p>
        </div>
        
        <div className="relative w-full md:w-72">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search documents or projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-full glass-panel border border-border/50 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm font-medium shadow-sm"
          />
        </div>
      </div>

      {/* Document Templates Grid */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Document Templates</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {DOCUMENT_TYPES.map((doc) => (
            <m.div
              key={doc.id}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleGenerate(doc.id)}
              className="glass-panel p-5 rounded-[24px] border border-border/50 shadow-sm hover:shadow-soft cursor-pointer group transition-all"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${doc.bg} ${doc.color} group-hover:scale-110 transition-transform duration-300`}>
                  <doc.icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-foreground text-sm">{doc.title}</h3>
                  <div className="flex items-center gap-1 mt-1 text-[10px] font-bold text-blue-500 uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                    <Bot className="w-3 h-3" /> Generate with AI
                  </div>
                </div>
              </div>
            </m.div>
          ))}
        </div>
      </div>

      <div className="w-full h-px bg-border/50 my-8"></div>

      {/* Generated Documents List */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Generated Archives</h2>
        
        {completedProjects.length === 0 ? (
          <div className="glass-panel p-12 text-center rounded-[32px] border border-border/50 shadow-soft max-w-2xl mx-auto space-y-4">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto text-muted-foreground shadow-inner">
              <FileText className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-foreground">No generated documents</h3>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
              Once your AI co-founder generates blueprints for your startup, the resulting business plans, technical specs, and architecture documents will appear here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {completedProjects.map((proj) => (
              <m.div
                variants={itemVariants}
                key={proj.id}
                className="glass-panel rounded-[24px] border border-border/50 shadow-sm p-6 space-y-5"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-foreground">{proj.title}</h3>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground bg-muted px-2 py-0.5 rounded-full mt-2 inline-block">
                      {proj.industry}
                    </span>
                  </div>
                  
                  <button
                    onClick={() => handleOpenWorkspace(proj)}
                    className="p-2 bg-muted/50 text-muted-foreground hover:bg-foreground hover:text-background rounded-xl transition-colors"
                    title="Open Workspace"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-background border border-border/50 group">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-600 flex items-center justify-center">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-foreground">Executive Summary.pdf</p>
                        <p className="text-[10px] text-muted-foreground">Generated {new Date(proj.updated_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleDownload(proj.id, 'pdf')}
                      className="text-muted-foreground hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-background border border-border/50 group">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-purple-500/10 text-purple-600 flex items-center justify-center">
                        <Presentation className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-foreground">Pitch_Deck.pptx</p>
                        <p className="text-[10px] text-muted-foreground">Generated {new Date(proj.updated_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleDownload(proj.id, 'pdf')}
                      className="text-muted-foreground hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-2xl bg-background border border-border/50 group">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                        <FileCode className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-foreground">Architecture_Spec.json</p>
                        <p className="text-[10px] text-muted-foreground">Generated {new Date(proj.updated_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <button className="text-muted-foreground hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </m.div>
            ))}
          </div>
        )}
      </div>
    </m.div>
  );
};
