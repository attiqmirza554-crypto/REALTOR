import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Zap,
  Globe,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  X,
  Rocket,
  MapPin,
  Smartphone,
  Building,
  Mail,
  ExternalLink
} from 'lucide-react';
import { SiteSettings } from '../types';

interface AgencyQuickBarProps {
  settings: SiteSettings;
  onUpdateSettings: (newSettings: Partial<SiteSettings>) => void;
  onOpenBulkGenerator: () => void;
}

export default function AgencyQuickBar({
  settings,
  onUpdateSettings,
  onOpenBulkGenerator
}: AgencyQuickBarProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [copied, setCopied] = useState(false);

  // Local state for fast typing before applying
  const [clientNameInput, setClientNameInput] = useState(settings.companyName || 'Waterloo Luxury Real Estate');
  const [cityInput, setCityInput] = useState(settings.targetCity || 'Waterloo');
  const [stateInput, setStateInput] = useState(settings.targetState || 'ON');
  const [addressInput, setAddressInput] = useState(settings.officeAddress || '100 King St N, Waterloo, ON N2J 2X7');
  const [phoneInput, setPhoneInput] = useState(settings.contactPhone || '+1 (519) 555-0199');
  const [emailInput, setEmailInput] = useState(settings.contactEmail || 'contact@waterloorealty.com');

  // Keep inputs synchronized if settings prop changes from parent
  useEffect(() => {
    if (settings) {
      if (settings.companyName) setClientNameInput(settings.companyName);
      if (settings.targetCity) setCityInput(settings.targetCity);
      if (settings.targetState) setStateInput(settings.targetState);
      if (settings.officeAddress) setAddressInput(settings.officeAddress);
      if (settings.contactPhone) setPhoneInput(settings.contactPhone);
      if (settings.contactEmail) setEmailInput(settings.contactEmail);
    }
  }, [settings]);

  const handleApplyLive = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const formattedCity = cityInput
      .trim()
      .split(' ')
      .map(w => (w ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase() : ''))
      .join(' ');

    const customH1 = `Luxury Real Estate & Homes for Sale in ${formattedCity || 'Waterloo'}, ${stateInput || 'ON'}`;

    onUpdateSettings({
      targetCity: formattedCity || 'Waterloo',
      targetState: stateInput || 'ON',
      companyName: clientNameInput || 'Waterloo Luxury Real Estate',
      siteTitle: clientNameInput || 'Waterloo Luxury Real Estate',
      officeAddress: addressInput,
      contactPhone: phoneInput,
      contactEmail: emailInput,
      seoCustomH1: customH1
    });
  };

  const getShareableUrl = () => {
    let customDomain = '';
    try {
      customDomain = localStorage.getItem('aurahaven_custom_domain') || '';
    } catch (e) {
      // ignore
    }

    const baseOrigin = customDomain
      ? `https://${customDomain.replace(/^https?:\/\//i, '').replace(/\/+$/g, '')}`
      : (window.location.origin + window.location.pathname).replace(/\/+$/, '');

    const cleanName = clientNameInput.trim() || 'Client';
    const slugName = cleanName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');

    // If custom domain is set, produce ultra-clean path: https://customdomain.com/slug
    if (customDomain) {
      return `${baseOrigin}/${slugName}`;
    }

    // Produce compact encoded short URL containing all 6 details cleanly
    const compactObj: any = {
      n: cleanName,
      c: cityInput.trim() || 'Waterloo',
      s: stateInput.trim() || 'ON',
      p: phoneInput.trim() || '+1 (519) 555-0199',
    };
    if (addressInput.trim()) compactObj.a = addressInput.trim();
    if (emailInput.trim()) compactObj.e = emailInput.trim();

    try {
      const jsonStr = JSON.stringify(compactObj);
      const b64 = btoa(unescape(encodeURIComponent(jsonStr)));
      return `${baseOrigin}/?d=${b64}`;
    } catch (e) {
      return `${baseOrigin}/?agency=${slugName}`;
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(getShareableUrl());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-5 right-5 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-2xl hover:scale-105 border border-amber-300/50 transition-all duration-300"
        >
          <Zap className="w-4 h-4 text-slate-950 fill-current" />
          <span>🚀 Agency Live Bar</span>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-[96%] max-w-6xl bg-slate-950/95 border border-[#D4AF37]/50 rounded-2xl p-3 sm:p-4 shadow-2xl backdrop-blur-2xl text-white">
      {/* Header Bar */}
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
            <Zap className="w-4 h-4 fill-current" />
          </span>
          <div>
            <h3 className="text-xs font-bold text-amber-300 uppercase tracking-widest flex items-center gap-2">
              <span>Agency Live Customizer Bar</span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 text-[10px] lowercase font-mono">
                live sync active
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Type Name, Address, Phone, & City to update the live website immediately!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenBulkGenerator}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs hover:brightness-110 transition-all shadow-md"
          >
            <Rocket className="w-3.5 h-3.5" />
            <span>📊 Bulk CSV Generator (500+ Links)</span>
          </button>

          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Inputs Form - All 6 Details */}
      <form onSubmit={handleApplyLive} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2.5">
        <div>
          <label className="text-[10px] font-mono text-amber-400/90 uppercase block mb-1">
            Client Business Name
          </label>
          <div className="relative">
            <input
              type="text"
              value={clientNameInput}
              onChange={(e) => setClientNameInput(e.target.value)}
              placeholder="Client Name"
              className="w-full pl-7 pr-2 py-1.5 bg-slate-900 border border-slate-700 focus:border-[#D4AF37] rounded-xl text-xs text-white outline-none"
            />
            <Building className="w-3.5 h-3.5 text-slate-500 absolute left-2 top-2" />
          </div>
        </div>

        <div>
          <label className="text-[10px] font-mono text-amber-400/90 uppercase block mb-1">
            Target City
          </label>
          <div className="relative">
            <input
              type="text"
              value={cityInput}
              onChange={(e) => setCityInput(e.target.value)}
              placeholder="e.g. Waterloo"
              className="w-full pl-7 pr-2 py-1.5 bg-slate-900 border border-slate-700 focus:border-[#D4AF37] rounded-xl text-xs text-white outline-none"
            />
            <MapPin className="w-3.5 h-3.5 text-slate-500 absolute left-2 top-2" />
          </div>
        </div>

        <div>
          <label className="text-[10px] font-mono text-amber-400/90 uppercase block mb-1">
            State / Prov
          </label>
          <input
            type="text"
            value={stateInput}
            onChange={(e) => setStateInput(e.target.value)}
            placeholder="ON / CA"
            className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 focus:border-[#D4AF37] rounded-xl text-xs text-white outline-none"
          />
        </div>

        <div>
          <label className="text-[10px] font-mono text-amber-400/90 uppercase block mb-1">
            Street Address
          </label>
          <input
            type="text"
            value={addressInput}
            onChange={(e) => setAddressInput(e.target.value)}
            placeholder="123 Main St"
            className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 focus:border-[#D4AF37] rounded-xl text-xs text-white outline-none"
          />
        </div>

        <div>
          <label className="text-[10px] font-mono text-amber-400/90 uppercase block mb-1">
            Phone Number
          </label>
          <div className="relative">
            <input
              type="text"
              value={phoneInput}
              onChange={(e) => setPhoneInput(e.target.value)}
              placeholder="+1 555-0199"
              className="w-full pl-7 pr-2 py-1.5 bg-slate-900 border border-slate-700 focus:border-[#D4AF37] rounded-xl text-xs text-white outline-none"
            />
            <Smartphone className="w-3.5 h-3.5 text-slate-500 absolute left-2 top-2" />
          </div>
        </div>

        <div className="flex items-end gap-1.5">
          <button
            type="submit"
            className="flex-1 py-1.5 px-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-all shadow-md truncate flex items-center justify-center gap-1"
            title="Apply changes to live screen right now"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>Update Live</span>
          </button>
          <button
            type="button"
            onClick={() => window.open(getShareableUrl(), '_blank')}
            className="py-1.5 px-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-md flex items-center gap-1 shrink-0"
            title="Preview Generated Shareable URL in New Tab"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Preview</span>
          </button>
          <button
            type="button"
            onClick={handleCopyLink}
            className="p-1.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 shrink-0"
            title="Copy Shareable Link"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </form>
    </div>
  );
}
