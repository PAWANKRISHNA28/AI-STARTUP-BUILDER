import React from 'react';
import { m } from 'framer-motion';
import { ArrowLeft, Check, Minus } from 'lucide-react';
import { useUIStore } from '../store/useUIStore';

export const LocationComparePage: React.FC = () => {
  const setCurrentPage = useUIStore(state => state.setCurrentPage);

  const locations = [
    {
      id: 1,
      name: 'Downtown Commercial Hub',
      score: 92,
      rent: '$5,000/mo',
      competition: 'High',
      growth: 'Excellent',
      population: '120k within 5km',
      accessibility: 'High (Metro + Bus)',
      traffic: 'Very High',
      roi: '150% (est)'
    },
    {
      id: 2,
      name: 'Suburban Retail Park',
      score: 85,
      rent: '$2,500/mo',
      competition: 'Low',
      growth: 'Moderate',
      population: '45k within 5km',
      accessibility: 'Car Dependent',
      traffic: 'Medium',
      roi: '110% (est)'
    }
  ];

  const metrics = [
    { key: 'score', label: 'AI Business Score', highlight: true },
    { key: 'rent', label: 'Estimated Rent' },
    { key: 'competition', label: 'Competition Level' },
    { key: 'growth', label: 'Growth Potential' },
    { key: 'population', label: 'Target Population' },
    { key: 'accessibility', label: 'Accessibility' },
    { key: 'traffic', label: 'Daily Traffic' },
    { key: 'roi', label: 'Est. 1st Year ROI', highlight: true },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20 pt-4">
      
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setCurrentPage('location-map')}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          &larr; Back to Map
        </button>
        <h1 className="text-2xl font-bold text-foreground">Compare Locations</h1>
      </div>

      <m.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel rounded-[32px] overflow-hidden shadow-sm"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="p-6 border-b border-border/50 bg-muted/20 text-muted-foreground font-medium w-1/4">
                  Metrics
                </th>
                {locations.map(loc => (
                  <th key={loc.id} className="p-6 border-b border-l border-border/50 bg-background w-1/3 min-w-[250px]">
                    <div className="font-bold text-lg text-foreground">{loc.name}</div>
                  </th>
                ))}
                {/* Empty columns if less than 5 locations selected */}
                {Array.from({ length: Math.max(0, 3 - locations.length) }).map((_, i) => (
                  <th key={`empty-${i}`} className="p-6 border-b border-l border-border/50 bg-muted/10 w-1/3">
                    <div className="w-full h-10 border-2 border-dashed border-border/50 rounded-xl flex items-center justify-center text-muted-foreground text-sm cursor-pointer hover:bg-muted/50 transition-colors">
                      + Add Location
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {metrics.map((metric, idx) => (
                <tr key={metric.key} className={idx % 2 === 0 ? 'bg-background' : 'bg-muted/10'}>
                  <td className="p-6 border-b border-border/50 font-medium text-foreground">
                    {metric.label}
                  </td>
                  {locations.map(loc => (
                    <td key={loc.id} className={`p-6 border-b border-l border-border/50 ${metric.highlight ? 'font-bold text-primary' : 'text-muted-foreground'}`}>
                      {loc[metric.key as keyof typeof loc]}
                    </td>
                  ))}
                  {Array.from({ length: Math.max(0, 3 - locations.length) }).map((_, i) => (
                    <td key={`empty-cell-${i}`} className="p-6 border-b border-l border-border/50 bg-muted/5">
                      <Minus className="w-4 h-4 text-muted-foreground/30 mx-auto" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </m.div>

    </div>
  );
};
