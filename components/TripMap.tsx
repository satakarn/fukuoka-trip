import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { TripEvent } from '../types';
import { getCoordinates } from '../utils/coordinates';
import { TYPE_COLORS } from '../constants';
import { X, Map as MapIcon } from 'lucide-react';

interface TripMapProps {
  events: TripEvent[];
  onClose: () => void;
}

// Helper to extract color hex from tailwind classes in TYPE_COLORS
// This is a rough mapping since we only have class names in constants
const getTypeColorHex = (type: string) => {
  const colorMap: Record<string, string> = {
    'Accomodation': '#4f46e5', // indigo-600
    'Hotel': '#4f46e5',
    'Food': '#ea580c', // orange-600
    'Transportation': '#475569', // slate-600
    'Historic': '#57534e', // stone-600
    'Relax / Chill': '#0d9488', // teal-600
    'Fun / Touristy': '#e11d48', // rose-600
    'Local Places': '#65a30d', // lime-600
    'Cafe': '#d97706', // amber-600
    'Activity': '#0284c7', // sky-600
    'Pictures': '#a21caf', // fuchsia-600
    'Other': '#4b5563', // gray-600
    'Unknown': '#9ca3af',
  };
  return colorMap[type] || '#64748b';
};

export const TripMap: React.FC<TripMapProps> = ({ events, onClose }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [loadedCount, setLoadedCount] = useState(0);

  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Initialize Map
    // Center on Fukuoka initially
    const map = L.map(mapContainerRef.current).setView([33.5902, 130.4017], 10);
    mapInstanceRef.current = map;

    // Add Tile Layer (OpenStreetMap)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(map);

    // Add Markers
    const bounds = L.latLngBounds([]);
    let count = 0;

    events.forEach(event => {
      // Extract query from link if available to help matching
      let linkQuery = '';
      if (event.link.includes('query=')) {
        try {
            const url = new URL(event.link.trim().split(',')[0]); // Take first link
            linkQuery = url.searchParams.get('query') || '';
        } catch (e) {}
      }

      const coords = getCoordinates(event.name, linkQuery);

      if (coords) {
        count++;
        const color = getTypeColorHex(event.type);
        
        const marker = L.circleMarker(coords, {
          radius: 8,
          fillColor: color,
          color: '#fff',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.9
        }).addTo(map);

        const popupContent = `
          <div class="font-sans">
            <div class="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">${event.day} • ${event.type}</div>
            <h3 class="font-bold text-slate-800 text-sm mb-1">${event.name}</h3>
            ${event.timeFrame ? `<div class="text-xs text-slate-500">${event.timeFrame}</div>` : ''}
          </div>
        `;

        marker.bindPopup(popupContent);
        bounds.extend(coords);
      }
    });

    setLoadedCount(count);

    if (count > 0) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }
    
    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [events]);

  return (
    <div className="fixed inset-0 z-[80] flex flex-col bg-white animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between shadow-sm z-10">
        <div className="flex items-center gap-3">
            <div className="bg-amber-100 p-2 rounded-xl text-amber-600">
                <MapIcon className="w-5 h-5" />
            </div>
            <div>
                <h2 className="font-bold text-slate-800">Trip Map</h2>
                <p className="text-xs text-slate-500">{loadedCount} locations pinned</p>
            </div>
        </div>
        <button 
            onClick={onClose}
            className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-600 transition-colors"
        >
            <X className="w-6 h-6" />
        </button>
      </div>
      
      {/* Map Container */}
      <div className="flex-1 relative bg-slate-100">
         <div ref={mapContainerRef} className="absolute inset-0 z-0" />
         
         {/* Legend Overlay */}
         <div className="absolute bottom-6 left-4 right-4 sm:left-6 sm:right-auto z-[400] bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/50 max-h-40 overflow-y-auto sm:max-w-xs">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Legend</h4>
            <div className="flex flex-wrap gap-2">
                {['Fun / Touristy', 'Food', 'Historic', 'Relax / Chill', 'Hotel'].map(type => (
                    <div key={type} className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-md border border-slate-100 shadow-sm">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: getTypeColorHex(type) }}></span>
                        <span className="text-[10px] font-bold text-slate-600">{type}</span>
                    </div>
                ))}
            </div>
         </div>
      </div>
    </div>
  );
};