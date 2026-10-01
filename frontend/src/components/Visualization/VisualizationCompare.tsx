import React from 'react';
import { m } from 'framer-motion';
import { VisualizationImage } from '../../types';
import { X, Check } from 'lucide-react';

interface Props {
  compareList: VisualizationImage[];
  onRemove: (id: string) => void;
}

export const VisualizationCompare: React.FC<Props> = ({ compareList, onRemove }) => {
  if (compareList.length === 0) {
    return null;
  }

  // Generate some mock comparison stats based on the concept names to show variation
  const getStats = (conceptName: string) => {
    const hash = conceptName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return {
      cost: `$${(hash % 5 + 1) * 20}k - $${(hash % 5 + 3) * 30}k`,
      capacity: (hash % 10 + 5) * 10,
      luxuryScore: (hash % 5) + 6, // 6-10
      maintenance: ['Low', 'Medium', 'High'][hash % 3]
    };
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-border/50 p-6 overflow-x-auto">
      <h3 className="text-xl font-bold mb-6">Compare Concepts ({compareList.length}/5)</h3>
      
      <div className="flex gap-6 min-w-max">
        {compareList.map((img, idx) => {
          const stats = getStats(img.concept_name);
          return (
            <m.div 
              key={img.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="w-72 flex flex-col gap-4"
            >
              <div className="relative rounded-xl overflow-hidden aspect-video border border-border/50">
                <img src={img.image_url} alt={img.view_type} className="w-full h-full object-cover" />
                <button 
                  onClick={() => onRemove(img.id)}
                  className="absolute top-2 right-2 p-1 bg-black/50 hover:bg-rose-500 backdrop-blur-md rounded-full text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-lg">{img.concept_name}</h4>
                  <p className="text-sm text-muted-foreground">{img.view_type} • {img.style}</p>
                </div>
                
                <div className="space-y-3 pt-4 border-t border-border/50">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Est. Cost</span>
                    <span className="font-medium text-primary">{stats.cost}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Capacity</span>
                    <span className="font-medium">{stats.capacity} People</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Luxury Score</span>
                    <span className="font-medium flex items-center gap-1">
                      {stats.luxuryScore}/10
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Maintenance</span>
                    <span className={`font-medium px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider ${
                      stats.maintenance === 'Low' ? 'bg-green-100 text-green-700' :
                      stats.maintenance === 'Medium' ? 'bg-amber-100 text-amber-700' :
                      'bg-rose-100 text-rose-700'
                    }`}>
                      {stats.maintenance}
                    </span>
                  </div>
                </div>
                
                <button className="w-full py-2 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-xl font-medium transition-colors text-sm">
                  Select Concept
                </button>
              </div>
            </m.div>
          );
        })}
      </div>
    </div>
  );
};
