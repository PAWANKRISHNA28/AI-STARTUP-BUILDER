import React, { useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { LayoutGrid, Maximize2, Download, Heart, Columns, X, ZoomIn } from 'lucide-react';
import { VisualizationImage } from '../../types';

interface Props {
  images: VisualizationImage[];
  onToggleCompare: (image: VisualizationImage) => void;
  compareList: VisualizationImage[];
  onFavorite: (imageId: string) => void;
}

export const VisualizationGallery: React.FC<Props> = ({ images, onToggleCompare, compareList, onFavorite }) => {
  const [viewMode, setViewMode] = useState<'grid' | 'carousel'>('grid');
  const [selectedImage, setSelectedImage] = useState<VisualizationImage | null>(null);

  const concepts = Array.from(new Set(images.map(img => img.concept_name)));
  const [activeConcept, setActiveConcept] = useState<string>(concepts[0] || '');

  const filteredImages = images.filter(img => img.concept_name === activeConcept);

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-border/50">
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
          {concepts.map(concept => (
            <button
              key={concept}
              onClick={() => setActiveConcept(concept)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                activeConcept === concept 
                  ? 'bg-primary text-white' 
                  : 'bg-muted/50 text-muted-foreground hover:bg-muted'
              }`}
            >
              {concept}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 hidden sm:flex">
          <button 
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted'}`}
          >
            <LayoutGrid className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setViewMode('carousel')}
            className={`p-2 rounded-lg ${viewMode === 'carousel' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted'}`}
          >
            <Columns className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredImages.map((img, idx) => {
            const isComparing = compareList.some(c => c.id === img.id);
            return (
              <m.div 
                key={img.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="group relative rounded-2xl overflow-hidden bg-white shadow-sm border border-border/50 aspect-video"
              >
                <img src={img.image_url} alt={img.view_type} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                
                {/* Overlay details */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => onFavorite(img.id)}
                      className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-rose-500 transition-colors"
                      title="Favorite"
                    >
                      <Heart className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => setSelectedImage(img)}
                      className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-colors"
                      title="Full Screen"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div>
                    <h4 className="text-white font-medium">{img.view_type}</h4>
                    <p className="text-white/80 text-sm flex justify-between items-center">
                      <span>{img.style}</span>
                      <button 
                        onClick={() => onToggleCompare(img)}
                        className={`text-xs px-2 py-1 rounded-md transition-colors ${
                          isComparing ? 'bg-primary text-white' : 'bg-white/20 backdrop-blur-md text-white hover:bg-white/40'
                        }`}
                      >
                        {isComparing ? 'Comparing' : 'Compare'}
                      </button>
                    </p>
                  </div>
                </div>
              </m.div>
            );
          })}
        </div>
      )}

      {/* Carousel View Placeholder */}
      {viewMode === 'carousel' && (
        <div className="flex overflow-x-auto gap-6 pb-6 snap-x snap-mandatory">
          {filteredImages.map(img => (
            <div key={img.id} className="snap-center shrink-0 w-[80%] md:w-[60%] lg:w-[40%] rounded-2xl overflow-hidden relative border border-border/50">
              <img src={img.image_url} alt={img.view_type} className="w-full aspect-video object-cover" />
              <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                <h4 className="text-white font-medium">{img.view_type}</h4>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Full Screen Modal */}
      <AnimatePresence>
        {selectedImage && (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
          >
            <button 
              onClick={() => setSelectedImage(null)}
              className="absolute top-6 right-6 p-2 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            
            <img 
              src={selectedImage.image_url} 
              alt={selectedImage.view_type}
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
            />
            
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/50 backdrop-blur-md px-6 py-3 rounded-full text-white">
              <span className="font-medium">{selectedImage.concept_name} - {selectedImage.view_type}</span>
              <div className="w-px h-4 bg-white/20" />
              <button className="flex items-center gap-2 text-sm hover:text-primary transition-colors">
                <Download className="w-4 h-4" /> Download
              </button>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
};
