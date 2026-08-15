import { useState } from 'react';
import { motion } from 'motion/react';
import { X, Share2, Copy, Check, MessageSquare, Mail, Twitter, Facebook } from 'lucide-react';
import { Property } from '../types';

interface ShareModalProps {
  property: Property | null;
  onClose: () => void;
}

export default function ShareModal({ property, onClose }: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  if (!property) return null;

  const shareUrl = `${(window.location.origin + window.location.pathname).replace(/\/+$/, '')}/?property=${property.id}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-slate-900 border border-[#D4AF37]/30 rounded-3xl max-w-md w-full p-6 text-white relative shadow-2xl"
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <Share2 className="w-5 h-5 text-[#D4AF37]" />
          <h3 className="text-lg font-serif font-bold text-white">Share Luxury Estate</h3>
        </div>
        <p className="text-xs text-slate-400 mb-6 line-clamp-1">{property.title}</p>

        {/* Property Mini Card Preview */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-800/80 border border-slate-700 mb-6">
          <img
            src={property.thumbnail}
            alt={property.title}
            className="w-16 h-16 object-cover rounded-xl"
          />
          <div>
            <h4 className="text-xs font-serif font-bold text-white">{property.title}</h4>
            <p className="text-[11px] text-slate-400">{property.location}</p>
            <span className="text-xs font-bold text-[#D4AF37]">
              ${property.price.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Copy Link Input */}
        <div className="mb-6">
          <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-1">
            Direct Link
          </label>
          <div className="flex items-center gap-2 bg-slate-800 p-2 rounded-xl border border-slate-700">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="bg-transparent text-xs text-slate-300 focus:outline-none w-full px-2"
            />
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg bg-[#D4AF37] text-slate-950 font-bold text-xs flex items-center gap-1 shrink-0"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Social Sharing Buttons */}
        <div className="grid grid-cols-3 gap-2">
          <a
            href={`https://wa.me/?text=${encodeURIComponent(`Check out this estate on Aura Haven: ${property.title} - ${shareUrl}`)}`}
            target="_blank"
            rel="noreferrer"
            className="py-2.5 px-3 rounded-xl bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </a>

          <a
            href={`mailto:?subject=${encodeURIComponent(`Aura Haven Estate: ${property.title}`)}&body=${encodeURIComponent(`View property details here: ${shareUrl}`)}`}
            className="py-2.5 px-3 rounded-xl bg-sky-600/20 text-sky-400 hover:bg-sky-600 hover:text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Email</span>
          </a>

          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Aura Haven Estate: ${property.title} ${shareUrl}`)}`}
            target="_blank"
            rel="noreferrer"
            className="py-2.5 px-3 rounded-xl bg-slate-800 text-slate-300 hover:text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <Twitter className="w-3.5 h-3.5" />
            <span>X / Twitter</span>
          </a>
        </div>
      </motion.div>
    </div>
  );
}
