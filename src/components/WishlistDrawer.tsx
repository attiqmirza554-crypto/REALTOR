import { motion, AnimatePresence } from 'motion/react';
import { X, Heart, Trash2, ArrowRight, Eye } from 'lucide-react';
import { Property } from '../types';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistProperties: Property[];
  onRemoveFromWishlist: (property: Property) => void;
  onSelectProperty: (property: Property) => void;
}

export default function WishlistDrawer({
  isOpen,
  onClose,
  wishlistProperties,
  onRemoveFromWishlist,
  onSelectProperty
}: WishlistDrawerProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex justify-end">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full p-6 flex flex-col justify-between text-white shadow-2xl"
          >
            {/* Header */}
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-rose-500 fill-current" />
                  <h3 className="text-lg font-serif font-bold">Saved Wishlist ({wishlistProperties.length})</h3>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Items List */}
              <div className="mt-6 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar pr-1">
                {wishlistProperties.length > 0 ? (
                  wishlistProperties.map((prop) => (
                    <div
                      key={prop.id}
                      className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center gap-3 group"
                    >
                      <img
                        src={prop.thumbnail}
                        alt={prop.title}
                        className="w-20 h-20 object-cover rounded-xl"
                      />
                      <div className="flex-grow overflow-hidden">
                        <h4
                          onClick={() => {
                            onSelectProperty(prop);
                            onClose();
                          }}
                          className="text-xs font-serif font-bold text-white group-hover:text-[#D4AF37] cursor-pointer truncate"
                        >
                          {prop.title}
                        </h4>
                        <p className="text-[11px] text-slate-400 truncate">{prop.location}</p>
                        <span className="text-xs font-bold text-[#D4AF37] block mt-1">
                          ${prop.price.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => {
                            onSelectProperty(prop);
                            onClose();
                          }}
                          className="p-1.5 rounded-lg bg-slate-700 hover:bg-[#D4AF37] text-slate-300 hover:text-slate-950 transition-colors"
                          title="View"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onRemoveFromWishlist(prop)}
                          className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white transition-colors"
                          title="Remove"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-16">
                    <Heart className="w-12 h-12 text-slate-700 mx-auto mb-3" />
                    <p className="text-xs text-slate-400">No properties added to your wishlist yet.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="pt-4 border-t border-slate-800">
              <button
                onClick={onClose}
                className="w-full py-3 rounded-xl bg-[#D4AF37] text-slate-950 font-bold text-xs uppercase tracking-wider"
              >
                Continue Browsing
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
