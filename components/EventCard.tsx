import React from 'react';
import { TripEvent } from '../types';
import { TYPE_COLORS } from '../constants';
import { MapPin, ExternalLink, Clock, DollarSign, StickyNote, Globe } from 'lucide-react';

interface EventCardProps {
  event: TripEvent;
  isActive?: boolean;
  onSelect?: (event: TripEvent) => void;
  onShowMap?: (event: TripEvent) => void;
  onOpenLinks?: (links: string[]) => void;
}

export const EventCard: React.FC<EventCardProps> = ({ event, isActive, onSelect, onShowMap, onOpenLinks }) => {
  const typeColor = TYPE_COLORS[event.type] || TYPE_COLORS['Unknown'];
  
  // Parse Links
  const allLinks = event.link.split(',').map(l => l.trim()).filter(l => l.length > 0);
  
  const mapLinks = allLinks.filter(l => 
    l.includes('google.com/maps') || 
    l.includes('maps.app.goo.gl') || 
    l.includes('goo.gl/maps')
  );
  
  const otherLinks = allLinks.filter(l => !mapLinks.includes(l));

  const hasMap = mapLinks.length > 0;
  const hasOther = otherLinks.length > 0;

  return (
    <div 
        onClick={() => onSelect && onSelect(event)}
        className={`
            relative flex flex-col gap-3 p-5 rounded-2xl transition-all duration-300 cursor-pointer
            ${isActive 
                ? 'bg-white shadow-lg ring-2 ring-indigo-400/50 scale-[1.02] z-10' 
                : 'bg-white shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 hover:shadow-lg hover:-translate-y-1'
            }
        `}
    >
      <div className={`absolute top-4 right-4 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${typeColor} bg-opacity-50`}>
        {event.type || 'General'}
      </div>
      
      <div className="mt-1">
        <h3 className={`text-lg font-bold pr-20 leading-snug ${isActive ? 'text-indigo-900' : 'text-slate-800'}`}>
          {event.name}
        </h3>
        {event.timeFrame && (
          <div className="flex items-center text-sm text-slate-500 mt-2 font-medium">
            <Clock className="w-4 h-4 mr-1.5 text-slate-400" />
            <span>{event.timeFrame}</span>
          </div>
        )}
      </div>

      {(event.notes || event.price) && (
        <div className={`rounded-xl p-3 text-sm flex flex-col gap-2 ${isActive ? 'bg-indigo-50/50' : 'bg-slate-50'}`}>
          {event.price && (
            <div className="flex items-center text-slate-700 font-semibold">
              <DollarSign className="w-4 h-4 mr-1.5 text-slate-400" />
              <span>{event.price}</span>
            </div>
          )}
          {event.notes && (
            <div className="flex items-start text-slate-600 leading-relaxed">
              <StickyNote className="w-4 h-4 mr-1.5 mt-0.5 text-slate-400 shrink-0" />
              <p className="whitespace-pre-wrap">{event.notes}</p>
            </div>
          )}
        </div>
      )}

      {/* Action Buttons Area */}
      {(hasMap || hasOther) && (
        <div className="mt-auto pt-2 flex gap-2">
           
           {/* Case A: Has Map Link */}
           {hasMap && (
             <>
               <button
                 onClick={(e) => {
                     e.stopPropagation();
                     if (onShowMap) onShowMap(event);
                 }}
                 className="flex-1 inline-flex items-center justify-center py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-colors"
               >
                  <MapPin className="w-4 h-4 mr-2" />
                  Show on Map
               </button>
               
               {/* Secondary Button for Other Links when Map exists */}
               {hasOther && (
                 <button
                    onClick={(e) => {
                        e.stopPropagation();
                        if (otherLinks.length === 1) {
                            window.open(otherLinks[0], '_blank');
                        } else if (onOpenLinks) {
                            onOpenLinks(otherLinks);
                        }
                    }}
                    className="inline-flex items-center justify-center w-10 h-10 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-xl transition-colors"
                    title="Open Other Links"
                 >
                    <ExternalLink className="w-4 h-4" />
                 </button>
               )}
             </>
           )}

           {/* Case B: No Map Link, but has Other Links */}
           {!hasMap && hasOther && (
              <button
                onClick={(e) => {
                    e.stopPropagation();
                    if (otherLinks.length === 1) {
                        window.open(otherLinks[0], '_blank');
                    } else if (onOpenLinks) {
                        onOpenLinks(otherLinks);
                    }
                }}
                className="flex-1 inline-flex items-center justify-center py-2 px-4 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-sm font-semibold rounded-xl transition-colors"
              >
                 <Globe className="w-4 h-4 mr-2" />
                 Open Link
              </button>
           )}

        </div>
      )}
    </div>
  );
};