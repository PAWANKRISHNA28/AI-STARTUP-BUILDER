import React, { useState, useEffect } from 'react';
import { m } from 'framer-motion';
import Tilt from 'react-parallax-tilt';
import { useUIStore } from '../store/useUIStore';
import { useProjectStore } from '../store/useProjectStore';
import { api } from '../services/api';
import { Building2, Save, Download } from 'lucide-react';
import { VisualizationInputForm } from '../components/Visualization/VisualizationInputForm';
import { VisualizationGallery } from '../components/Visualization/VisualizationGallery';
import { VisualizationCompare } from '../components/Visualization/VisualizationCompare';
import { VisualizationReport } from '../components/Visualization/VisualizationReport';
import { VisualizationImage, VisualizationResponse } from '../types';

export const BusinessVisualizationPage: React.FC = () => {
  const activeProject = useProjectStore(state => state.activeProject);
  const addToast = useUIStore(state => state.addToast);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [data, setData] = useState<VisualizationResponse | null>(null);
  
  const [compareList, setCompareList] = useState<VisualizationImage[]>([]);

  useEffect(() => {
    // If we mount and have an active project, we could fetch history here
    const fetchHistory = async () => {
      if (activeProject) {
        try {
          const history = await api.getVisualizationHistory(activeProject.id);
          if (history && history.length > 0) {
            // Load the most recent one
            setData(history[history.length - 1]);
          }
        } catch (error) {
          console.error("Failed to load visualization history", error);
        }
      }
    };
    fetchHistory();
  }, [activeProject]);

  const handleGenerate = async (formData: any) => {
    if (!activeProject) {
      addToast('error', 'No active project selected.');
      return;
    }

    setIsGenerating(true);
    try {
      const payload = {
        ...formData,
        project_id: activeProject.id
      };
      const res = await api.createVisualization(payload);
      setData(res);
      addToast('success', 'Visualization generated successfully!');
    } catch (error) {
      addToast('error', 'Failed to generate visualization.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleToggleCompare = (image: VisualizationImage) => {
    setCompareList(prev => {
      if (prev.some(c => c.id === image.id)) {
        return prev.filter(c => c.id !== image.id);
      }
      if (prev.length >= 5) {
        addToast('error', 'You can only compare up to 5 concepts.');
        return prev;
      }
      return [...prev, image];
    });
  };

  const handleFavorite = async (imageId: string) => {
    try {
      const res = await api.saveFavoriteVisualization(imageId);
      if (res.status === 'added') {
        addToast('success', 'Added to favorites');
      } else {
        addToast('info', 'Removed from favorites');
      }
    } catch (error) {
      addToast('error', 'Failed to update favorite status');
    }
  };

  if (!activeProject) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
        <div className="w-16 h-16 bg-primary/10 text-primary flex items-center justify-center rounded-full">
          <Building2 className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold">No Active Project</h2>
        <p className="text-muted-foreground max-w-md">
          Please select a project from the sidebar to use the Business Visualization Studio.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Hero Banner */}
      <Tilt tiltMaxAngleX={2} tiltMaxAngleY={2} scale={1.01} transitionSpeed={2500}>
        <div className="bg-gradient-to-r from-primary to-secondary rounded-[32px] p-8 md:p-12 text-white shadow-premium relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 blur-[60px] rounded-full pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-3">
              <h1 className="text-4xl md:text-5xl font-black tracking-tight">Business Visualization Studio</h1>
              <p className="text-white/90 max-w-xl font-medium leading-relaxed">
                Preview your future business before investing. Our AI agents will generate comprehensive exterior, interior, and branding concepts tailored to your requirements.
              </p>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-5 py-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-xl transition-all font-bold hover:scale-105 shadow-inner">
                <Save className="w-4 h-4" /> Save Project
              </button>
              <button className="flex items-center gap-2 px-5 py-2.5 bg-white text-primary hover:bg-white/90 rounded-xl transition-all font-bold hover:scale-105 shadow-premium">
                <Download className="w-4 h-4" /> Export Proposal
              </button>
            </div>
          </div>
        </div>
      </Tilt>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Input Form */}
        <div className="lg:col-span-1 space-y-6">
          <VisualizationInputForm onSubmit={handleGenerate} isGenerating={isGenerating} />
        </div>

        {/* Right Column: Gallery & Results */}
        <div className="lg:col-span-2 space-y-6">
          {!data && !isGenerating && (
            <Tilt tiltMaxAngleX={1} tiltMaxAngleY={1} scale={1.01} transitionSpeed={2500} className="h-full">
              <div className="card-premium p-12 text-center flex flex-col items-center justify-center h-full min-h-[400px]">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 shadow-inner">
                  <Building2 className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-2xl font-black mb-3">Ready to Visualize?</h3>
                <p className="text-muted-foreground max-w-md font-medium leading-relaxed">
                  Fill out the business requirements on the left and our AI Design Agents will generate stunning concepts for your business.
                </p>
              </div>
            </Tilt>
          )}

          {isGenerating && (
             <div className="card-premium p-12 flex flex-col items-center justify-center h-full min-h-[400px]">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-6 shadow-[0_0_15px_rgba(91,140,255,0.5)]" />
                <h3 className="text-xl font-black mb-2 animate-pulse text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">AI Agents are hard at work...</h3>
                <p className="text-muted-foreground font-semibold">Collaborating on Architecture, Interiors, and Branding.</p>
             </div>
          )}

          {data && !isGenerating && (
            <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <VisualizationCompare 
                compareList={compareList} 
                onRemove={(id) => setCompareList(prev => prev.filter(c => c.id !== id))} 
              />
              
              <VisualizationGallery 
                images={data.images} 
                onToggleCompare={handleToggleCompare} 
                compareList={compareList}
                onFavorite={handleFavorite}
              />
              
              <VisualizationReport report={data.report} brand={data.brand_style} />
            </m.div>
          )}
        </div>
      </div>
    </div>
  );
};
