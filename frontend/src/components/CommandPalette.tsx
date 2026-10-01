import React, { useState, useEffect, useRef } from 'react';
import { useUIStore } from '../store/useUIStore';
import { useProjectStore } from '../store/useProjectStore';
import { Search, Folder, Clock, Pin, CornerDownLeft } from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const projects = useProjectStore(state => state.projects);
  const setActiveProject = useProjectStore(state => state.setActiveProject);
  const setCurrentPage = useUIStore(state => state.setCurrentPage);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter projects instantly based on query
  const filtered = projects.filter(proj => 
    proj.title.toLowerCase().includes(query.toLowerCase()) ||
    proj.industry.toLowerCase().includes(query.toLowerCase()) ||
    proj.idea_description.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 8); // Limit to top 8 matches for speed

  // Handle escape to close, keyboard arrows, and enter to select
  useEffect(() => {
    if (!isOpen) return;
    setQuery('');
    setSelectedIndex(0);
    setTimeout(() => inputRef.current?.focus(), 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % Math.max(1, filtered.length));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filtered.length) % Math.max(1, filtered.length));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filtered[selectedIndex]) {
          handleSelect(filtered[selectedIndex]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, query, selectedIndex, filtered]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleSelect = (proj: any) => {
    setActiveProject(proj);
    setCurrentPage('project-view');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-slate-900/60 backdrop-blur-sm transition-opacity">
      <div 
        ref={containerRef}
        className="w-full max-w-2xl bg-card border border-border shadow-soft rounded-3xl overflow-hidden flex flex-col max-h-[420px] animate-fade-in"
      >
        {/* Search header */}
        <div className="flex items-center border-b border-border/60 px-5 py-4 gap-3 bg-slate-50/50">
          <Search className="w-5 h-5 text-muted shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type startup name or industry to search instantly..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            className="w-full bg-transparent focus:outline-none text-heading text-sm font-medium"
          />
          <span className="text-[10px] bg-slate-200 text-muted px-2 py-0.5 rounded-md font-mono select-none">
            ESC
          </span>
        </div>

        {/* Search Results */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-xs text-muted">
              No matching projects found. Try searching by tag or category.
            </div>
          ) : (
            filtered.map((proj, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={proj.id}
                  onClick={() => handleSelect(proj)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between px-4 py-3 rounded-2xl cursor-pointer transition ${
                    isSelected ? 'bg-primary-light text-primary' : 'hover:bg-slate-50 text-body'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <Folder className={`w-4 h-4 shrink-0 ${isSelected ? 'text-primary' : 'text-muted'}`} />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-heading text-xs truncate">
                          {proj.title}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-[9px] font-bold text-muted uppercase">
                          {proj.industry}
                        </span>
                        {proj.pinned && <Pin className="w-3 h-3 text-orange-500 fill-orange-400" />}
                      </div>
                      <p className="text-[10px] text-muted truncate mt-0.5">
                        {proj.idea_description}
                      </p>
                    </div>
                  </div>

                  {isSelected && (
                    <span className="flex items-center gap-1 text-[9px] font-bold text-primary animate-pulse">
                      Select <CornerDownLeft className="w-3 h-3" />
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Command palette footer */}
        <div className="border-t border-border/50 px-5 py-3.5 bg-slate-50/50 flex items-center justify-between text-[10px] text-muted font-medium">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
          </div>
          <span>Ctrl + K to open search anywhere</span>
        </div>
      </div>
    </div>
  );
};
