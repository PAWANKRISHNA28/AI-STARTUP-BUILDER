import React from 'react';
import { Target } from 'lucide-react';

export const CompetitorCard: React.FC = React.memo(() => {
  return (
    <div className="card-premium p-5 max-w-sm w-full my-4">
      <div className="flex items-center gap-2 mb-4 text-primary">
        <Target className="w-5 h-5" />
        <h3 className="font-semibold">Nearby Competitors</h3>
      </div>
      <div className="space-y-4">
        <ul className="space-y-2">
          <li className="flex items-center gap-2 text-sm text-foreground">
            <div className="w-1.5 h-1.5 rounded-full bg-primary" /> Starbucks
          </li>
          <li className="flex items-center gap-2 text-sm text-foreground">
            <div className="w-1.5 h-1.5 rounded-full bg-primary" /> Cafe Coffee Day
          </li>
          <li className="flex items-center gap-2 text-sm text-foreground">
            <div className="w-1.5 h-1.5 rounded-full bg-primary" /> Third Wave Coffee
          </li>
        </ul>
        <div className="h-px bg-border/50" />
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Competition</span>
          <span className="font-bold text-warning text-sm">Medium</span>
        </div>
        <button className="w-full mt-2 py-2 text-sm text-primary bg-primary/10 hover:bg-primary/20 rounded-xl transition-colors font-medium">
          Analyze
        </button>
      </div>
    </div>
  );
});
