import React from 'react';
import { MapPin, Star } from 'lucide-react';

export const LocationCard: React.FC = React.memo(() => {
  return (
    <div className="card-premium p-5 max-w-sm w-full my-4">
      <div className="flex items-center gap-2 mb-4 text-primary">
        <MapPin className="w-5 h-5" />
        <h3 className="font-semibold">Best Location</h3>
      </div>
      <div className="space-y-4">
        <div>
          <h4 className="font-bold text-lg text-foreground">Anna Nagar</h4>
          <div className="flex items-center gap-1 text-warning mt-1">
            <Star className="w-4 h-4 fill-current" />
            <Star className="w-4 h-4 fill-current" />
            <Star className="w-4 h-4 fill-current" />
            <Star className="w-4 h-4 fill-current" />
            <Star className="w-4 h-4 fill-current" />
          </div>
        </div>
        <div className="h-px bg-border/50" />
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Business Score</span>
          <span className="font-bold text-success text-lg">94</span>
        </div>
        <button className="w-full mt-2 py-2 text-sm text-primary bg-primary/10 hover:bg-primary/20 rounded-xl transition-colors font-medium">
          View Map
        </button>
      </div>
    </div>
  );
});
