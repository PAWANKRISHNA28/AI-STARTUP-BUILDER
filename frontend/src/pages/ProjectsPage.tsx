import React, { useState, useEffect, useRef } from 'react';
import Tilt from 'react-parallax-tilt';
import { useUIStore } from '../store/useUIStore';
import { useProjectStore } from '../store/useProjectStore';
import { Project, ProjectTag } from '../types';
import { api } from '../services/api';
import { 
  PlusCircle, 
  Search, 
  Star, 
  Pin, 
  Trash2, 
  Edit3, 
  Copy, 
  Share2, 
  Download, 
  Calendar, 
  Clock, 
  ArrowUpRight, 
  CheckCircle2, 
  Loader2, 
  AlertCircle,
  FolderKanban,
  Filter,
  Grid,
  List as ListIcon,
  Archive,
  RotateCcw,
  Sparkles,
  Tag,
  ShieldAlert,
  DownloadCloud,
  FileCode,
  FileText
} from 'lucide-react';

export const ProjectsPage: React.FC = () => {
  const projects = useProjectStore(state => state.projects);
  const setProjects = useProjectStore(state => state.setProjects);
  const addProjects = useProjectStore(state => state.addProjects);
  const updateProjectInStore = useProjectStore(state => state.updateProjectInStore);
  const projectsPage = useProjectStore(state => state.projectsPage);
  const hasMoreProjects = useProjectStore(state => state.hasMoreProjects);
  const setPagination = useProjectStore(state => state.setPagination);
  const currentPage = useUIStore(state => state.currentPage);
  const setCurrentPage = useUIStore(state => state.setCurrentPage);
  const setActiveProject = useProjectStore(state => state.setActiveProject);
  const addToast = useUIStore(state => state.addToast);

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [sortBy, setSortBy] = useState('recently_opened');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  // Renaming & Dropdown UI states
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameTitle, setRenameTitle] = useState('');
  const [activeDownloadMenu, setActiveDownloadMenu] = useState<string | null>(null);

  const observerRef = useRef<HTMLDivElement>(null);
  const downloadMenuRef = useRef<HTMLDivElement>(null);

  // Close download dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (downloadMenuRef.current && !downloadMenuRef.current.contains(e.target as Node)) {
        setActiveDownloadMenu(null);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Listen to sidebar shortcut filters (Favorites / Pinned)
  useEffect(() => {
    const checkShortcutFilter = () => {
      const pre = localStorage.getItem('pre_filter');
      if (pre) {
        setFilterBy(pre);
        localStorage.removeItem('pre_filter');
      }
    };
    checkShortcutFilter();
    // Listen to storage events just in case
    window.addEventListener('storage', checkShortcutFilter);
    return () => window.removeEventListener('storage', checkShortcutFilter);
  }, [currentPage]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch projects on filter / sort / search change
  useEffect(() => {
    const fetchProjectsList = async () => {
      setIsLoading(true);
      try {
        const res = await api.listProjects(1, 10, debouncedSearch, filterBy, sortBy);
        setProjects(res.items);
        setPagination({
          total: res.total,
          page: res.page,
          limit: res.limit,
          has_more: res.has_more
        });
      } catch (err) {
        console.error(err);
        addToast('error', 'Failed to load projects');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjectsList();
  }, [debouncedSearch, filterBy, sortBy, setProjects, setPagination, addToast]);

  // Infinite scroll trigger
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMoreProjects && !isLoadingMore && !isLoading) {
          handleLoadMore();
        }
      },
      { threshold: 0.5 }
    );
    if (observerRef.current) {
      observer.observe(observerRef.current);
    }
    return () => observer.disconnect();
  }, [hasMoreProjects, isLoadingMore, isLoading, projectsPage]);

  const handleLoadMore = async () => {
    setIsLoadingMore(true);
    const nextPage = projectsPage + 1;
    try {
      const res = await api.listProjects(nextPage, 10, debouncedSearch, filterBy, sortBy);
      addProjects(res.items);
      setPagination({
        total: res.total,
        page: res.page,
        limit: res.limit,
        has_more: res.has_more
      });
    } catch (err) {
      console.error(err);
      addToast('error', 'Failed to load more projects');
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleSelect = (project: Project) => {
    // If deleted/in trash, don't open workspace directly
    if (project.deleted_at) {
      addToast('info', 'Restore this project first to access the workspace.');
      return;
    }
    setActiveProject(project);
    setCurrentPage('project-view');
  };

  const handleToggleFavorite = async (e: React.MouseEvent, proj: Project) => {
    e.stopPropagation();
    try {
      const updated = await api.updateProject(proj.id, { favorite: !proj.favorite });
      updateProjectInStore(updated);
      addToast('success', updated.favorite ? 'Added to favorites' : 'Removed from favorites');
    } catch (err) {
      addToast('error', 'Failed to toggle favorite');
    }
  };

  const handleTogglePin = async (e: React.MouseEvent, proj: Project) => {
    e.stopPropagation();
    try {
      const updated = await api.updateProject(proj.id, { pinned: !proj.pinned });
      updateProjectInStore(updated);
      addToast('success', updated.pinned ? 'Startup pinned to sidebar' : 'Startup unpinned');
    } catch (err) {
      addToast('error', 'Failed to toggle pin');
    }
  };

  // Archive project
  const handleToggleArchive = async (e: React.MouseEvent, proj: Project) => {
    e.stopPropagation();
    try {
      let updated;
      if (proj.is_archived) {
        updated = await api.unarchiveProject(proj.id);
        addToast('success', 'Project restored from archive');
      } else {
        updated = await api.archiveProject(proj.id);
        addToast('success', 'Project moved to archive');
      }
      updateProjectInStore(updated);
      
      // Reload projects list to reflect archived filter
      const res = await api.listProjects(1, 10, debouncedSearch, filterBy, sortBy);
      setProjects(res.items);
    } catch (err) {
      addToast('error', 'Failed to archive project');
    }
  };

  // Soft delete (moves to Trash)
  const handleSoftDelete = async (e: React.MouseEvent, projId: string) => {
    e.stopPropagation();
    try {
      await api.deleteProject(projId);
      // Remove from store list
      setProjects(projects.filter(p => p.id !== projId));
      addToast('success', 'Project moved to Trash');
    } catch (err) {
      addToast('error', 'Failed to delete project');
    }
  };

  // Restore project from Trash
  const handleRestoreProject = async (e: React.MouseEvent, projId: string) => {
    e.stopPropagation();
    try {
      const restored = await api.restoreProject(projId);
      setProjects(projects.filter(p => p.id !== projId));
      addToast('success', `Restored '${restored.title}' successfully!`);
    } catch (err) {
      addToast('error', 'Failed to restore project');
    }
  };

  // Hard delete (Permanent delete)
  const handlePermanentDelete = async (e: React.MouseEvent, projId: string) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to permanently delete this project? This action is irreversible.')) return;
    try {
      await api.deleteProjectPermanently(projId);
      setProjects(projects.filter(p => p.id !== projId));
      addToast('success', 'Project permanently deleted');
    } catch (err) {
      addToast('error', 'Failed to delete permanently');
    }
  };

  const handleStartRename = (e: React.MouseEvent, proj: Project) => {
    e.stopPropagation();
    setRenamingId(proj.id);
    setRenameTitle(proj.title);
  };

  const handleSaveRename = async (e: React.MouseEvent | React.KeyboardEvent, projId: string) => {
    e.stopPropagation();
    if (!renameTitle.trim()) return;
    try {
      const updated = await api.updateProject(projId, { title: renameTitle });
      updateProjectInStore(updated);
      setRenamingId(null);
      addToast('success', 'Project renamed');
    } catch (err) {
      addToast('error', 'Failed to rename project');
    }
  };

  const handleDuplicate = async (e: React.MouseEvent, projId: string) => {
    e.stopPropagation();
    try {
      const newProj = await api.duplicateProject(projId);
      setProjects([newProj, ...projects]);
      addToast('success', 'Project duplicated!');
    } catch (err) {
      addToast('error', 'Failed to duplicate project');
    }
  };

  const handleShare = (e: React.MouseEvent, proj: Project) => {
    e.stopPropagation();
    const shareLink = `${window.location.origin}/project/${proj.id}`;
    navigator.clipboard.writeText(shareLink);
    addToast('success', `Shareable link for '${proj.title}' copied to clipboard!`);
  };

  const handleDownload = (e: React.MouseEvent, projectId: string, format: 'pdf' | 'ppt' | 'docx' | 'markdown' | 'json') => {
    e.stopPropagation();
    addToast('info', `Downloading ${format.toUpperCase()} export...`);
    const downloadUrl = api.getExportUrl(projectId, format);
    window.open(downloadUrl, '_blank');
    setActiveDownloadMenu(null);
  };

  const toggleDownloadMenu = (e: React.MouseEvent, projId: string) => {
    e.stopPropagation();
    setActiveDownloadMenu(prev => (prev === projId ? null : projId));
  };

  const filterTabs = [
    { id: 'all', label: 'All' },
    { id: 'today', label: 'Today' },
    { id: 'yesterday', label: 'Yesterday' },
    { id: 'last_7_days', label: '7 Days' },
    { id: 'last_30_days', label: '30 Days' },
    { id: 'completed', label: 'Completed' },
    { id: 'draft', label: 'Draft' },
    { id: 'in_progress', label: 'In Progress' },
    { id: 'favorites', label: 'Favorites' },
    { id: 'pinned', label: 'Pinned' },
    { id: 'archived', label: 'Archived' },
    { id: 'shared', label: 'Shared' },
    { id: 'trash', label: 'Trash 🗑️' },
  ];

  // Helper colors for default tags
  const tagColorMapping: Record<string, { bg: string, text: string }> = {
    'AI': { bg: 'bg-blue-50 dark:bg-blue-900/30', text: 'text-blue-600 dark:text-blue-400' },
    'Healthcare': { bg: 'bg-rose-50 dark:bg-rose-900/30', text: 'text-rose-600 dark:text-rose-400' },
    'FinTech': { bg: 'bg-amber-50 dark:bg-amber-900/30', text: 'text-amber-600 dark:text-amber-400' },
    'Education': { bg: 'bg-emerald-50 dark:bg-emerald-900/30', text: 'text-emerald-600 dark:text-emerald-400' },
    'SaaS': { bg: 'bg-indigo-50 dark:bg-indigo-900/30', text: 'text-indigo-600 dark:text-indigo-400' },
    'Marketplace': { bg: 'bg-purple-50 dark:bg-purple-900/30', text: 'text-purple-600 dark:text-purple-400' },
    'Blockchain': { bg: 'bg-red-50 dark:bg-red-900/30', text: 'text-red-600 dark:text-red-400' },
    'IoT': { bg: 'bg-teal-50 dark:bg-teal-900/30', text: 'text-teal-600 dark:text-teal-400' },
    'Machine Learning': { bg: 'bg-sky-50 dark:bg-sky-900/30', text: 'text-sky-600 dark:text-sky-400' },
  };

  const getTagStyle = (tagName: string) => {
    return tagColorMapping[tagName] || { bg: 'bg-slate-50 dark:bg-slate-800', text: 'text-slate-600 dark:text-slate-400' };
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-heading">Recent Projects</h1>
          <p className="text-sm text-muted">Create, edit, organize, and continue your AI-generated startup projects.</p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* View mode toggle (Grid / List) */}
          <div className="flex items-center card-premium p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-xl transition ${viewMode === 'grid' ? 'bg-primary/20 text-primary shadow-inner' : 'text-muted hover:text-heading'}`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-xl transition ${viewMode === 'list' ? 'bg-primary/20 text-primary shadow-inner' : 'text-muted hover:text-heading'}`}
              title="List View"
            >
              <ListIcon className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setCurrentPage('create-project')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl btn-primary text-xs font-bold shadow-premium transition-all hover:scale-105"
          >
            <PlusCircle className="w-4 h-4" /> New Startup
          </button>
        </div>
      </div>

      {/* Soft Delete Trash Banner warning */}
      {filterBy === 'trash' && (
        <div className="bg-amber-50 dark:bg-amber-950/20 p-4 rounded-3xl border border-amber-200/60 text-xs text-amber-800 dark:text-amber-400 flex items-start gap-3 shadow-soft">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
          <div>
            <span className="font-bold">Trash Directory</span>
            <p className="mt-0.5 leading-relaxed">Projects in the trash are archived and kept for 30 days before permanent deletion. Restoring recovers their full workspace configurations, chat history, and blueprints.</p>
          </div>
        </div>
      )}

      {/* Search, Sorting, and Filters Control Panel */}
      <div className="glass-panel bg-white/40 backdrop-blur-2xl p-4 rounded-3xl border border-white/50 shadow-lg space-y-4">
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input
              type="text"
              placeholder="Search project name, industry, tags, keywords, DDL..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/60 border border-white/60 shadow-inner focus:outline-none focus:border-primary/50 transition text-xs font-semibold backdrop-blur-sm"
            />
          </div>

          {/* Sorting criteria */}
          <div className="flex items-center gap-2 shrink-0">
            <label className="text-[10px] uppercase font-bold text-muted">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-border text-xs font-semibold text-body focus:outline-none focus:border-primary"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="recently_opened">Recently Opened</option>
              <option value="alphabetical">Alphabetical</option>
              <option value="most_used">Most Used</option>
              <option value="most_viewed">Most Viewed</option>
            </select>
          </div>
        </div>

        {/* Filter categories tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none border-t border-border/40 pt-3">
          <Filter className="w-3.5 h-3.5 text-muted shrink-0 mr-1" />
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterBy(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                filterBy === tab.id
                  ? 'bg-primary text-white shadow-soft'
                  : 'bg-slate-50 dark:bg-slate-900 text-muted hover:text-heading hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Projects List/Grid Rendering */}
      {isLoading ? (
        <div className="py-24 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <span className="text-xs text-muted font-medium">Fetching projects database...</span>
        </div>
      ) : projects.length === 0 ? (
        <div className="bg-card p-12 text-center rounded-3xl border border-border/80 shadow-soft max-w-xl mx-auto space-y-4">
          <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-950/20 text-primary flex items-center justify-center rounded-full mx-auto">
            <FolderKanban className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-heading">No startup projects found</h3>
          <p className="text-xs text-muted leading-relaxed">
            No projects matched your criteria. Build a new startup or check your search term and filter tabs.
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        // Grid View
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((proj: Project) => {
            const isCompleted = proj.status === 'completed';
            const isGenerating = proj.status === 'generating';
            const displayStatus = 
              proj.status === 'completed' ? 'Completed' :
              proj.status === 'generating' ? 'In Progress' : 'Draft';

            // Tag mapping (e.g. Map industry tags or tags array)
            const projTags = (proj.tags && proj.tags.length > 0) ? proj.tags : [
              { id: '1', project_id: proj.id, name: (proj.industry || '').includes('Food') ? 'AI' : 'SaaS', color: '#4F46E5' }
            ];

            return (
              <Tilt key={proj.id} tiltMaxAngleX={3} tiltMaxAngleY={3} scale={1.02} transitionSpeed={2500}>
                <div
                  onClick={() => handleSelect(proj)}
                  className="card-premium h-full p-6 cursor-pointer flex flex-col justify-between space-y-4 group relative"
                >
                {/* Top Actions and Flags */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex flex-wrap gap-1">
                    {projTags.map((tag: any) => {
                      const tagStyle = getTagStyle(tag.name);
                      return (
                        <span 
                          key={tag.id} 
                          className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider ${tagStyle.bg} ${tagStyle.text}`}
                        >
                          {tag.name}
                        </span>
                      );
                    })}
                  </div>
                  
                  {/* Pin & Favorite Buttons */}
                  {!proj.deleted_at && (
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={(e) => handleTogglePin(e, proj)}
                        className={`p-1.5 rounded-lg border transition ${
                          proj.pinned 
                            ? 'bg-orange-50 border-orange-200 text-orange-600' 
                            : 'bg-slate-50 dark:bg-slate-900 border-transparent hover:bg-slate-100 text-muted'
                        }`}
                        title={proj.pinned ? 'Unpin project' : 'Pin project'}
                      >
                        <Pin className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => handleToggleFavorite(e, proj)}
                        className={`p-1.5 rounded-lg border transition ${
                          proj.favorite 
                            ? 'bg-yellow-50 border-yellow-200 text-yellow-600' 
                            : 'bg-slate-50 dark:bg-slate-900 border-transparent hover:bg-slate-100 text-muted'
                        }`}
                        title={proj.favorite ? 'Remove favorite' : 'Add favorite'}
                      >
                        <Star className={`w-3.5 h-3.5 ${proj.favorite ? 'fill-yellow-500 text-yellow-500' : ''}`} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Name & Short Description */}
                <div className="space-y-2">
                  {renamingId === proj.id ? (
                    <div className="flex items-center gap-1.5" onClick={e => e.stopPropagation()}>
                      <input
                        type="text"
                        value={renameTitle}
                        onChange={e => setRenameTitle(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleSaveRename(e, proj.id)}
                        className="flex-1 px-3 py-1.5 rounded-xl border border-primary text-xs font-semibold bg-white dark:bg-slate-900"
                        autoFocus
                      />
                      <button
                        onClick={(e) => handleSaveRename(e, proj.id)}
                        className="px-2.5 py-1.5 rounded-xl bg-primary text-white text-[10px] font-bold"
                      >
                        Save
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); setRenamingId(null); }}
                        className="px-2.5 py-1.5 rounded-xl bg-slate-100 text-muted text-[10px] font-bold"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <h3 className="text-base font-bold text-heading group-hover:text-primary transition line-clamp-1">
                      {proj.title}
                    </h3>
                  )}
                  <p className="text-xs text-muted leading-relaxed line-clamp-2">
                    {proj.idea_description}
                  </p>
                </div>

                {/* Progress bar if generating */}
                {isGenerating && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-bold text-primary">
                      <span>{proj.current_agent}</span>
                      <span>{proj.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-primary h-full transition-all duration-300"
                        style={{ width: `${proj.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Specs counter indicators */}
                {isCompleted && (
                  <div className="flex items-center gap-3 pt-1 text-[10px] font-bold text-heading">
                    <span className="flex items-center gap-1"><FileText className="w-3.5 h-3.5 text-primary" /> 3 Reports</span>
                    <span className="flex items-center gap-1"><FileCode className="w-3.5 h-3.5 text-accent" /> 8 Documents</span>
                  </div>
                )}

                {/* Footer details & Operations */}
                <div className="pt-3 border-t border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[9px] text-muted font-medium">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-subtle" /> Created: {new Date(proj.created_at).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-subtle" /> Opened: {new Date(proj.last_opened).toLocaleDateString()}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full font-bold text-[8px] uppercase tracking-wider ${
                      proj.status === 'completed' ? 'bg-emerald-50 text-emerald-700' :
                      proj.status === 'generating' ? 'bg-blue-50 text-blue-700 animate-pulse' :
                      proj.status === 'failed' ? 'bg-rose-50 text-rose-700' :
                      'bg-slate-100 text-muted'
                    }`}>
                      {displayStatus}
                    </span>
                  </div>

                  {/* Operation Buttons */}
                  <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                    {proj.deleted_at ? (
                      // Trash actions: Restore / Permanent Delete
                      <>
                        <button
                          onClick={(e) => handleRestoreProject(e, proj.id)}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-[10px] transition"
                          title="Restore project workspace"
                        >
                          <RotateCcw className="w-3 h-3" /> Restore
                        </button>
                        <button
                          onClick={(e) => handlePermanentDelete(e, proj.id)}
                          className="p-1.5 hover:bg-rose-50 rounded-lg text-muted hover:text-rose-600 transition"
                          title="Permanently delete project"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    ) : (
                      // Regular project actions
                      <>
                        <button
                          onClick={(e) => handleToggleArchive(e, proj)}
                          className={`p-2 rounded-lg transition ${
                            proj.is_archived ? 'bg-indigo-50 text-primary' : 'hover:bg-slate-100 text-muted'
                          }`}
                          title={proj.is_archived ? 'Restore from Archive' : 'Move to Archive'}
                        >
                          <Archive className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => handleStartRename(e, proj)}
                          className="p-2 hover:bg-slate-100 rounded-lg text-muted hover:text-heading transition"
                          title="Rename project"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => handleDuplicate(e, proj.id)}
                          className="p-2 hover:bg-slate-100 rounded-lg text-muted hover:text-heading transition"
                          title="Duplicate project"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => handleShare(e, proj)}
                          className="p-2 hover:bg-slate-100 rounded-lg text-muted hover:text-heading transition"
                          title="Share project with invite link"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </button>

                        {/* Report Download dropdown */}
                        {isCompleted && (
                          <div className="relative">
                            <button
                              onClick={(e) => toggleDownloadMenu(e, proj.id)}
                              className={`p-2 rounded-lg transition ${
                                activeDownloadMenu === proj.id ? 'bg-primary-light text-primary' : 'hover:bg-slate-100 text-muted hover:text-heading'
                              }`}
                              title="Download Report packages"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </button>
                            
                            {activeDownloadMenu === proj.id && (
                              <div 
                                ref={downloadMenuRef}
                                className="absolute right-0 bottom-full mb-1.5 z-30 w-44 bg-card border border-border shadow-soft rounded-2xl p-1.5 space-y-0.5 text-xs font-semibold"
                              >
                                <button
                                  onClick={(e) => handleDownload(e, proj.id, 'pdf')}
                                  className="w-full text-left px-2.5 py-1.5 hover:bg-indigo-50 rounded-xl text-primary text-xs"
                                >
                                  📄 PDF Report
                                </button>
                                <button
                                  onClick={(e) => handleDownload(e, proj.id, 'ppt')}
                                  className="w-full text-left px-2.5 py-1.5 hover:bg-blue-50 rounded-xl text-secondary text-xs"
                                >
                                  📊 PPTX Pitch Deck
                                </button>
                                <button
                                  onClick={(e) => handleDownload(e, proj.id, 'docx')}
                                  className="w-full text-left px-2.5 py-1.5 hover:bg-teal-50 rounded-xl text-accent text-xs"
                                >
                                  📝 Word Report
                                </button>
                              </div>
                            )}
                          </div>
                        )}

                        <button
                          onClick={(e) => handleSoftDelete(e, proj.id)}
                          className="p-2 hover:bg-rose-50 rounded-lg text-muted hover:text-rose-600 transition"
                          title="Move project to Trash"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
                </div>
              </Tilt>
            );
          })}
        </div>
      ) : (
        // List View (Linear style)
        <div className="bg-card rounded-3xl border border-border shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900 border-b border-border text-muted font-bold uppercase tracking-wider text-[10px]">
                  <th className="p-4">Startup Name</th>
                  <th className="p-4">Tags</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Created Date</th>
                  <th className="p-4">Last Opened</th>
                  <th className="p-4">Usage stats</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {projects.map((proj: Project) => {
                  const displayStatus = 
                    proj.status === 'completed' ? 'Completed' :
                    proj.status === 'generating' ? 'Generating' : 'Draft';

                  const projTags = (proj.tags && proj.tags.length > 0) ? proj.tags : [
                    { id: '1', project_id: proj.id, name: (proj.industry || '').includes('Food') ? 'AI' : 'SaaS', color: '#4F46E5' }
                  ];

                  return (
                    <tr 
                      key={proj.id}
                      onClick={() => handleSelect(proj)}
                      className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition cursor-pointer font-medium text-body"
                    >
                      <td className="p-4 font-bold text-heading text-sm">
                        {proj.title}
                        <p className="text-[10px] text-muted font-normal mt-0.5 line-clamp-1 max-w-sm">{proj.idea_description}</p>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-1.5 flex-wrap">
                          {projTags.map(tag => {
                            const tagStyle = getTagStyle(tag.name);
                            return (
                              <span 
                                key={tag.id} 
                                className={`px-2 py-0.5 rounded-full text-[8px] font-extrabold uppercase tracking-wider ${tagStyle.bg} ${tagStyle.text}`}
                              >
                                {tag.name}
                              </span>
                            );
                          })}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[8px] uppercase tracking-wider ${
                          proj.status === 'completed' ? 'bg-emerald-50 text-emerald-700' :
                          proj.status === 'generating' ? 'bg-blue-50 text-blue-700 animate-pulse' :
                          'bg-slate-100 text-muted'
                        }`}>
                          {displayStatus}
                        </span>
                      </td>
                      <td className="p-4 text-muted text-[10px]">{new Date(proj.created_at).toLocaleDateString()}</td>
                      <td className="p-4 text-muted text-[10px]">{new Date(proj.last_opened).toLocaleDateString()}</td>
                      <td className="p-4 text-muted text-[10px]">
                        👁️ {proj.view_count || 0} | ⚡ {proj.use_count || 0}
                      </td>
                      <td className="p-4 text-right" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1">
                          {proj.deleted_at ? (
                            <>
                              <button
                                onClick={(e) => handleRestoreProject(e, proj.id)}
                                className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-[10px]"
                              >
                                Restore
                              </button>
                              <button
                                onClick={(e) => handlePermanentDelete(e, proj.id)}
                                className="p-1.5 hover:bg-rose-50 text-muted hover:text-rose-600 rounded-lg"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={(e) => handleToggleFavorite(e, proj)}
                                className="p-1.5 hover:bg-slate-100 rounded-lg text-muted"
                              >
                                <Star className={`w-3.5 h-3.5 ${proj.favorite ? 'fill-yellow-500 text-yellow-500' : ''}`} />
                              </button>
                              <button
                                onClick={(e) => handleSoftDelete(e, proj.id)}
                                className="p-1.5 hover:bg-rose-50 rounded-lg text-muted hover:text-rose-600"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Lazy loading / Infinite scroll spinner */}
      {hasMoreProjects && (
        <div ref={observerRef} className="py-8 flex justify-center">
          {isLoadingMore && (
            <div className="flex items-center gap-2 text-xs font-bold text-primary">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading more startup blueprints...
            </div>
          )}
        </div>
      )}
    </div>
  );
};

