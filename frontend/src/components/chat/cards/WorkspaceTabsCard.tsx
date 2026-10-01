import React, { useState } from 'react';
import { MessageSquare, MapPin, FileText, Image as ImageIcon, BarChart3, Presentation, Download } from 'lucide-react';

export const WorkspaceTabsCard: React.FC = React.memo(() => {
  const [activeTab, setActiveTab] = useState('reports');

  const tabs = [
    { id: 'conversation', label: 'Conversation', icon: MessageSquare },
    { id: 'map', label: 'Map', icon: MapPin },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'images', label: 'Images', icon: ImageIcon },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'presentation', label: 'Presentation', icon: Presentation },
  ];

  return (
    <div className="card-premium p-0 max-w-2xl w-full my-4 overflow-hidden">
      <div className="flex overflow-x-auto scrollbar-none border-b border-border/50 bg-muted/20">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm whitespace-nowrap border-b-2 transition-colors ${
                isActive ? 'border-primary text-primary font-medium bg-background' : 'border-transparent text-muted-foreground hover:bg-black/5 hover:text-foreground'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>
      <div className="p-5">
        {activeTab === 'reports' && (
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Generated Reports</h3>
            <div className="grid grid-cols-2 gap-3">
              {['Business Plan', 'Market Report', 'Financial Report', 'Investor Pitch'].map(report => (
                <div key={report} className="p-3 border border-border/50 rounded-xl flex items-center justify-between group hover:border-primary/50 transition-colors">
                  <div className="flex items-center gap-2 text-sm text-foreground">
                    <FileText className="w-4 h-4 text-primary" />
                    {report}
                  </div>
                  <button className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:text-primary">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-4 pt-4 border-t border-border/50">
              <span className="text-sm text-muted-foreground self-center mr-2">Export:</span>
              <button className="px-3 py-1.5 bg-danger/10 text-danger hover:bg-danger/20 text-xs font-semibold rounded-lg">PDF</button>
              <button className="px-3 py-1.5 bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 text-xs font-semibold rounded-lg">Word</button>
              <button className="px-3 py-1.5 bg-orange-500/10 text-orange-600 hover:bg-orange-500/20 text-xs font-semibold rounded-lg">PPT</button>
              <button className="px-3 py-1.5 bg-success/10 text-success hover:bg-success/20 text-xs font-semibold rounded-lg">Excel</button>
            </div>
          </div>
        )}
        {activeTab !== 'reports' && (
          <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">
            Content for {tabs.find(t => t.id === activeTab)?.label} will appear here.
          </div>
        )}
      </div>
    </div>
  );
});
