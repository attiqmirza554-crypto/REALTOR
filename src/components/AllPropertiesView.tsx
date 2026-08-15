import { useState } from 'react';
import { motion } from 'motion/react';
import { Grid, List, SlidersHorizontal, X } from 'lucide-react';
import { Property, FilterState } from '../types';
import PropertyCard from './PropertyCard';
import PropertyFilterSidebar from './PropertyFilterSidebar';

interface AllPropertiesViewProps {
  properties: Property[];
  onSelectProperty: (property: Property) => void;
  wishlistIds: string[];
  onToggleWishlist: (property: Property) => void;
  compareIds: string[];
  onToggleCompare: (property: Property) => void;
  onShare: (property: Property) => void;
}

export default function AllPropertiesView({
  properties,
  onSelectProperty,
  wishlistIds,
  onToggleWishlist,
  compareIds,
  onToggleCompare,
  onShare
}: AllPropertiesViewProps) {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    location: 'All',
    propertyType: 'All',
    purpose: 'All',
    minPrice: 0,
    maxPrice: 50000000,
    bedrooms: 'All',
    bathrooms: 'All',
    minArea: 0,
    maxArea: 30000,
    status: 'All',
    isFeatured: false,
    sortBy: 'newest'
  });

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const resetFilters = () => {
    setFilters({
      search: '',
      location: 'All',
      propertyType: 'All',
      purpose: 'All',
      minPrice: 0,
      maxPrice: 50000000,
      bedrooms: 'All',
      bathrooms: 'All',
      minArea: 0,
      maxArea: 30000,
      status: 'All',
      isFeatured: false,
      sortBy: 'newest'
    });
  };

  // Filter logic
  let filtered = properties.filter((p) => {
    if (filters.search && !p.title.toLowerCase().includes(filters.search.toLowerCase()) && !p.location.toLowerCase().includes(filters.search.toLowerCase())) return false;
    if (filters.location !== 'All' && !p.location.toLowerCase().includes(filters.location.toLowerCase())) return false;
    if (filters.propertyType !== 'All' && p.propertyType !== filters.propertyType) return false;
    if (filters.purpose !== 'All' && p.purpose !== filters.purpose) return false;
    if (p.price > filters.maxPrice) return false;
    if (filters.bedrooms !== 'All') {
      if (filters.bedrooms === '8+' && p.bedrooms < 8) return false;
      if (filters.bedrooms !== '8+' && p.bedrooms < Number(filters.bedrooms)) return false;
    }
    if (filters.isFeatured && !p.isFeatured) return false;
    return true;
  });

  // Sort logic
  filtered.sort((a, b) => {
    if (filters.sortBy === 'price-asc') return a.price - b.price;
    if (filters.sortBy === 'price-desc') return b.price - a.price;
    if (filters.sortBy === 'popular') return (b.viewsCount || 0) - (a.viewsCount || 0);
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="pt-28 pb-24 bg-[#0F172A] text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-10 text-center sm:text-left">
          <span className="text-xs font-mono font-semibold text-[#D4AF37] uppercase tracking-widest block mb-2">
            The Complete Portfolio
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white">
            All Exclusive <span className="gold-text">Residences & Estates</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block lg:col-span-4">
            <PropertyFilterSidebar
              filters={filters}
              setFilters={setFilters}
              onResetFilters={resetFilters}
              totalResults={filtered.length}
            />
          </div>

          {/* Right Main Grid */}
          <div className="lg:col-span-8">
            {/* Control Bar: Mobile Filter Button, Layout Toggle, Sort */}
            <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl mb-8 flex flex-wrap items-center justify-between gap-4">
              <button
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden px-4 py-2 rounded-xl bg-slate-800 text-slate-200 text-xs font-semibold flex items-center gap-2"
              >
                <SlidersHorizontal className="w-4 h-4 text-[#D4AF37]" />
                Filters
              </button>

              <div className="text-xs text-slate-400 font-mono">
                Showing <strong className="text-white">{filtered.length}</strong> estates
              </div>

              <div className="flex items-center gap-3">
                {/* Grid vs List View Switcher */}
                <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-lg transition-colors ${
                      viewMode === 'grid' ? 'bg-[#D4AF37] text-slate-950' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded-lg transition-colors ${
                      viewMode === 'list' ? 'bg-[#D4AF37] text-slate-950' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>

                {/* Sort Dropdown */}
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as any })}
                  className="bg-slate-800 border border-slate-700 text-xs text-white px-3 py-2 rounded-xl focus:outline-none focus:border-[#D4AF37] cursor-pointer"
                >
                  <option value="newest">Newest First</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="popular">Most Popular</option>
                </select>
              </div>
            </div>

            {/* Active Filters Tag Pills */}
            {(filters.search || filters.location !== 'All' || filters.propertyType !== 'All' || filters.purpose !== 'All' || filters.isFeatured) && (
              <div className="flex flex-wrap items-center gap-2 mb-6">
                <span className="text-[11px] font-mono text-slate-400 uppercase">Active:</span>
                {filters.search && (
                  <span className="px-3 py-1 rounded-full bg-slate-800 text-xs text-[#D4AF37] border border-slate-700 flex items-center gap-1">
                    "{filters.search}"
                    <X className="w-3 h-3 cursor-pointer" onClick={() => setFilters({ ...filters, search: '' })} />
                  </span>
                )}
                {filters.location !== 'All' && (
                  <span className="px-3 py-1 rounded-full bg-slate-800 text-xs text-[#D4AF37] border border-slate-700 flex items-center gap-1">
                    {filters.location}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => setFilters({ ...filters, location: 'All' })} />
                  </span>
                )}
                {filters.propertyType !== 'All' && (
                  <span className="px-3 py-1 rounded-full bg-slate-800 text-xs text-[#D4AF37] border border-slate-700 flex items-center gap-1">
                    {filters.propertyType}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => setFilters({ ...filters, propertyType: 'All' })} />
                  </span>
                )}
                <button
                  onClick={resetFilters}
                  className="text-xs text-slate-400 hover:text-white underline ml-2"
                >
                  Clear All
                </button>
              </div>
            )}

            {/* Property Grid or List */}
            {filtered.length > 0 ? (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 md:grid-cols-2 gap-6'
                    : 'flex flex-col gap-6'
                }
              >
                {filtered.map((prop) => (
                  <PropertyCard
                    key={prop.id}
                    property={prop}
                    onSelectProperty={onSelectProperty}
                    isWishlisted={wishlistIds.includes(prop.id)}
                    onToggleWishlist={onToggleWishlist}
                    isCompared={compareIds.includes(prop.id)}
                    onToggleCompare={onToggleCompare}
                    onShare={onShare}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-24 bg-slate-900/60 rounded-3xl border border-slate-800 p-8">
                <h3 className="text-xl font-serif text-white font-bold mb-2">No Matching Estates</h3>
                <p className="text-slate-400 text-xs mb-6">
                  Adjust your search parameters or price range to explore available luxury residences.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-6 py-2.5 rounded-xl bg-[#D4AF37] text-slate-950 font-bold text-xs uppercase"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex justify-end">
          <div className="w-full max-w-sm bg-slate-900 h-full p-6 overflow-y-auto custom-scrollbar">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-serif font-bold text-white">Filters</h3>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-2 rounded-xl bg-slate-800 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <PropertyFilterSidebar
              filters={filters}
              setFilters={setFilters}
              onResetFilters={resetFilters}
              totalResults={filtered.length}
            />

            <button
              onClick={() => setMobileFilterOpen(false)}
              className="w-full mt-6 py-3 rounded-xl bg-[#D4AF37] text-slate-950 font-bold text-xs uppercase tracking-wider"
            >
              Apply & Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
