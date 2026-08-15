import React, { useState } from 'react';
import { Building2, Send, ArrowUp, Instagram, Facebook, Linkedin, Youtube } from 'lucide-react';
import { SiteSettings } from '../types';

interface FooterProps {
  settings: SiteSettings;
  onNavigateHome?: () => void;
  onNavigateAllProperties?: () => void;
  onOpenAdmin?: () => void;
}

export default function Footer({
  settings,
  onNavigateHome,
  onNavigateAllProperties,
  onOpenAdmin
}: FooterProps) {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setSubscribed(true);
      setNewsletterEmail('');
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0B1120] text-slate-300 pt-20 pb-10 border-t border-slate-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-16">
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#D4AF37] via-[#F3E5AB] to-[#AA7C11] p-0.5 shadow-lg shadow-[#D4AF37]/20">
                <div className="w-full h-full bg-[#0F172A] rounded-[10px] flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-[#D4AF37]" />
                </div>
              </div>
              <span className="text-xl font-serif font-bold tracking-wider text-white">
                {settings?.companyName ? settings.companyName.toUpperCase() : settings?.siteTitle ? settings.siteTitle.toUpperCase() : 'AURA HAVEN'}
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-light max-w-sm">
              The premier global real estate group specializing in private estates, waterfront villas, and architectural penthouses across key international financial capitals.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href={settings.socialLinks?.instagram || '#'}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-[#D4AF37] hover:border-[#D4AF37] transition-all"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={settings.socialLinks?.facebook || '#'}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-[#D4AF37] hover:border-[#D4AF37] transition-all"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={settings.socialLinks?.linkedin || '#'}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-[#D4AF37] hover:border-[#D4AF37] transition-all"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href={settings.socialLinks?.youtube || '#'}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-[#D4AF37] hover:border-[#D4AF37] transition-all"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-widest mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li>
                <button onClick={onNavigateHome} className="hover:text-[#D4AF37] transition-colors">
                  Home
                </button>
              </li>
              <li>
                <button onClick={onNavigateAllProperties} className="hover:text-[#D4AF37] transition-colors">
                  All Properties
                </button>
              </li>
              <li>
                <button onClick={onOpenAdmin} className="hover:text-[#D4AF37] transition-colors">
                  Admin Dashboard
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Property Types */}
          <div>
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-widest mb-4">
              Residences
            </h4>
            <ul className="space-y-2.5 text-xs font-medium text-slate-400">
              <li>Waterfront Villas</li>
              <li>Sky Penthouses</li>
              <li>Beverly Mansions</li>
              <li>French Chateaux</li>
              <li>Private Islands</li>
            </ul>
          </div>

          {/* Col 4: Newsletter */}
          <div>
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-widest mb-4">
              Private Journal
            </h4>
            <p className="text-xs text-slate-400 mb-3 font-light">
              Subscribe for quarterly off-market property intelligence reports.
            </p>
            {subscribed ? (
              <p className="text-xs text-[#D4AF37] font-semibold bg-[#D4AF37]/10 p-2.5 rounded-xl border border-[#D4AF37]/30">
                ✓ Subscribed to Private Journal
              </p>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="space-y-2">
                <input
                  type="email"
                  required
                  placeholder="Your Email Address..."
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#D4AF37] text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#F3E5AB] transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Subscribe</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} {settings.companyName || 'Aura Haven'}. All Rights Reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">Discretion Covenant</span>
          </div>
          <button
            onClick={scrollToTop}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-[#D4AF37] transition-all"
            title="Back to Top"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
}
