import React from 'react';
import { FilterState } from '../types';
import { TYPE_COLORS } from '../constants';

interface FilterBarProps {
  days: string[];
  types: string[];
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
}

export const FilterBar: React.FC<FilterBarProps> = ({ days, types, filters, setFilters }) => {
  return (
    <div className="space-y-6">
      {/* Day Filter */}
      <div>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 pl-1">Itinerary Days</h3>
        <div className="flex space-x-2 overflow-x-auto pb-4 scrollbar-hide px-1">
          <button
            onClick={() => setFilters(prev => ({ ...prev, day: 'All' }))}
            className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all shadow-sm ${
              filters.day === 'All'
                ? 'bg-slate-800 text-white shadow-lg scale-105'
                : 'bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-700'
            }`}
          >
            Full Trip
          </button>
          {days.sort().map(day => (
            <button
              key={day}
              onClick={() => setFilters(prev => ({ ...prev, day }))}
              className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all shadow-sm ${
                filters.day === day
                  ? 'bg-rose-500 text-white shadow-lg shadow-rose-200 scale-105'
                  : 'bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-700'
              }`}
            >
              {day.replace('Day', 'Day ')}
            </button>
          ))}
        </div>
      </div>

      {/* Type Filter */}
      <div>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 pl-1">Activity Type</h3>
        <div className="flex flex-wrap gap-2 px-1">
          <button
            onClick={() => setFilters(prev => ({ ...prev, type: 'All' }))}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              filters.type === 'All'
                ? 'bg-slate-800 text-white shadow-md'
                : 'bg-white text-slate-500 border border-slate-100 hover:border-slate-300'
            }`}
          >
            All Types
          </button>
          {types.map(type => {
            const isActive = filters.type === type;
            const colorClass = TYPE_COLORS[type] || 'bg-gray-100 text-gray-800';
            
            // Extract just the bg and text color for the inactive state style (approximate)
            // Or just use a standard pill style
            return (
              <button
                key={type}
                onClick={() => setFilters(prev => ({ ...prev, type }))}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                   isActive 
                    ? `${colorClass} shadow-md scale-105 border-transparent` 
                    : 'bg-white text-slate-500 border-slate-100 hover:bg-slate-50'
                }`}
              >
                {type}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};