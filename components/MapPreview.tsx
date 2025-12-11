import React, { useMemo } from 'react';
import { TripEvent } from '../types';
import { MapPin, Map as MapIcon, ExternalLink, Navigation } from 'lucide-react';

interface MapPreviewProps {
  event: TripEvent | null;
}

export const MapPreview: React.FC<MapPreviewProps> = ({ event }) => {
  const mapData = useMemo(() => {
    if (!event) return { status: 'empty' as const };

    const links = event.link.split(',').map(l => l.trim());
    const mapLink = links.find(l =>
      l.includes('google.com/maps') ||
      l.includes('maps.app.goo.gl') ||
      l.includes('goo.gl/maps')
    );

    if (!mapLink) {
      return { status: 'no-location' as const, name: event.name };
    }

    // Attempt to extract a query for the embed
    // 1. Look for `q` or `query` param
    // 2. Look for `place/Name/@coords` structure if possible (hard with regex on complex urls)

    let embedQuery: string | null = null;

    try {
      const urlObj = new URL(mapLink);
      embedQuery = urlObj.searchParams.get('q') || urlObj.searchParams.get('query');
    } catch (e) {
      // Fallback for some malformed or simple strings if passed, though usually valid URLs
    }

    // Special handling: if we have a map link but no query (e.g. short link), 
    // we cannot embed it directly. 
    // Status 'link-only' means we show a button to open it.
    // Status 'embed' means we show the iframe.

    if (embedQuery) {
      return { status: 'embed' as const, query: embedQuery, url: mapLink, name: event.name };
    } else {
      return { status: 'link-only' as const, url: mapLink, name: event.name };
    }

  }, [event]);

  if (mapData.status === 'empty') {
    return (
      <div className="h-full w-full bg-slate-100 flex flex-col items-center justify-center text-slate-400 p-8 text-center animate-in fade-in duration-300">
        <div className="bg-white p-4 rounded-full shadow-sm mb-4">
          <MapIcon className="w-8 h-8 text-slate-300" />
        </div>
        <p className="font-medium text-slate-500">Select an activity to view location</p>
      </div>
    );
  }

  if (mapData.status === 'no-location') {
    return (
      <div className="h-full w-full bg-slate-50 flex flex-col items-center justify-center text-slate-500 p-8 text-center animate-in fade-in duration-300">
        <div className="bg-slate-100 p-4 rounded-full mb-4 border border-slate-200">
          <MapPin className="w-8 h-8 text-slate-300" />
        </div>
        <h3 className="font-bold text-slate-700 mb-1">No Location Data</h3>
        <p className="text-sm text-slate-400 max-w-xs">
          "{mapData.name}" does not have a specific map link attached.
        </p>
      </div>
    );
  }

  if (mapData.status === 'link-only') {
    return (
      <div className="h-full w-full bg-slate-50 flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-300">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 max-w-sm w-full">
          <div className="mx-auto bg-rose-50 w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <Navigation className="w-8 h-8 text-rose-500" />
          </div>
          <h3 className="font-bold text-lg text-slate-800 mb-2">{mapData.name}</h3>
          <p className="text-sm text-slate-500 mb-6">
            The point-to-point Maps route for this location can’t be previewed here.
          </p>
          <a
            href={mapData.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-full py-3 px-4 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-bold transition-all shadow-lg shadow-rose-200 active:scale-95"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Open in Google Maps
          </a>
        </div>
      </div>
    );
  }

  // Embed Status
  return (
    <div className="h-full w-full relative bg-slate-50 animate-in fade-in duration-500">
      <div className="absolute top-4 left-4 right-4 z-10 bg-white/90 backdrop-blur-sm p-3 rounded-xl shadow-sm border border-slate-100 flex justify-between items-center">
        <div className="min-w-0 pr-2">
          <h3 className="font-bold text-slate-800 truncate text-sm">{mapData.name}</h3>
        </div>
        <a
          href={mapData.url}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors"
          title="Open in Google Maps"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
      <iframe
        width="100%"
        height="100%"
        frameBorder="0"
        style={{ border: 0 }}
        src={`https://maps.google.com/maps?q=${encodeURIComponent(mapData.query || '')}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
        allowFullScreen
        loading="lazy"
        title={`Map of ${mapData.name}`}
      ></iframe>
    </div>
  );
};