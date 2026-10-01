import React, { useState } from 'react';
import { m } from 'framer-motion';
import Tilt from 'react-parallax-tilt';
import { MapPin, Search, Navigation, Clock, Star, Building2, Wallet, Users, ChevronRight } from 'lucide-react';
import { useUIStore } from '../store/useUIStore';

export const LocationIntelligencePage: React.FC = () => {
  const setCurrentPage = useUIStore(state => state.setCurrentPage);
  
  const [businessType, setBusinessType] = useState('');
  const [location, setLocation] = useState('');
  const [budget, setBudget] = useState('');
  const [businessSize, setBusinessSize] = useState('');

  const handleAnalyze = () => {
    // In a real flow, we'd pass this to the store or URL params
    setCurrentPage('location-search');
  };

  const recentSearches = [
    { id: 1, type: 'Coffee Shop', location: 'Downtown Austin, TX', date: '2 hours ago' },
    { id: 2, type: 'Boutique Gym', location: 'SoHo, New York, NY', date: 'Yesterday' },
  ];

  const favoriteLocations = [
    { id: 1, name: 'Tech Hub Plot', address: '1200 Tech Blvd, SF', score: 92 },
    { id: 2, name: 'Retail Corner', address: '5th Avenue Mall', score: 88 },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      
      {/* Hero Section */}
      <section className="text-center space-y-6 pt-10">
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 font-medium text-sm border border-blue-100"
        >
          <MapPin className="w-4 h-4" />
          <span>AI-Powered Location Intelligence</span>
        </m.div>
        
        <m.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-6xl font-extrabold text-foreground tracking-tight"
        >
          Find the Perfect <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500">Business Location</span>
        </m.h1>
        
        <m.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
        >
          Use AI and geospatial analysis to identify the best place to launch or expand your business. Maximize ROI and minimize risk.
        </m.p>
      </section>

      {/* Main Search Card */}
      <m.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card-premium p-8 md:p-10 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Building2 className="w-4 h-4 text-muted-foreground" /> Business Type
            </label>
            <input 
              type="text" 
              placeholder="e.g. Coffee Shop, Yoga Studio..." 
              value={businessType}
              onChange={(e) => setBusinessType(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-border/50 bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground flex items-center gap-2">
              <MapPin className="w-4 h-4 text-muted-foreground" /> Target City / Location
            </label>
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Enter city or neighborhood..." 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-border/50 bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
              <button className="px-4 py-3 rounded-xl bg-muted/50 hover:bg-muted text-muted-foreground transition-colors flex items-center justify-center shrink-0" title="Use My Location">
                <Navigation className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Wallet className="w-4 h-4 text-muted-foreground" /> Investment Budget
            </label>
            <select 
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-border/50 bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            >
              <option value="">Select Budget Range</option>
              <option value="low">Under $50,000</option>
              <option value="medium">$50,000 - $250,000</option>
              <option value="high">$250,000 - $1M</option>
              <option value="enterprise">$1M+</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Users className="w-4 h-4 text-muted-foreground" /> Expected Business Size
            </label>
            <select 
              value={businessSize}
              onChange={(e) => setBusinessSize(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-border/50 bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            >
              <option value="">Select Size</option>
              <option value="micro">Micro (1-5 employees)</option>
              <option value="small">Small (6-20 employees)</option>
              <option value="medium">Medium (21-50 employees)</option>
              <option value="large">Large (50+ employees)</option>
            </select>
          </div>

          <div className="md:col-span-2 pt-4">
            <button 
              onClick={handleAnalyze}
              className="w-full py-4 rounded-xl btn-primary font-bold text-lg hover:scale-105 transition-all flex items-center justify-center gap-2 shadow-premium"
            >
              <Search className="w-5 h-5" />
              Analyze Locations
            </button>
          </div>

        </div>
      </m.section>

      {/* History & Favorites */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
        
        {/* Recent Searches */}
        <m.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-4"
        >
          <h3 className="text-lg font-bold flex items-center gap-2 text-foreground">
            <Clock className="w-5 h-5 text-blue-500" /> Recent Searches
          </h3>
          <div className="space-y-3">
            {recentSearches.map(search => (
              <Tilt key={search.id} tiltMaxAngleX={5} tiltMaxAngleY={5} scale={1.02} transitionSpeed={2500}>
                <div className="card-premium p-4 flex items-center justify-between cursor-pointer hover:border-primary/50 transition-all group">
                  <div>
                    <p className="font-bold text-foreground">{search.type}</p>
                    <p className="text-sm font-semibold text-muted-foreground">{search.location}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-semibold text-muted-foreground">{search.date}</span>
                    <div className="w-8 h-8 rounded-full bg-white/40 shadow-inner flex items-center justify-center group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </Tilt>
            ))}
          </div>
        </m.div>

        {/* Favorite Locations */}
        <m.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-4"
        >
          <h3 className="text-lg font-bold flex items-center gap-2 text-foreground">
            <Star className="w-5 h-5 text-amber-500 fill-amber-500" /> Favorite Locations
          </h3>
          <div className="space-y-3">
            {favoriteLocations.map(fav => (
              <Tilt key={fav.id} tiltMaxAngleX={5} tiltMaxAngleY={5} scale={1.02} transitionSpeed={2500}>
                <div className="card-premium p-4 flex items-center justify-between cursor-pointer hover:border-primary/50 transition-all group">
                  <div>
                    <p className="font-bold text-foreground">{fav.name}</p>
                    <p className="text-sm font-semibold text-muted-foreground">{fav.address}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 font-black text-sm shadow-inner">
                      {fav.score}
                    </div>
                    <div className="w-8 h-8 rounded-full bg-white/40 shadow-inner flex items-center justify-center group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </Tilt>
            ))}
          </div>
        </m.div>

      </div>

    </div>
  );
};
