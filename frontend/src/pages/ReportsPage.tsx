import React from 'react';
import { useUIStore } from '../store/useUIStore';
import { useProjectStore } from '../store/useProjectStore';
import { api } from '../services/api';
import { FileText, Download, Presentation, FileSpreadsheet, Sparkles, CheckCircle2 } from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const projects = useProjectStore(state => state.projects);
  const addToast = useUIStore(state => state.addToast);
  const setCurrentPage = useUIStore(state => state.setCurrentPage);
  const setActiveProject = useProjectStore(state => state.setActiveProject);

  // Completed projects are the ones with generated reports
  const completedProjects = projects.filter(p => p.status === 'completed');

  const handleDownload = (projectId: string, format: 'pdf' | 'ppt' | 'docx' | 'markdown' | 'json') => {
    addToast('info', `Downloading ${format.toUpperCase()} export...`);
    const downloadUrl = api.getExportUrl(projectId, format);
    window.open(downloadUrl, '_blank');
  };

  const handleViewProject = (proj: any) => {
    setActiveProject(proj);
    setCurrentPage('project-view');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-heading">Generated Reports</h1>
        <p className="text-sm text-muted">Download complete PDF documents, pitch decks, and reports compiled by your AI specialist network.</p>
      </div>

      {completedProjects.length === 0 ? (
        <div className="bg-card p-12 text-center rounded-3xl border border-border/80 shadow-soft max-w-xl mx-auto space-y-4">
          <div className="w-12 h-12 bg-primary/10 text-primary flex items-center justify-center rounded-full mx-auto">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-heading">No reports generated yet</h3>
          <p className="text-xs text-muted leading-relaxed">
            Create a new startup project and trigger the 24-agent orchestrator. Once generated, all PDF report cards, PowerPoint presentations, and Word files will appear here for bulk download.
          </p>
          <button
            onClick={() => setCurrentPage('create-project')}
            className="px-5 py-2.5 rounded-2xl bg-primary text-white text-xs font-semibold shadow-soft hover:bg-primary-hover transition"
          >
            Create Your First Startup
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {completedProjects.map((proj) => (
            <div
              key={proj.id}
              className="bg-card rounded-3xl border border-border shadow-soft p-6 flex flex-col justify-between space-y-6"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-wider">
                    {proj.industry}
                  </span>
                  <span className="text-[10px] text-muted font-medium">
                    {new Date(proj.created_at).toLocaleDateString()}
                  </span>
                </div>
                
                <div>
                  <h3 
                    onClick={() => handleViewProject(proj)}
                    className="font-bold text-heading hover:text-primary transition cursor-pointer text-base line-clamp-1"
                  >
                    {proj.title}
                  </h3>
                  <p className="text-xs text-muted leading-relaxed line-clamp-2 mt-1">
                    {proj.idea_description}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-border/60 space-y-2">
                <span className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-2">Available Downloads</span>
                
                <button
                  onClick={() => handleDownload(proj.id, 'pdf')}
                  className="w-full flex items-center justify-between p-2 rounded-xl bg-indigo-50/50 hover:bg-indigo-50 text-primary transition text-xs font-semibold"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-primary" />
                    <span>Executive PDF Report</span>
                  </div>
                  <Download className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => handleDownload(proj.id, 'ppt')}
                  className="w-full flex items-center justify-between p-2 rounded-xl bg-blue-50/50 hover:bg-blue-50 text-secondary transition text-xs font-semibold"
                >
                  <div className="flex items-center gap-2">
                    <Presentation className="w-4 h-4 text-secondary" />
                    <span>PowerPoint Pitch Deck</span>
                  </div>
                  <Download className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => handleDownload(proj.id, 'docx')}
                  className="w-full flex items-center justify-between p-2 rounded-xl bg-teal-50/50 hover:bg-teal-50 text-accent transition text-xs font-semibold"
                >
                  <div className="flex items-center gap-2">
                    <FileSpreadsheet className="w-4 h-4 text-accent" />
                    <span>Word Documentation</span>
                  </div>
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
