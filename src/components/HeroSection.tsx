import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  MapPin,
  Home,
  ArrowRight,
  Sparkles,
  Phone
} from 'lucide-react';
import { FilterState, Property, SiteSettings } from '../types';

interface HeroSectionProps {
  properties: Property[];
  settings?: SiteSettings;
  onSelectProperty: (property: Property) => void;
  onExploreAll?: () => void;
  onSearchSubmit?: (filters: Partial<FilterState>) => void;
}

export default function HeroSection({
  properties,
  settings,
  onSelectProperty,
  onExploreAll,
  onSearchSubmit
}: HeroSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [purpose, setPurpose] = useState<'All' | 'Sale' | 'Rent'>('All');
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);

  // Filter properties for search suggestions
  const suggestions = searchQuery.trim()
    ? properties
        .filter(
          (p) =>
            p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.city.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 4)
    : [];

  const handleSearchExecute = () => {
    if (onSearchSubmit) {
      onSearchSubmit({
        search: searchQuery,
        location: selectedLocation,
        propertyType: selectedType,
        purpose
      });
    } else if (onExploreAll) {
      onExploreAll();
    }
    setSuggestionsOpen(false);
  };

  return (
    <section className="relative min-h-screen pt-28 pb-20 flex flex-col justify-center bg-[#0F172A] text-white overflow-hidden">
      {/* Background Image with Dark Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=80"
          alt="Luxury Mansion Background"
          className="w-full h-full object-cover object-center scale-105 opacity-40 filter brightness-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/70 to-[#0F172A]/40" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col justify-center my-auto">
        {/* Top Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/80 border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-semibold uppercase tracking-widest backdrop-blur-md mb-6 w-fit shadow-xl shadow-black/40"
        >
          <Sparkles className="w-4 h-4 text-[#D4AF37]" />
          <span>Curated Portfolio of World-Class Estates</span>
        </motion.div>

        {/* Main Headline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="max-w-4xl"
        >
          {(() => {
            const activeCity = settings?.targetCity || 'Waterloo';
            const activeState = settings?.targetState || 'ON';
            let effectiveH1 = settings?.seoCustomH1;

            if (
              !effectiveH1 ||
              (settings?.targetCity && !effectiveH1.toLowerCase().includes(settings.targetCity.toLowerCase()))
            ) {
              effectiveH1 = `Luxury Real Estate & Homes for Sale in ${activeCity}, ${activeState}`;
            }

            return (
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-extrabold leading-[1.1] tracking-tight text-white mb-6">
                {effectiveH1.includes(' in ') ? (
                  <>
                    {effectiveH1.split(/ in (.*)/s)[0]} in{' '}
                    <span className="gold-text font-serif italic drop-shadow-md">
                      {effectiveH1.split(/ in (.*)/s)[1]}
                    </span>
                  </>
                ) : (
                  <span className="gold-text font-serif italic drop-shadow-md">{effectiveH1}</span>
                )}
              </h1>
            );
          })()}
          <p className="text-lg sm:text-xl text-slate-300 font-light leading-relaxed max-w-2xl mb-8">
            Discover ultra-exclusive private estates, luxury villas, and architectural sanctuaries in{' '}
            <span className="text-[#D4AF37] font-semibold underline decoration-[#D4AF37]/50 underline-offset-4 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/30">
              {settings?.targetCity || 'Waterloo'}
              {settings?.targetState ? `, ${settings.targetState}` : ''}
            </span>{' '}
            and surrounding premier neighborhoods.
          </p>
        </motion.div>

        {/* Luxury Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative max-w-5xl w-full bg-slate-900/90 backdrop-blur-xl p-4 sm:p-6 rounded-3xl border border-[#D4AF37]/30 shadow-2xl shadow-black/80 mb-12"
        >
          {/* Purpose Tabs */}
          <div className="flex items-center gap-2 mb-4 pb-4 border-b border-slate-800">
            <button
              onClick={() => setPurpose('All')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
                purpose === 'All'
                  ? 'bg-[#D4AF37] text-slate-950 shadow-md shadow-[#D4AF37]/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Estates
            </button>
            <button
              onClick={() => setPurpose('Sale')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
                purpose === 'Sale'
                  ? 'bg-[#D4AF37] text-slate-950 shadow-md shadow-[#D4AF37]/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              For Sale
            </button>
            <button
              onClick={() => setPurpose('Rent')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
                purpose === 'Rent'
                  ? 'bg-[#D4AF37] text-slate-950 shadow-md shadow-[#D4AF37]/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Private Rental
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
            {/* Search Input & Live Suggestions */}
            <div className="relative">
              <label className="text-[10px] text-slate-400 font-mono uppercase tracking-widest block mb-1">
                Keywords / Title
              </label>
              <div className="flex items-center gap-2 bg-slate-800/80 px-3.5 py-2.5 rounded-xl border border-slate-700 focus-within:border-[#D4AF37]">
                <Search className="w-4 h-4 text-[#D4AF37]" />
                <input
                  type="text"
                  placeholder="e.g. Palazzo, Beverly Hills..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setSuggestionsOpen(true);
                  }}
                  onFocus={() => setSuggestionsOpen(true)}
                  className="bg-transparent text-sm text-white focus:outline-none w-full placeholder-slate-500"
                />
              </div>

              {/* Suggestions Dropdown */}
              <AnimatePresence>
                {suggestionsOpen && suggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="absolute left-0 right-0 top-full mt-2 z-50 bg-slate-900 border border-[#D4AF37]/30 rounded-2xl shadow-2xl overflow-hidden p-2"
                  >
                    {suggestions.map((prop) => (
                      <button
                        key={prop.id}
                        onClick={() => {
                          onSelectProperty(prop);
                          setSuggestionsOpen(false);
                        }}
                        className="w-full text-left p-2.5 rounded-xl hover:bg-slate-800 flex items-center gap-3 group transition-colors"
                      >
                        <img
                          src={prop.thumbnail}
                          alt={prop.title}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                        <div className="overflow-hidden">
                          <h4 className="text-xs font-semibold text-white group-hover:text-[#D4AF37] truncate">
                            {prop.title}
                          </h4>
                          <p className="text-[11px] text-slate-400 truncate">{prop.location}</p>
                          <span className="text-[11px] text-[#D4AF37] font-semibold">
                            ${prop.price.toLocaleString()}
                          </span>
                        </div>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Location Select */}
            <div>
              <label className="text-[10px] text-slate-400 font-mono uppercase tracking-widest block mb-1">
                Prime Destination
              </label>
              <div className="flex items-center gap-2 bg-slate-800/80 px-3.5 py-2.5 rounded-xl border border-slate-700 focus-within:border-[#D4AF37]">
                <MapPin className="w-4 h-4 text-[#D4AF37]" />
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="bg-transparent text-sm text-white focus:outline-none w-full cursor-pointer border-none font-medium"
                >
                  <option value="All" className="bg-slate-900 text-white">All Locations</option>
                  <option value="Beverly Hills" className="bg-slate-900 text-white">Beverly Hills, CA</option>
                  <option value="Manhattan" className="bg-slate-900 text-white">Manhattan, NY</option>
                  <option value="Palm Jumeirah" className="bg-slate-900 text-white">Palm Jumeirah, Dubai</option>
                  <option value="Malibu" className="bg-slate-900 text-white">Malibu, CA</option>
                  <option value="Aspen" className="bg-slate-900 text-white">Aspen, CO</option>
                  <option value="Saint-Tropez" className="bg-slate-900 text-white">Saint-Tropez, France</option>
                </select>
              </div>
            </div>

            {/* Property Type Select */}
            <div>
              <label className="text-[10px] text-slate-400 font-mono uppercase tracking-widest block mb-1">
                Property Architecture
              </label>
              <div className="flex items-center gap-2 bg-slate-800/80 px-3.5 py-2.5 rounded-xl border border-slate-700 focus-within:border-[#D4AF37]">
                <Home className="w-4 h-4 text-[#D4AF37]" />
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="bg-transparent text-sm text-white focus:outline-none w-full cursor-pointer border-none font-medium"
                >
                  <option value="All" className="bg-slate-900 text-white">All Types</option>
                  <option value="Villa" className="bg-slate-900 text-white">Waterfront Villa</option>
                  <option value="Penthouse" className="bg-slate-900 text-white">Sky Penthouse</option>
                  <option value="Mansion" className="bg-slate-900 text-white">Private Mansion</option>
                  <option value="Chateau" className="bg-slate-900 text-white">Historic Chateau</option>
                </select>
              </div>
            </div>

            {/* Execute Search Button */}
            <div className="flex items-end h-full pt-4 sm:pt-0">
              <button
                onClick={handleSearchExecute}
                id="hero-search-execute-btn"
                className="w-full h-[42px] rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#AA7C11] text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:shadow-xl hover:shadow-[#D4AF37]/30 transition-all duration-300 transform active:scale-95"
              >
                <Search className="w-4 h-4 text-slate-950" />
                <span>Find Estates</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Action CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-wrap items-center gap-4 mb-16"
        >
          <button
            onClick={() => {
              if (onExploreAll) {
                onExploreAll();
              } else {
                const el = document.getElementById('properties-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            id="view-properties-hero-btn"
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-slate-950 font-bold text-sm tracking-wider uppercase flex items-center gap-3 shadow-2xl shadow-[#D4AF37]/20 hover:scale-105 transition-all duration-300"
          >
            <span>Explore Portfolio</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <a
            href="#contact"
            id="contact-agent-hero-btn"
            className="px-8 py-4 rounded-2xl bg-slate-900/90 text-white border border-slate-700 hover:border-[#D4AF37] font-semibold text-sm tracking-wider uppercase flex items-center gap-3 backdrop-blur-md hover:bg-slate-800 transition-all duration-300"
          >
            <Phone className="w-4 h-4 text-[#D4AF37]" />
            <span>Speak With Advisor</span>
          </a>
        </motion.div>

        {/* Animated Statistics Counter */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-md"
        >
          <div className="border-r border-slate-800/80 last:border-none pr-4">
            <span className="text-3xl sm:text-4xl font-serif font-bold text-[#D4AF37] block">
              $2.5B+
            </span>
            <span className="text-xs text-slate-400 uppercase tracking-widest font-mono mt-1 block">
              Portfolio Value
            </span>
          </div>

          <div className="border-r border-slate-800/80 last:border-none pr-4">
            <span className="text-3xl sm:text-4xl font-serif font-bold text-white block">
              500+
            </span>
            <span className="text-xs text-slate-400 uppercase tracking-widest font-mono mt-1 block">
              Properties Sold
            </span>
          </div>

          <div className="border-r border-slate-800/80 last:border-none pr-4">
            <span className="text-3xl sm:text-4xl font-serif font-bold text-[#D4AF37] block">
              1,200+
            </span>
            <span className="text-xs text-slate-400 uppercase tracking-widest font-mono mt-1 block">
              Discreet Clients
            </span>
          </div>

          <div>
            <span className="text-3xl sm:text-4xl font-serif font-bold text-white block">
              15+ Years
            </span>
            <span className="text-xs text-slate-400 uppercase tracking-widest font-mono mt-1 block">
              Market Expertise
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
