import React, { useState, useEffect } from 'react';
import { Save, Settings, CheckCircle2 } from 'lucide-react';
import { SiteSettings } from '../../types';

interface AdminSettingsProps {
  settings: SiteSettings;
  onRefresh: () => void;
}

export default function AdminSettings({ settings, onRefresh }: AdminSettingsProps) {
  const [formData, setFormData] = useState<SiteSettings>(settings);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setFormData(settings);
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem('aurahaven_settings', JSON.stringify(formData));
    } catch (err) {
      console.error('LocalStorage write error:', err);
    }
    fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    }).catch(() => {});
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    onRefresh();
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl">
        <h3 className="text-lg font-serif font-bold text-white mb-2 flex items-center gap-2">
          <Settings className="w-5 h-5 text-[#D4AF37]" /> Site Global Configuration
        </h3>
        <p className="text-xs text-slate-400 mb-6">
          Update brand metadata, contact phone numbers, office locations, and API configurations.
        </p>

        {saved && (
          <div className="mb-6 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> Global Site Settings Updated Successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-1">
                Site Brand Title
              </label>
              <input
                type="text"
                value={formData.siteTitle || ''}
                onChange={(e) => setFormData({ ...formData, siteTitle: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-1">
                Brand Tagline
              </label>
              <input
                type="text"
                value={formData.siteTagline || ''}
                onChange={(e) => setFormData({ ...formData, siteTagline: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
              />
            </div>
          </div>

          {/* Local SEO Automation Section */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-[#D4AF37]/30 space-y-4">
            <h4 className="text-xs font-mono font-bold text-[#D4AF37] uppercase tracking-wider flex items-center gap-2">
              📍 Local SEO Automation & Geo-Targeting
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-mono text-slate-300 uppercase tracking-widest block mb-1">
                  Target City (Auto H1 City Name)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Paso Robles"
                  value={formData.targetCity || ''}
                  onChange={(e) => {
                    const city = e.target.value;
                    const state = formData.targetState || 'CA';
                    const newH1 = city ? `Luxury Real Estate & Homes for Sale in ${city}, ${state}` : '';
                    setFormData({ ...formData, targetCity: city, seoCustomH1: newH1 });
                  }}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-[#D4AF37]/40 text-xs text-amber-200 font-semibold"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-slate-300 uppercase tracking-widest block mb-1">
                  Target State Code
                </label>
                <input
                  type="text"
                  placeholder="e.g. CA"
                  value={formData.targetState || ''}
                  onChange={(e) => setFormData({ ...formData, targetState: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-mono text-slate-300 uppercase tracking-widest block mb-1">
                Dynamic Main H1 Headline (Local SEO Tag)
              </label>
              <input
                type="text"
                placeholder="e.g. Luxury Real Estate & Homes for Sale in Paso Robles, CA"
                value={formData.seoCustomH1 || ''}
                onChange={(e) => setFormData({ ...formData, seoCustomH1: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-[#D4AF37]/40 text-xs text-amber-200"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono text-slate-300 uppercase tracking-widest block mb-1">
                Service Areas (Comma-separated for Schema & Local SEO)
              </label>
              <input
                type="text"
                placeholder="Paso Robles, Templeton, Atascadero, San Luis Obispo"
                value={formData.serviceAreas ? formData.serviceAreas.join(', ') : ''}
                onChange={(e) => setFormData({
                  ...formData,
                  serviceAreas: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-1">
                Contact Hotline Phone
              </label>
              <input
                type="text"
                value={formData.contactPhone}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-1">
                Concierge Email
              </label>
              <input
                type="email"
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-1">
              Headquarters Address
            </label>
            <input
              type="text"
              value={formData.officeAddress}
              onChange={(e) => setFormData({ ...formData, officeAddress: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-1">
                Currency Symbol
              </label>
              <input
                type="text"
                value={formData.currencySymbol}
                onChange={(e) => setFormData({ ...formData, currencySymbol: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-1">
                Google Maps API Key
              </label>
              <input
                type="password"
                placeholder="AI_Studio_Injected_Key..."
                value={formData.googleMapsApiKey}
                onChange={(e) => setFormData({ ...formData, googleMapsApiKey: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800">
            <button
              type="submit"
              className="px-8 py-3 rounded-xl bg-[#D4AF37] text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg"
            >
              <Save className="w-4 h-4" /> Save Site Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
