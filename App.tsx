import React, { useState, useEffect, useMemo } from 'react';
import { TripEvent, FilterState } from './types';
import { RAW_CSV_DATA } from './constants';
import { parseCSV } from './utils/csvParser';
import { EventCard } from './components/EventCard';
import { FilterBar } from './components/FilterBar';
import { MapPreview } from './components/MapPreview';
import { LinkSelectionModal } from './components/LinkSelectionModal';
import { TripMap } from './components/TripMap';
import { Calendar, Map, Plane, Sparkles, X } from 'lucide-react';

const App: React.FC = () => {
  const [events, setEvents] = useState<TripEvent[]>([]);
  const [filters, setFilters] = useState<FilterState>({ day: 'All', type: 'All' });
  const [activeEvent, setActiveEvent] = useState<TripEvent | null>(null);
  const [showMobileMap, setShowMobileMap] = useState(false);
  const [showTripMap, setShowTripMap] = useState(false);
  const [linkSelection, setLinkSelection] = useState<string[] | null>(null);

  useEffect(() => {
    const parsedData = parseCSV(RAW_CSV_DATA);
    setEvents(parsedData);
  }, []);

  // Set initial active event when filtered list changes if none selected or if selected is filtered out
  useEffect(() => {
    if (events.length > 0 && !activeEvent) {
      // Optional: set the first event as active initially? 
      // Let's keep it null so the map asks for selection, which is clearer
    }
  }, [events]);

  const uniqueDays = useMemo(() => {
    return Array.from(new Set(events.map(e => e.day))).sort();
  }, [events]);

  const uniqueTypes = useMemo(() => {
    return Array.from(new Set(events.map(e => e.type))).filter(t => t && t !== 'Unknown').sort();
  }, [events]);

  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const dayMatch = filters.day === 'All' || event.day === filters.day;
      const typeMatch = filters.type === 'All' || event.type === filters.type;
      return dayMatch && typeMatch;
    });
  }, [events, filters]);

  const groupedEvents = useMemo(() => {
    const groups: Record<string, TripEvent[]> = {};
    const daySorter = (a: string, b: string) => {
      const numA = parseInt(a.replace('Day', '')) || 0;
      const numB = parseInt(b.replace('Day', '')) || 0;
      return numA - numB;
    };
    const sortedDays = [...uniqueDays].sort(daySorter);
    sortedDays.forEach(day => {
      const dayEvents = filteredEvents.filter(e => e.day === day);
      if (dayEvents.length > 0) {
        groups[day] = dayEvents;
      }
    });
    return groups;
  }, [filteredEvents, uniqueDays]);

  const handleShowMap = (event: TripEvent) => {
    setActiveEvent(event);
    setShowMobileMap(true);
  };

  const handleOpenLinks = (links: string[]) => {
    setLinkSelection(links);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-slate-800 font-sans selection:bg-rose-200">

      {/* Cozy Header */}
      <header className="bg-gradient-to-r from-rose-400 via-orange-400 to-amber-400 text-white shadow-lg shadow-orange-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 backdrop-blur-sm p-2.5 rounded-2xl border border-white/30">
              <Plane className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white drop-shadow-sm flex items-center gap-2">
                Fukuoka Trip <Sparkles className="w-4 h-4 text-yellow-200" />
              </h1>
              <p className="text-sm font-medium text-rose-50 opacity-90">VZ-810 (27/12/25)</p>
              <p className="text-sm font-medium text-rose-50 opacity-90">VZ-811 (03/01/26)</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowTripMap(true)}
              className="bg-yellow-400/90 hover:bg-yellow-300 text-amber-900 px-4 py-2 rounded-xl text-sm font-bold border border-yellow-200/50 shadow-lg shadow-orange-500/20 transition-all flex items-center gap-2 active:scale-95 hover:scale-105"
            >
              <Map className="w-4 h-4" />
              <span className="hidden sm:inline">Open Trip Map</span>
              <span className="sm:hidden">Map</span>
            </button>

            <div className="hidden sm:block">
              <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl text-sm font-semibold border border-white/20">
                {filteredEvents.length} Gems Found
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Filters Area */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-sm border border-slate-200/60 p-6 mb-8">
          <FilterBar
            days={uniqueDays}
            types={uniqueTypes}
            filters={filters}
            setFilters={setFilters}
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">

          {/* Left: Scrollable Itinerary */}
          <div className="w-full lg:w-3/5 space-y-10">
            {Object.keys(groupedEvents).length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Map className="w-10 h-10 text-slate-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-600">No activities found</h3>
                <p className="text-slate-400 mt-2">Try adjusting your filters to see more results.</p>
              </div>
            ) : (
              Object.entries(groupedEvents).map(([day, dayEvents]: [string, TripEvent[]]) => (
                <div key={day} className="relative">
                  {/* Day Header Pill */}
                  <div className="sticky top-24 z-30 mb-6 flex justify-start">
                    <div className="inline-flex items-center gap-2 bg-slate-800 text-white px-6 py-2.5 rounded-full shadow-xl shadow-slate-900/10 border-2 border-white">
                      <Calendar className="w-4 h-4 text-orange-300" />
                      <span className="font-bold tracking-wide">{day.replace('Day', 'Day ')}</span>
                    </div>
                  </div>

                  {/* Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pl-4 border-l-2 border-slate-200/60 ml-8 pb-8">
                    {dayEvents.map((event) => (
                      <EventCard
                        key={event.id}
                        event={event}
                        isActive={activeEvent?.id === event.id}
                        onSelect={setActiveEvent}
                        onShowMap={handleShowMap}
                        onOpenLinks={handleOpenLinks}
                      />
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Right: Sticky Map Dashboard (Desktop Only) */}
          <div className="hidden lg:block lg:w-2/5 lg:sticky lg:top-24 lg:h-[calc(100vh-8rem)]">
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden h-full flex flex-col">
              <div className="bg-slate-50 border-b border-slate-100 p-4 flex items-center justify-between">
                <h2 className="font-bold text-slate-700 flex items-center gap-2">
                  <Map className="w-5 h-5 text-rose-500" />
                  Live Location
                </h2>
                {activeEvent && (
                  <span className="text-xs font-semibold bg-indigo-100 text-indigo-700 px-2 py-1 rounded-lg">
                    {activeEvent.day}
                  </span>
                )}
              </div>
              <div className="flex-1 relative bg-slate-100">
                <MapPreview event={activeEvent} />
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Mobile Map Modal */}
      {showMobileMap && activeEvent && (
        <div className="fixed inset-0 z-[60] lg:hidden flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          {/* Close overlay on backdrop click */}
          <div className="absolute inset-0" onClick={() => setShowMobileMap(false)} />

          <div className="bg-white w-full h-[90%] rounded-3xl shadow-2xl flex flex-col overflow-hidden relative animate-in slide-in-from-bottom-10 sm:zoom-in-95 duration-200 z-10">
            {/* Header */}
            <div className="bg-slate-50 border-b border-slate-100 p-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="bg-rose-100 p-2 rounded-full text-rose-600">
                  <Map className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h2 className="font-bold text-slate-800 text-sm">Live Location</h2>
                  <p className="text-xs text-slate-500 truncate">{activeEvent.name}</p>
                </div>
              </div>
              <button
                onClick={() => setShowMobileMap(false)}
                className="p-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-full text-slate-500 hover:text-slate-800 transition-colors shadow-sm"
                aria-label="Close Map"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Map Content */}
            <div className="flex-1 relative bg-slate-100">
              <MapPreview event={activeEvent} />
            </div>
          </div>
        </div>
      )}

      {/* Link Selection Modal */}
      {linkSelection && (
        <LinkSelectionModal
          links={linkSelection}
          onClose={() => setLinkSelection(null)}
        />
      )}

      {/* Full Trip Map Modal */}
      {showTripMap && (
        <TripMap
          events={events}
          onClose={() => setShowTripMap(false)}
        />
      )}
    </div>
  );
};

export default App;