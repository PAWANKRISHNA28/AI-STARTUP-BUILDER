import React, { useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { Map, BarChart2, MessageSquare, Briefcase, Plus, Network } from 'lucide-react';
import { useUIStore } from '../store/useUIStore';

export const FlowMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const setCurrentPage = useUIStore(state => state.setCurrentPage);

  const menuItems = [
    { id: 'chat', icon: <MessageSquare className="w-5 h-5" />, label: 'AI Chat', color: 'bg-blue-500' },
    { id: 'business-visualization', icon: <Network className="w-5 h-5" />, label: 'Visualizer', color: 'bg-purple-500' },
    { id: 'location-map', icon: <Map className="w-5 h-5" />, label: 'Map', color: 'bg-green-500' },
    { id: 'analytics', icon: <BarChart2 className="w-5 h-5" />, label: 'Analytics', color: 'bg-orange-500' },
    { id: 'projects', icon: <Briefcase className="w-5 h-5" />, label: 'Projects', color: 'bg-teal-500' },
  ];

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleNavigate = (page: string) => {
    setCurrentPage(page as any);
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-end justify-end">
      <AnimatePresence>
        {isOpen && (
          <m.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="flex flex-col gap-3 mb-4 items-end"
          >
            {menuItems.map((item, index) => (
              <m.button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05, type: 'spring', stiffness: 300, damping: 24 }}
                whileHover={{ scale: 1.05, x: -5 }}
                whileTap={{ scale: 0.95 }}
                className="group flex items-center gap-3"
              >
                <span className="px-3 py-1.5 rounded-lg bg-card/80 backdrop-blur-md border border-white/10 text-sm font-medium shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.label}
                </span>
                <div className={`w-12 h-12 rounded-full ${item.color} text-white flex items-center justify-center shadow-lg shadow-${item.color.split('-')[1]}-500/30 border border-white/20`}>
                  {item.icon}
                </div>
              </m.button>
            ))}
          </m.div>
        )}
      </AnimatePresence>
      
      <m.button
        onClick={toggleMenu}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={{ rotate: isOpen ? 45 : 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-[0_0_20px_rgba(var(--primary-rgb),0.5)] border border-white/20 z-10"
      >
        <Plus className="w-6 h-6" />
      </m.button>
    </div>
  );
};
