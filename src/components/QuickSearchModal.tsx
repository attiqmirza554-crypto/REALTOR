import { useState } from 'react';
import { motion } from 'motion/react';
import { Search, X, MapPin, ArrowRight } from 'lucide-react';
import { Property } from '../types';

interface QuickSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  properties: Property[];
  onSelectProperty: (property: Property) => void;
}

export default function QuickSearchModal({
  isOpen,
  onClose,
  properties,
  onSelectProperty
}: QuickSearchModalProps) {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const results = query.trim()
    ? properties.filter(
        (p) =>
          p.title.toLowerCase().includes(query.toLowerCase()) ||
          p.location.toLowerCase().includes(query.toLowerCase()) ||
          p.city.toLowerCase().includes(query.toLowerCase()) ||
          p.propertyType.toLowerCase().includes(query.toLowerCase())
      )
    : properties.slice(0, 4);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-start justify-center pt-24 px-4">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -20, opacity: 0 }}
        className="bg-slate-900 border border-[#D4AF37]/30 rounded-3xl max-w-2xl w-full p-6 text-white relative shadow-2xl overflow-hidden"
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 bg-slate-800/90 px-4 py-3 rounded-2xl border border-slate-700 mb-6">
          <Search className="w-5 h-5 text-[#D4AF37]" />
          <input
            type="text"
            autoFocus
            placeholder="Type estate name, city, location, or type..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="bg-transparent text-sm text-white focus:outline-none w-full placeholder-slate-500"
          />
        </div>

        <div className="space-y-3 max-h-[60vh] overflow-y-auto custom-scrollbar">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-2">
            {query.trim() ? `Search Results (${results.length})` : 'Popular Featured Estates'}
          </span>

          {results.map((prop) => (
            <div
              key={prop.id}
              onClick={() => {
                onSelectProperty(prop);
                onClose();
              }}
              className="p-3 rounded-2xl bg-slate-800/60 border border-slate-800 hover:border-[#D4AF37] flex items-center gap-4 cursor-pointer group transition-all"
            >
              <img
                src={prop.thumbnail}
                alt={prop.title}
                className="w-16 h-16 object-cover rounded-xl shrink-0"
              />
              <div className="flex-grow overflow-hidden">
                <h4 className="text-xs font-serif font-bold text-white group-hover:text-[#D4AF37] truncate">
                  {prop.title}
                </h4>
                <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5 truncate">
                  <MapPin className="w-3 h-3 text-[#D4AF37]" />
                  {prop.location}
                </p>
                <span className="text-xs font-bold text-[#D4AF37] block mt-1">
                  ${prop.price.toLocaleString()}
                </span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-[#D4AF37] shrink-0" />
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
