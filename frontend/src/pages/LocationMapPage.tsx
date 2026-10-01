import React, { useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { GoogleMap, useJsApiLoader, Marker, HeatmapLayer } from '@react-google-maps/api';
import { useUIStore } from '../store/useUIStore';
import { MapPin, Navigation, TrendingUp, Users, DollarSign, Activity, AlertTriangle, X } from 'lucide-react';

const containerStyle = {
  width: '100%',
  height: '100%'
};

const center = {
  lat: 37.7749,
  lng: -122.4194
};

export const LocationMapPage: React.FC = () => {
  const setCurrentPage = useUIStore(state => state.setCurrentPage);
  
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: (import.meta as any).env.VITE_GOOGLE_MAPS_API_KEY || "dummy_key",
    libraries: ['visualization']
  });

  const [selectedLocation, setSelectedLocation] = useState<any | null>(null);
  
  const mockLocations = React.useMemo(() => [
    { id: 1, lat: 37.7749, lng: -122.4194, score: 92, rent: '$5,000', footfall: 'High', pros: ['Near Transit', 'High Income Area'], cons: ['High Rent'] },
    { id: 2, lat: 37.7849, lng: -122.4094, score: 85, rent: '$4,200', footfall: 'Medium', pros: ['Growing Area'], cons: ['High Competition'] },
  ], []);

  return (
    <div className="h-[calc(100vh-8rem)] relative flex flex-col md:flex-row gap-4">
      
      {/* Map Container */}
      <div className="flex-1 rounded-[32px] overflow-hidden shadow-2xl shadow-primary/10 border border-white/50 relative bg-muted group">
        {/* HUD OVERLAY */}
        <div className="absolute top-6 left-6 z-10 pointer-events-none flex flex-col gap-4">
          <div className="card-premium px-4 py-2 rounded-full flex items-center gap-2 shadow-lg animate-pulse">
            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10B981]" />
            <span className="text-xs font-bold text-heading">Satellite Link Active</span>
          </div>
          <div className="card-premium p-4 rounded-3xl w-48">
            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Global Traffic</div>
            <div className="text-2xl font-bold text-primary">8.4M</div>
            <div className="w-full bg-white/50 h-1 mt-2 rounded-full overflow-hidden">
              <m.div initial={{ width: 0 }} animate={{ width: '70%' }} transition={{ duration: 2, ease: 'easeOut' }} className="h-full bg-primary" />
            </div>
          </div>
        </div>
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={13}
            options={{
              disableDefaultUI: true,
              zoomControl: true,
              styles: [
                { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] }
              ]
            }}
          >
            {mockLocations.map(loc => (
              <Marker 
                key={loc.id} 
                position={{ lat: loc.lat, lng: loc.lng }} 
                onClick={() => setSelectedLocation(loc)}
              />
            ))}
          </GoogleMap>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}
      </div>

      {/* Side Panel */}
      <AnimatePresence>
        {selectedLocation && (
          <m.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="w-full md:w-96 card-premium p-6 flex flex-col overflow-y-auto relative"
          >
            {/* Holographic scanning line removed for performance */}
            
            <div className="flex justify-between items-start mb-6 relative z-10">
              <div>
                <h2 className="text-xl font-bold">Location Insight</h2>
                <p className="text-sm text-muted-foreground">Coordinates: {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}</p>
              </div>
              <button onClick={() => setSelectedLocation(null)} className="p-1 hover:bg-muted rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center justify-center p-4 bg-gradient-to-tr from-emerald-100/50 to-emerald-50/50 rounded-[24px] border border-emerald-200/50 mb-6 relative z-10 shadow-inner">
              <div className="text-center">
                <div className="text-4xl font-extrabold text-emerald-600">{selectedLocation.score}</div>
                <div className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">AI Score</div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-background rounded-xl border border-border/50">
                  <div className="text-xs text-muted-foreground flex items-center gap-1"><DollarSign className="w-3 h-3"/> Rent Est.</div>
                  <div className="font-semibold">{selectedLocation.rent}</div>
                </div>
                <div className="p-3 bg-background rounded-xl border border-border/50">
                  <div className="text-xs text-muted-foreground flex items-center gap-1"><Users className="w-3 h-3"/> Footfall</div>
                  <div className="font-semibold">{selectedLocation.footfall}</div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-2 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-emerald-500"/> Advantages</h4>
                <ul className="space-y-1">
                  {selectedLocation.pros.map((pro: string, i: number) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-center gap-2 before:content-[''] before:w-1.5 before:h-1.5 before:bg-emerald-500 before:rounded-full">{pro}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-2 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-amber-500"/> Challenges</h4>
                <ul className="space-y-1">
                  {selectedLocation.cons.map((con: string, i: number) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-center gap-2 before:content-[''] before:w-1.5 before:h-1.5 before:bg-amber-500 before:rounded-full">{con}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-auto pt-6 space-y-3">
              <button 
                onClick={() => setCurrentPage('location-compare')}
                className="w-full py-3 rounded-xl bg-white/40 text-foreground font-bold hover:bg-white/60 transition-colors border border-white/50 shadow-inner"
              >
                Add to Comparison
              </button>
              <button
                className="w-full py-3 rounded-2xl btn-primary text-xs font-bold transition-all hover:scale-105 shadow-premium"
              >
                Run Financial Simulation
              </button>
            </div>
          </m.div>
        )}
      </AnimatePresence>

      {!selectedLocation && (
        <div className="hidden md:flex w-96 flex-col items-center justify-center text-center p-8 card-premium text-muted-foreground">
          <m.div>
            <MapPin className="w-16 h-16 mb-6 text-primary opacity-40" />
          </m.div>
          <p className="font-medium">Tap a geospatial node to initialize deep AI analysis.</p>
        </div>
      )}

    </div>
  );
};
