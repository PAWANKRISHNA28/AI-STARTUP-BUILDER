import React from 'react';
import { Palette, Download, Save, Copy } from 'lucide-react';

export const VisualizationCard: React.FC = React.memo(() => {
  return (
    <div className="card-premium p-5 max-w-lg w-full my-4">
      <div className="flex items-center gap-2 mb-4 text-primary">
        <Palette className="w-5 h-5" />
        <h3 className="font-semibold">AI Business Visualization</h3>
      </div>
      
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-none">
        <button className="px-3 py-1 bg-primary text-primary-foreground text-xs rounded-full whitespace-nowrap">Modern</button>
        <button className="px-3 py-1 bg-muted text-muted-foreground hover:bg-muted/80 text-xs rounded-full whitespace-nowrap">Luxury</button>
        <button className="px-3 py-1 bg-muted text-muted-foreground hover:bg-muted/80 text-xs rounded-full whitespace-nowrap">Minimal</button>
        <button className="px-3 py-1 bg-muted text-muted-foreground hover:bg-muted/80 text-xs rounded-full whitespace-nowrap">Industrial</button>
        <button className="px-3 py-1 bg-muted text-muted-foreground hover:bg-muted/80 text-xs rounded-full whitespace-nowrap">Eco-Friendly</button>
      </div>

      <div className="w-full h-48 bg-muted rounded-xl flex items-center justify-center mb-4 overflow-hidden border border-border/50">
        <img 
          src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=800&h=400" 
          alt="Coffee Shop Visualization"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex justify-between gap-2">
        <button className="flex-1 py-2 text-xs text-primary bg-primary/10 hover:bg-primary/20 rounded-xl transition-colors font-medium">
          Generate Another
        </button>
        <button className="p-2 text-muted-foreground bg-muted/50 hover:bg-muted rounded-xl transition-colors">
          <Download className="w-4 h-4" />
        </button>
        <button className="p-2 text-muted-foreground bg-muted/50 hover:bg-muted rounded-xl transition-colors">
          <Save className="w-4 h-4" />
        </button>
        <button className="p-2 text-muted-foreground bg-muted/50 hover:bg-muted rounded-xl transition-colors">
          <Copy className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
});
