import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Building2,
  Heart,
  Scale,
  Calendar,
  Menu,
  X,
  UserCheck,
  Search,
  Rocket,
  Zap
} from 'lucide-react';
import { SiteSettings } from '../types';

interface NavbarProps {
  settings?: SiteSettings;
  onNavigateHome: () => void;
  onNavigateAllProperties: () => void;
  onOpenAdmin: () => void;
  onOpenAgencyGenerator?: () => void;
  wishlistCount: number;
  compareCount: number;
  onOpenWishlist: () => void;
  onOpenCompare: () => void;
  onOpenScheduleVisit: () => void;
  onOpenSearch: () => void;
}

export default function Navbar({
  settings,
  onNavigateHome,
  onNavigateAllProperties,
  onOpenAdmin,
  onOpenAgencyGenerator,
  wishlistCount,
  compareCount,
  onOpenWishlist,
  onOpenCompare,
  onOpenScheduleVisit,
  onOpenSearch
}: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'home', label: 'Home', action: onNavigateHome },
    { id: 'all-properties', label: 'All Estates', action: onNavigateAllProperties }
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#0F172A]/90 backdrop-blur-md shadow-xl py-3 border-b border-[#D4AF37]/20 text-white'
            : 'bg-gradient-to-b from-[#0F172A]/90 via-[#0F172A]/60 to-transparent py-5 text-white'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={onNavigateHome}
            className="flex items-center gap-3 group text-left focus:outline-none"
            id="nav-logo-btn"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#D4AF37] via-[#F3E5AB] to-[#AA7C11] p-0.5 shadow-lg shadow-[#D4AF37]/20 group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-[#0F172A] rounded-[10px] flex items-center justify-center">
                <Building2 className="w-6 h-6 text-[#D4AF37]" />
              </div>
            </div>
            <div>
              <span className="text-xl font-serif font-bold tracking-wider text-white block group-hover:text-[#D4AF37] transition-colors">
                {settings?.companyName ? settings.companyName.toUpperCase() : settings?.siteTitle ? settings.siteTitle.toUpperCase() : 'AURA HAVEN'}
              </span>
              <span className="text-[10px] text-slate-400 tracking-widest uppercase block font-mono">
                Luxury Real Estate
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/40 backdrop-blur-md p-1.5 rounded-full border border-slate-700/50">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={link.action}
                className="px-5 py-2 text-xs font-semibold tracking-wider uppercase rounded-full text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all duration-300"
              >
                {link.label}
              </button>
            ))}
            <a
              href="#about"
              onClick={onNavigateHome}
              className="px-4 py-2 text-xs font-semibold tracking-wider uppercase text-slate-300 hover:text-white rounded-full transition-all"
            >
              About Us
            </a>
            <a
              href="#contact"
              onClick={onNavigateHome}
              className="px-4 py-2 text-xs font-semibold tracking-wider uppercase text-slate-300 hover:text-white rounded-full transition-all"
            >
              Contact
            </a>
          </nav>

          {/* Action CTAs */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Quick Search Trigger */}
            <button
              onClick={onOpenSearch}
              id="quick-search-btn"
              className="p-2.5 rounded-xl bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700 transition-colors"
              title="Quick Property Search"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Compare Badge */}
            <button
              onClick={onOpenCompare}
              id="compare-badge-btn"
              className="relative p-2.5 rounded-xl bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700 transition-colors"
              title="Compare Properties"
            >
              <Scale className="w-4 h-4" />
              {compareCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#D4AF37] text-slate-950 font-bold text-[10px] rounded-full flex items-center justify-center">
                  {compareCount}
                </span>
              )}
            </button>

            {/* Wishlist Badge */}
            <button
              onClick={onOpenWishlist}
              id="wishlist-badge-btn"
              className="relative p-2.5 rounded-xl bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700 transition-colors"
              title="Saved Wishlist"
            >
              <Heart className="w-4 h-4 text-rose-400" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white font-bold text-[10px] rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Agency Master Generator Shortcut */}
            {onOpenAgencyGenerator && (
              <button
                onClick={onOpenAgencyGenerator}
                id="agency-master-nav-btn"
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold tracking-wider transition-all border bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-amber-500/20 text-amber-300 border-amber-500/40 hover:brightness-125 shadow-md shadow-amber-500/10"
              >
                <Rocket className="w-4 h-4 text-[#D4AF37]" />
                <span>🚀 Agency 500+ Generator</span>
              </button>
            )}

            {/* Admin Portal Shortcut */}
            <button
              onClick={onOpenAdmin}
              id="admin-portal-nav-btn"
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wider transition-all border bg-slate-800/90 text-slate-300 border-slate-700 hover:text-white hover:bg-slate-700"
            >
              <UserCheck className="w-4 h-4 text-[#D4AF37]" />
              <span>Admin Portal</span>
            </button>

            {/* Book Visit CTA */}
            <button
              onClick={onOpenScheduleVisit}
              id="book-visit-nav-btn"
              className="relative group overflow-hidden px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#AA7C11] text-slate-950 font-semibold text-xs tracking-wider uppercase shadow-lg shadow-[#D4AF37]/20 hover:shadow-xl hover:shadow-[#D4AF37]/30 transition-all duration-300 flex items-center gap-2"
            >
              <Calendar className="w-4 h-4 text-slate-950" />
              <span>Book Visit</span>
            </button>
          </div>

          {/* Mobile Menu Hamburger */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={onOpenWishlist}
              className="relative p-2 rounded-lg bg-slate-800/80 text-slate-200"
            >
              <Heart className="w-5 h-5 text-rose-400" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              id="mobile-menu-toggle-btn"
              className="p-2.5 rounded-xl bg-slate-800 text-slate-200 hover:text-white border border-slate-700"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-0 top-[70px] z-40 bg-[#0F172A] border-b border-[#D4AF37]/30 shadow-2xl lg:hidden p-6 text-white"
          >
            <div className="flex flex-col gap-4">
              <button
                onClick={() => {
                  onNavigateHome();
                  setMobileMenuOpen(false);
                }}
                className="text-left py-2.5 px-4 rounded-xl text-sm font-semibold tracking-wider uppercase text-slate-300 hover:bg-slate-800"
              >
                Home
              </button>
              <button
                onClick={() => {
                  onNavigateAllProperties();
                  setMobileMenuOpen(false);
                }}
                className="text-left py-2.5 px-4 rounded-xl text-sm font-semibold tracking-wider uppercase text-slate-300 hover:bg-slate-800"
              >
                All Estates
              </button>

              <div className="pt-4 border-t border-slate-800 flex flex-col gap-3">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenCompare();
                    }}
                    className="flex items-center justify-center gap-2 p-3 rounded-xl bg-slate-800 text-slate-200 text-xs font-semibold"
                  >
                    <Scale className="w-4 h-4 text-[#D4AF37]" />
                    Compare ({compareCount})
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenAdmin();
                    }}
                    className="col-span-2 flex items-center justify-center gap-2 p-3 rounded-xl bg-slate-800 text-slate-200 text-xs font-semibold"
                  >
                    <UserCheck className="w-4 h-4 text-[#D4AF37]" />
                    Admin Portal
                  </button>
                </div>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenScheduleVisit();
                  }}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#AA7C11] text-slate-950 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-[#D4AF37]/20"
                >
                  <Calendar className="w-4 h-4" />
                  Book Private Visit
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
