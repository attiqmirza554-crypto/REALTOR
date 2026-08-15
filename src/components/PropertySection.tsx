import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Property } from '../types';
import PropertyCard from './PropertyCard';

interface PropertySectionProps {
  properties: Property[];
  onSelectProperty: (property: Property) => void;
  wishlistIds: string[];
  onToggleWishlist: (property: Property) => void;
  compareIds: string[];
  onToggleCompare: (property: Property) => void;
  onShare: (property: Property) => void;
  onViewAll?: () => void;
  onViewAllProperties?: () => void;
}

export default function PropertySection({
  properties,
  onSelectProperty,
  wishlistIds,
  onToggleWishlist,
  compareIds,
  onToggleCompare,
  onShare,
  onViewAll,
  onViewAllProperties
}: PropertySectionProps) {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc' | 'popular'>('newest');
  const [displayCount, setDisplayCount] = useState<number>(6);

  const categories = [
    { id: 'All', label: 'All Estates' },
    { id: 'Sale', label: 'For Sale' },
    { id: 'Rent', label: 'Private Rent' },
    { id: 'Villa', label: 'Villas' },
    { id: 'Penthouse', label: 'Penthouses' },
    { id: 'Mansion', label: 'Mansions' },
    { id: 'Chateau', label: 'Chateaux' }
  ];

  // Filter properties by category
  let filteredProps = properties.filter((p) => {
    if (activeCategory === 'All') return true;
    if (activeCategory === 'Sale') return p.purpose === 'Sale';
    if (activeCategory === 'Rent') return p.purpose === 'Rent';
    return p.propertyType === activeCategory;
  });

  // Sort properties
  filteredProps.sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'popular') return (b.viewsCount || 0) - (a.viewsCount || 0);
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const visibleProperties = filteredProps.slice(0, displayCount);

  const handleExploreClick = () => {
    if (onViewAll) onViewAll();
    else if (onViewAllProperties) onViewAllProperties();
  };

  return (
    <section id="properties-section" className="py-24 bg-[#0F172A] text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-xs font-mono font-semibold text-[#D4AF37] uppercase tracking-widest block mb-2">
              Featured Residences
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white">
              Exclusive <span className="gold-text">Property Collection</span>
            </h2>
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 font-mono uppercase tracking-wider hidden sm:inline">
              Sort By:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-900 border border-slate-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl focus:outline-none focus:border-[#D4AF37] cursor-pointer"
            >
              <option value="newest">Newest Arrivals</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>
        </div>

        {/* Filter Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 custom-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id);
                setDisplayCount(6);
              }}
              className={`px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-all duration-300 ${
                activeCategory === cat.id
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-slate-950 shadow-lg shadow-[#D4AF37]/20 font-bold'
                  : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Property Cards Grid */}
        {visibleProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {visibleProperties.map((prop) => (
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
          <div className="text-center py-20 bg-slate-900/60 rounded-3xl border border-slate-800">
            <Sparkles className="w-12 h-12 text-[#D4AF37] mx-auto mb-4" />
            <h3 className="text-xl font-serif text-white font-bold mb-2">No Estates Match Selection</h3>
            <p className="text-slate-400 text-xs max-w-md mx-auto mb-6">
              Try switching category tabs or reset sorting filters to view available properties.
            </p>
            <button
              onClick={() => setActiveCategory('All')}
              className="px-6 py-2.5 rounded-xl bg-[#D4AF37] text-slate-950 text-xs font-bold uppercase tracking-wider"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Load More & View All Buttons */}
        <div className="mt-14 flex flex-wrap items-center justify-center gap-4">
          {displayCount < filteredProps.length && (
            <button
              onClick={() => setDisplayCount((prev) => prev + 6)}
              id="load-more-properties-btn"
              className="px-8 py-3.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-[#D4AF37] text-white font-semibold text-xs tracking-wider uppercase transition-all duration-300"
            >
              Load More ({filteredProps.length - displayCount} Remaining)
            </button>
          )}

          <button
            onClick={handleExploreClick}
            id="view-all-properties-btn"
            className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#AA7C11] text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-[#D4AF37]/20 hover:scale-105 transition-all duration-300"
          >
            <span>Explore All Estates</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
