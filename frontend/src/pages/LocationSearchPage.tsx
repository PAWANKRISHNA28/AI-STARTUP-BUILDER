import React, { useState } from 'react';
import { m } from 'framer-motion';
import { Filter, Map, Navigation, CheckCircle2, Search, ArrowRight } from 'lucide-react';
import { useUIStore } from '../store/useUIStore';

export const LocationSearchPage: React.FC = () => {
  const setCurrentPage = useUIStore(state => state.setCurrentPage);
  
  const [filters, setFilters] = useState<Record<string, boolean>>({
    nearColleges: false,
    nearHospitals: false,
    nearMetro: false,
    nearResidential: false,
    parkingRequired: true,
    highFootfall: true,
    affordableRent: false
  });

  const toggleFilter = (key: string) => {
    setFilters(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSearch = () => {
    setCurrentPage('location-map');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      
      <div className="flex items-center gap-4 pt-4">
        <button 
          onClick={() => setCurrentPage('location-intelligence')}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          &larr; Back
        </button>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Filter className="w-6 h-6 text-primary" /> Advanced Location Filters
        </h1>
      </div>

      <m.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel rounded-3xl p-8 space-y-8 shadow-sm"
      >
        
        {/* Core Settings */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold border-b border-border/50 pb-2">Core Parameters</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Preferred Radius (km)</label>
              <input type="range" min="1" max="50" defaultValue="5" className="w-full" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>1 km</span>
                <span>50 km</span>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Store Type</label>
              <select className="w-full px-3 py-2 rounded-lg border border-border/50 bg-background text-sm">
                <option>Physical Store</option>
                <option>Hybrid</option>
                <option>Delivery Only</option>
              </select>
            </div>
          </div>
        </div>

        {/* Proximity Filters */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold border-b border-border/50 pb-2">Proximity Requirements</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.keys(filters).map((key) => (
              <button
                key={key}
                onClick={() => toggleFilter(key)}
                className={`p-3 rounded-xl border flex items-center gap-2 text-sm transition-all ${
                  filters[key] 
                    ? 'bg-primary/10 border-primary text-primary font-medium' 
                    : 'bg-background border-border/50 text-muted-foreground hover:bg-muted'
                }`}
              >
                {filters[key] && <CheckCircle2 className="w-4 h-4" />}
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </button>
            ))}
          </div>
        </div>

        {/* Action Bar */}
        <div className="pt-6 flex justify-end">
          <button 
            onClick={handleSearch}
            className="px-8 py-3 rounded-xl bg-primary text-primary-foreground font-bold flex items-center gap-2 hover:opacity-90 shadow-lg shadow-primary/25"
          >
            Launch AI Agents <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </m.div>

    </div>
  );
};
