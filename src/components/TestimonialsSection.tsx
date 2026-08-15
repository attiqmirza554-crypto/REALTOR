import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, Quote, ChevronLeft, ChevronRight, ShieldCheck } from 'lucide-react';
import { Testimonial } from '../types';

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export default function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (testimonials.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  if (!testimonials || testimonials.length === 0) return null;

  const current = testimonials[currentIndex];

  return (
    <section className="py-24 bg-[#0F172A] text-white relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <span className="text-xs font-mono font-semibold text-[#D4AF37] uppercase tracking-widest block mb-2">
          Discreet Client Feedback
        </span>
        <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white mb-12">
          Trusted by <span className="gold-text">Industry Leaders & Investors</span>
        </h2>

        {/* Testimonial Card Slider Container */}
        <div className="relative bg-slate-900/90 border border-[#D4AF37]/30 rounded-3xl p-8 sm:p-12 shadow-2xl backdrop-blur-xl">
          <Quote className="w-16 h-16 text-[#D4AF37]/20 absolute top-6 left-6 pointer-events-none" />

          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center"
            >
              {/* Star Rating */}
              <div className="flex items-center gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-[#D4AF37] text-[#D4AF37]" />
                ))}
              </div>

              {/* Review Quote */}
              <p className="text-lg sm:text-2xl font-serif italic text-slate-200 leading-relaxed max-w-3xl mb-8">
                "{current.review}"
              </p>

              {/* Client Profile */}
              <div className="flex items-center gap-4">
                <img
                  src={current.photo}
                  alt={current.clientName}
                  className="w-14 h-14 rounded-full object-cover border-2 border-[#D4AF37] shadow-md"
                />
                <div className="text-left">
                  <h4 className="text-base font-serif font-bold text-white flex items-center gap-1.5">
                    {current.clientName}
                    {current.verified && (
                      <ShieldCheck className="w-4 h-4 text-[#D4AF37]" title="Verified Client" />
                    )}
                  </h4>
                  <p className="text-xs text-[#D4AF37] font-mono">{current.role}</p>
                  <p className="text-[11px] text-slate-400">{current.location}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-800">
            <button
              onClick={() =>
                setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
              }
              className="p-3 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-[#D4AF37] hover:text-slate-950 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Dots */}
            <div className="flex items-center gap-2">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    idx === currentIndex ? 'bg-[#D4AF37] w-6' : 'bg-slate-700'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={() => setCurrentIndex((prev) => (prev + 1) % testimonials.length)}
              className="p-3 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-[#D4AF37] hover:text-slate-950 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
