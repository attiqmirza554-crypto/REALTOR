import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Award, ShieldCheck, Gem, CheckCircle, ArrowRight, X, Building, Globe, MapPin } from 'lucide-react';
import { SiteSettings } from '../types';

interface AboutSectionProps {
  settings?: SiteSettings;
}

export default function AboutSection({ settings }: AboutSectionProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const city = settings?.targetCity || 'Paso Robles';
  const state = settings?.targetState || 'CA';
  const areas = settings?.serviceAreas || ['Paso Robles', 'Templeton', 'Atascadero', 'San Luis Obispo', 'Cambria', 'Morro Bay'];

  return (
    <section id="about" className="py-24 bg-[#0F172A] text-white relative overflow-hidden">
      {/* Decorative ambient lighting */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-slate-800/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column - Image & Floating Badge */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-6 relative"
          >
            <div className="relative rounded-3xl overflow-hidden p-2 bg-gradient-to-tr from-[#D4AF37]/40 via-slate-800 to-[#AA7C11]/40 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
                alt="Aura Haven Headquarters"
                className="w-full h-[480px] object-cover rounded-2xl transform hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-transparent opacity-60" />
            </div>

            {/* Floating Experience Badge */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="absolute -bottom-8 -right-4 sm:right-6 bg-slate-900/95 border border-[#D4AF37]/50 p-6 rounded-2xl shadow-2xl backdrop-blur-xl max-w-xs"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center shrink-0">
                  <Award className="w-7 h-7 text-[#D4AF37]" />
                </div>
                <div>
                  <span className="text-2xl font-serif font-bold text-white block">15+ Years</span>
                  <span className="text-xs text-slate-400 font-mono uppercase tracking-wider">
                    Unrivaled Market Discretion
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - Text & Content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-6"
          >
            <span className="text-xs font-mono font-semibold text-[#D4AF37] uppercase tracking-widest block mb-2">
              Premier Local Real Estate Specialists
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white mb-6 leading-tight">
              Leading Luxury Real Estate Agency in <span className="gold-text">{city}, {state}</span>
            </h2>
            <p className="text-slate-300 text-base leading-relaxed mb-6 font-light">
              {settings?.companyName || 'Aura Haven'} is the premier luxury real estate advisory serving fine home buyers and sellers across {city} and surrounding coastal & vineyard estates. We combine deep local market intelligence with white-glove marketing.
            </p>

            {/* Service Areas Badge */}
            <div className="mb-6 p-4 rounded-2xl bg-slate-900/80 border border-[#D4AF37]/30">
              <h4 className="text-xs font-mono font-bold text-[#D4AF37] uppercase tracking-wider mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#D4AF37]" /> Service Areas & Local Coverage
              </h4>
              <div className="flex flex-wrap gap-2">
                {areas.map((area, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-xl bg-amber-500/15 text-amber-300 font-bold text-xs border border-amber-500/40 shadow-sm flex items-center gap-1"
                  >
                    <MapPin className="w-3 h-3 text-[#D4AF37]" />
                    {area}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-white">Off-Market Inventory Access</h4>
                  <p className="text-xs text-slate-400">Exclusive access to unlisted trophy properties before public offering.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-white">Turnkey Legal & Financial Structuring</h4>
                  <p className="text-xs text-slate-400">White-glove cross-border transaction and tax optimization advisory.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-white">Private Concierge & Architecture Teams</h4>
                  <p className="text-xs text-slate-400">In-house architectural advisers, interior designers, and estate managers.</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setModalOpen(true)}
              id="about-read-more-btn"
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-2 hover:shadow-lg hover:shadow-[#D4AF37]/20 transition-all duration-300"
            >
              <span>Read Full Story</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
      </div>

      {/* Read More Modal */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border border-[#D4AF37]/30 rounded-3xl max-w-2xl w-full p-8 max-h-[85vh] overflow-y-auto custom-scrollbar relative text-white"
            >
              <button
                onClick={() => setModalOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <Gem className="w-7 h-7 text-[#D4AF37]" />
                <h3 className="text-2xl font-serif font-bold gold-text">{settings?.companyName || 'Aura Haven'} Legacy</h3>
              </div>

              <div className="space-y-4 text-slate-300 text-sm leading-relaxed font-light">
                <p>
                  <strong>Our Mission:</strong> To curate unparalleled architectural works of art while maintaining absolute privacy and confidentiality for our buyers and sellers.
                </p>
                <p>
                  <strong>Our Vision:</strong> To remain the standard of global luxury real estate through technology integration, immersive virtual tours, and deep localized market intelligence.
                </p>
                <p>
                  <strong>Key Milestones:</strong>
                </p>
                <ul className="list-disc pl-5 space-y-2 text-slate-400">
                  <li>2011: Founded in Beverly Hills, CA.</li>
                  <li>2016: Expanded advisory footprint to Manhattan & London.</li>
                  <li>2020: Surpassed $1 Billion in private estate volume.</li>
                  <li>2024: Opened dedicated Middle East division in Palm Jumeirah, Dubai.</li>
                  <li>2026: Achieved over $2.5 Billion in cumulative transaction volume.</li>
                </ul>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-800 flex justify-end">
                <button
                  onClick={() => setModalOpen(false)}
                  className="px-6 py-2.5 rounded-xl bg-[#D4AF37] text-slate-950 font-bold text-xs uppercase tracking-wider"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
