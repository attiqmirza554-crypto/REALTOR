import { motion } from 'motion/react';
import {
  ShieldCheck,
  CheckCircle2,
  Scale,
  BadgeDollarSign,
  Headphones,
  Clock,
  UserCheck,
  Sparkles
} from 'lucide-react';
import { SiteSettings } from '../types';

interface WhyChooseUsProps {
  settings?: SiteSettings;
}

export default function WhyChooseUs({ settings }: WhyChooseUsProps) {
  const features = [
    {
      icon: ShieldCheck,
      title: 'Trusted Global Agency',
      description: 'Strict privacy protocols, verified buyer credentials, and total transaction discretion.'
    },
    {
      icon: CheckCircle2,
      title: 'Verified Property Assets',
      description: 'Every estate undergoes 120-point architectural, legal, and structural authenticity audits.'
    },
    {
      icon: Scale,
      title: 'Legal & Tax Assistance',
      description: 'Comprehensive cross-border legal advisory, trust structuring, and escrow oversight.'
    },
    {
      icon: BadgeDollarSign,
      title: 'Off-Market Pricing',
      description: 'Direct owner negotiations ensuring optimal valuation without public speculative markups.'
    },
    {
      icon: Headphones,
      title: 'Premium Support',
      description: 'Dedicated luxury advisor assigned to every client for personalized consultation.'
    },
    {
      icon: Clock,
      title: '24x7 Private Concierge',
      description: 'Round-the-clock service for helicopter transfers, private viewings, and estate tours.'
    },
    {
      icon: UserCheck,
      title: 'Architectural Expert Team',
      description: 'Licensed real estate masters, structural engineers, and interior design specialists.'
    }
  ];

  return (
    <section id="why-choose" className="py-24 bg-[#0F172A]/95 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono font-semibold text-[#D4AF37] uppercase tracking-widest block mb-2">
            The Aura Standard
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white mb-4">
            Why Discerning Buyers Choose <span className="gold-text">{settings?.companyName || 'Aura Haven'}</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base font-light">
            We transcend conventional real estate transactions by combining white-glove personal concierge services with institutional market intelligence.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {features.map((feature, idx) => {
            const IconComponent = feature.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                whileHover={{ y: -8 }}
                className="group p-6 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-[#D4AF37]/50 shadow-xl transition-all duration-300 relative overflow-hidden"
              >
                {/* Accent glow on hover */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#D4AF37]/5 rounded-full blur-2xl group-hover:bg-[#D4AF37]/20 transition-all" />

                <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 group-hover:border-[#D4AF37] group-hover:bg-[#D4AF37]/10 flex items-center justify-center mb-5 transition-all duration-300">
                  <IconComponent className="w-6 h-6 text-[#D4AF37]" />
                </div>

                <h3 className="text-lg font-serif font-semibold text-white group-hover:text-[#D4AF37] transition-colors mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-400 text-xs leading-relaxed font-light">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
