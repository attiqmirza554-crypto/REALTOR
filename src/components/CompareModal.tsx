import { motion, AnimatePresence } from 'motion/react';
import { X, Scale, Check, Trash2 } from 'lucide-react';
import { Property } from '../types';

interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  compareProperties: Property[];
  onRemoveFromCompare: (property: Property) => void;
  onSelectProperty: (property: Property) => void;
}

export default function CompareModal({
  isOpen,
  onClose,
  compareProperties,
  onRemoveFromCompare,
  onSelectProperty
}: CompareModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-slate-900 border border-[#D4AF37]/30 rounded-3xl max-w-5xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto custom-scrollbar text-white relative shadow-2xl"
      >
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <Scale className="w-6 h-6 text-[#D4AF37]" />
            <h3 className="text-xl font-serif font-bold">Side-by-Side Property Comparison</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {compareProperties.length === 0 ? (
          <div className="text-center py-16">
            <Scale className="w-12 h-12 text-slate-700 mx-auto mb-3" />
            <p className="text-xs text-slate-400">
              No properties selected for comparison. Click the scale icon on any property card to add items.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="p-3 text-xs font-mono text-slate-400 uppercase w-44">Estate Feature</th>
                  {compareProperties.map((prop) => (
                    <th key={prop.id} className="p-3 text-center min-w-[200px]">
                      <div className="relative group">
                        <img
                          src={prop.thumbnail}
                          alt={prop.title}
                          className="w-full h-28 object-cover rounded-xl mb-2"
                        />
                        <button
                          onClick={() => onRemoveFromCompare(prop)}
                          className="absolute top-2 right-2 p-1.5 rounded-lg bg-rose-500 text-white shadow"
                          title="Remove from comparison"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <h4
                        onClick={() => {
                          onSelectProperty(prop);
                          onClose();
                        }}
                        className="text-xs font-serif font-bold text-white hover:text-[#D4AF37] cursor-pointer line-clamp-1"
                      >
                        {prop.title}
                      </h4>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-xs">
                <tr>
                  <td className="p-3 font-mono text-slate-400 uppercase">Valuation Price</td>
                  {compareProperties.map((p) => (
                    <td key={p.id} className="p-3 text-center font-bold text-[#D4AF37]">
                      ${p.price.toLocaleString()}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 font-mono text-slate-400 uppercase">Price per Sq.Ft</td>
                  {compareProperties.map((p) => (
                    <td key={p.id} className="p-3 text-center font-mono text-slate-300">
                      ${Math.round(p.price / p.area).toLocaleString()} / sq.ft
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 font-mono text-slate-400 uppercase">Destination</td>
                  {compareProperties.map((p) => (
                    <td key={p.id} className="p-3 text-center text-slate-200">
                      {p.location}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 font-mono text-slate-400 uppercase">Architecture Type</td>
                  {compareProperties.map((p) => (
                    <td key={p.id} className="p-3 text-center text-slate-200">
                      {p.propertyType}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 font-mono text-slate-400 uppercase">Bedrooms / Baths</td>
                  {compareProperties.map((p) => (
                    <td key={p.id} className="p-3 text-center text-slate-200">
                      {p.bedrooms} Beds / {p.bathrooms} Baths
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 font-mono text-slate-400 uppercase">Total Area</td>
                  {compareProperties.map((p) => (
                    <td key={p.id} className="p-3 text-center text-slate-200">
                      {p.area.toLocaleString()} {p.areaUnit}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 font-mono text-slate-400 uppercase">Garage Spaces</td>
                  {compareProperties.map((p) => (
                    <td key={p.id} className="p-3 text-center text-slate-200">
                      {p.parking} Cars
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 font-mono text-slate-400 uppercase">Year Built</td>
                  {compareProperties.map((p) => (
                    <td key={p.id} className="p-3 text-center text-slate-200">
                      {p.yearBuilt}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
}
