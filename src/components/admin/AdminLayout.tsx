import React, { useState } from 'react';
import {
  LayoutDashboard,
  Building,
  Users,
  MessageSquare,
  Settings,
  LogOut,
  ExternalLink,
  ShieldCheck,
  Building2,
  Menu,
  X,
  Sparkles,
  Rocket
} from 'lucide-react';
import { User } from '../../types';

interface AdminLayoutProps {
  user: User;
  activeSection: string;
  setActiveSection: (sec: string) => void;
  onLogout: () => void;
  onViewPublicSite: () => void;
  isAgencyMaster?: boolean;
  onToggleAgencyMaster?: () => void;
  companyName?: string;
  children: React.ReactNode;
}

export default function AdminLayout({
  user,
  activeSection,
  setActiveSection,
  onLogout,
  onViewPublicSite,
  isAgencyMaster = false,
  onToggleAgencyMaster,
  companyName,
  children
}: AdminLayoutProps) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [logoClicks, setLogoClicks] = useState(0);

  // Secret Logo Click Handler (5 clicks unlocks Agency Master Mode)
  const handleLogoClick = () => {
    const newCount = logoClicks + 1;
    setLogoClicks(newCount);
    if (newCount >= 5) {
      setLogoClicks(0);
      if (onToggleAgencyMaster) onToggleAgencyMaster();
    }
  };

  // Secret Keyboard Shortcut (Ctrl+Shift+M or Cmd+Shift+M)
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'm') {
        e.preventDefault();
        if (onToggleAgencyMaster) onToggleAgencyMaster();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onToggleAgencyMaster]);

  // Navigation menu items: Website Generator is ONLY visible to Agency Master
  const menuItems = [
    ...(isAgencyMaster
      ? [{ id: 'generator', label: '🚀 Master Generator', icon: Rocket, highlight: true }]
      : []),
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'properties', label: 'Properties', icon: Building },
    { id: 'leads', label: 'Leads & Inquiries', icon: Users },
    { id: 'testimonials', label: 'Client Reviews', icon: MessageSquare },
    { id: 'settings', label: 'Site Settings', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-[#0F172A] text-white flex flex-col md:flex-row">
      {/* Mobile Header Bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Building2 className="w-6 h-6 text-[#D4AF37]" />
          <span className="font-serif font-bold text-white">Aura Haven Admin</span>
        </div>
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-2 rounded-xl bg-slate-800 text-slate-300"
        >
          {mobileSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`w-full md:w-64 bg-slate-900/90 border-r border-slate-800 p-6 flex flex-col justify-between shrink-0 ${
          mobileSidebarOpen ? 'block' : 'hidden md:flex'
        }`}
      >
        <div>
          {/* Admin Logo */}
          <div 
            onClick={handleLogoClick} 
            className="flex items-center gap-3 mb-8 cursor-pointer group select-none"
            title="Aura Haven Executive Portal"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#D4AF37] to-[#AA7C11] p-0.5 shadow-md group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#0F172A] rounded-[10px] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-[#D4AF37]" />
              </div>
            </div>
            <div>
              <span className="text-sm font-serif font-bold text-white block uppercase">
                {companyName || 'Aura Haven'}
              </span>
              <span className="text-[10px] text-amber-400 font-mono uppercase block">Admin Portal</span>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id);
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                    isActive
                      ? 'bg-[#D4AF37] text-slate-950 font-bold shadow-lg shadow-[#D4AF37]/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="pt-6 border-t border-slate-800 space-y-3">
          {onToggleAgencyMaster && isAgencyMaster && (
            <button
              onClick={onToggleAgencyMaster}
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold transition-all border bg-amber-500/10 border-amber-500/40 text-amber-300 hover:bg-amber-500/20"
              title="Click to exit Agency Master mode"
            >
              <div className="flex items-center gap-2">
                <Rocket className="w-4 h-4 text-[#D4AF37]" />
                <span>🚀 Agency Master Mode</span>
              </div>
              <span className="text-[10px] text-amber-400/80 font-mono">Exit</span>
            </button>
          )}

          <button
            onClick={onViewPublicSite}
            className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
          >
            <ExternalLink className="w-4 h-4 text-[#D4AF37]" />
            <span>Public Website</span>
          </button>

          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white text-xs font-semibold transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Body Area */}
      <main className="flex-grow p-6 sm:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
        {/* Top User Bar */}
        <div className="flex items-center justify-between pb-6 mb-8 border-b border-slate-800">
          <div>
            <h1 className="text-2xl font-serif font-bold text-white capitalize">
              {activeSection} Management
            </h1>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Logged in as <strong className="text-[#D4AF37]">{user.name}</strong> ({user.email})
            </p>
          </div>
        </div>

        {children}
      </main>
    </div>
  );
}
