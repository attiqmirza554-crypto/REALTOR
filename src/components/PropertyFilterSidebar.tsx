import React from 'react';
import { RotateCcw, Filter, Search, Check } from 'lucide-react';
import { FilterState } from '../types';

interface PropertyFilterSidebarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  onResetFilters: () => void;
  totalResults: number;
}

export default function PropertyFilterSidebar({
  filters,
  setFilters,
  onResetFilters,
  totalResults
}: PropertyFilterSidebarProps) {
  const propertyTypes = ['Villa', 'Penthouse', 'Mansion', 'Chateau', 'Apartment'];
  const locations = [
    'All',
    'Beverly Hills',
    'Manhattan',
    'Palm Jumeirah',
    'Malibu',
    'Aspen',
    'Saint-Tropez'
  ];

  const handleTypeToggle = (type: string) => {
    if (filters.propertyType === type) {
      setFilters({ ...filters, propertyType: 'All' });
    } else {
      setFilters({ ...filters, propertyType: type });
    }
  };

  return (
    <aside className="bg-slate-900/90 border border-slate-800 p-6 rounded-3xl shadow-xl space-y-6 text-white sticky top-24">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#D4AF37]" />
          <h3 className="text-base font-serif font-bold">Filter Estates</h3>
        </div>
        <button
          onClick={onResetFilters}
          className="text-xs text-slate-400 hover:text-[#D4AF37] flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset
        </button>
      </div>

      {/* Keyword Search */}
      <div>
        <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-2">
          Keyword / Title
        </label>
        <div className="relative">
          <input
            type="text"
            placeholder="Search title, address..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        </div>
      </div>

      {/* Purpose Toggle */}
      <div>
        <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-2">
          Transaction Purpose
        </label>
        <div className="grid grid-cols-3 gap-1 p-1 bg-slate-800/80 rounded-xl border border-slate-700">
          {(['All', 'Sale', 'Rent'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setFilters({ ...filters, purpose: p })}
              className={`py-1.5 text-xs font-semibold rounded-lg uppercase tracking-wider transition-all ${
                filters.purpose === p
                  ? 'bg-[#D4AF37] text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Destination Dropdown */}
      <div>
        <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-2">
          Prime Destination
        </label>
        <select
          value={filters.location}
          onChange={(e) => setFilters({ ...filters, location: e.target.value })}
          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-white focus:outline-none focus:border-[#D4AF37] cursor-pointer"
        >
          {locations.map((loc) => (
            <option key={loc} value={loc} className="bg-slate-900 text-white">
              {loc === 'All' ? 'All Locations' : loc}
            </option>
          ))}
        </select>
      </div>

      {/* Property Architecture Type */}
      <div>
        <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-2">
          Architecture Type
        </label>
        <div className="space-y-2">
          {propertyTypes.map((type) => {
            const isSelected = filters.propertyType === type;
            return (
              <button
                key={type}
                onClick={() => handleTypeToggle(type)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
                  isSelected
                    ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#D4AF37] font-semibold'
                    : 'bg-slate-800/50 border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span>{type}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-[#D4AF37]" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range Slider */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
            Max Budget ($)
          </label>
          <span className="text-xs font-serif font-bold text-[#D4AF37]">
            ${filters.maxPrice.toLocaleString()}
          </span>
        </div>
        <input
          type="range"
          min={5000000}
          max={50000000}
          step={1000000}
          value={filters.maxPrice}
          onChange={(e) => setFilters({ ...filters, maxPrice: Number(e.target.value) })}
          className="w-full accent-[#D4AF37] cursor-pointer"
        />
      </div>

      {/* Bedrooms Selector */}
      <div>
        <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-2">
          Minimum Bedrooms
        </label>
        <div className="grid grid-cols-5 gap-1">
          {['All', '2', '4', '6', '8+'].map((beds) => (
            <button
              key={beds}
              onClick={() => setFilters({ ...filters, bedrooms: beds })}
              className={`py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                filters.bedrooms === beds
                  ? 'bg-[#D4AF37] text-slate-950 border-[#D4AF37]'
                  : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white'
              }`}
            >
              {beds}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Only Checkbox */}
      <div className="pt-2">
        <label className="flex items-center gap-3 cursor-pointer text-xs font-medium text-slate-300">
          <input
            type="checkbox"
            checked={filters.isFeatured}
            onChange={(e) => setFilters({ ...filters, isFeatured: e.target.checked })}
            className="w-4 h-4 accent-[#D4AF37] rounded cursor-pointer"
          />
          <span>Featured Trophy Properties Only</span>
        </label>
      </div>

      {/* Total Result Badge */}
      <div className="pt-4 border-t border-slate-800 text-center">
        <span className="text-xs font-mono text-slate-400">
          Found <strong className="text-[#D4AF37]">{totalResults}</strong> matching estates
        </span>
      </div>
    </aside>
  );
}
