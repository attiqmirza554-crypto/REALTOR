import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  MapPin,
  Phone,
  Mail,
  Send,
  MessageSquare,
  Building,
  CheckCircle2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SiteSettings } from '../types';

interface ContactSectionProps {
  settings: SiteSettings;
}

export default function ContactSection({ settings }: ContactSectionProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    type: 'contact'
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [selectedMapPin, setSelectedMapPin] = useState(settings?.targetCity || 'Paso Robles');

  const city = settings?.targetCity || 'Paso Robles';
  const state = settings?.targetState || 'CA';
  const serviceAreas = settings?.serviceAreas || ['Paso Robles', 'Templeton', 'Atascadero', 'San Luis Obispo'];

  const localSchema = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "name": settings.companyName || "Aura Haven Luxury Real Estate",
    "image": settings.logoUrl || "",
    "telephone": settings.contactPhone,
    "email": settings.contactEmail,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": settings.address || settings.officeAddress || "",
      "addressLocality": city,
      "addressRegion": state,
      "addressCountry": "US"
    },
    "areaServed": serviceAreas.map(a => ({ "@type": "AdministrativeArea", "name": a })),
    "priceRange": "$$$$"
  };

  const mapPins = [
    { city: city, coords: '35.6369° N, 120.6545° W', addr: settings.address || `${city}, ${state}` },
    { city: 'Beverly Hills', coords: '34.0736° N, 118.4004° W', addr: '9500 Wilshire Blvd, Beverly Hills, CA' },
    { city: 'Manhattan', coords: '40.7648° N, 73.9777° W', addr: '111 W 57th St, New York, NY' },
    { city: 'Palm Jumeirah', coords: '25.1124° N, 55.1390° E', addr: 'Palm Tower, Level 40, Dubai, UAE' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const newLead = {
      id: `lead-${Date.now()}`,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      type: formData.type || 'general_inquiry',
      propertyTitle: 'General Consultation',
      message: formData.message,
      createdAt: new Date().toISOString(),
      status: 'New'
    };

    try {
      // Save to localStorage
      const existingLeads = JSON.parse(localStorage.getItem('aurahaven_leads') || '[]');
      localStorage.setItem('aurahaven_leads', JSON.stringify([newLead, ...existingLeads]));

      // Try API background
      fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      }).catch(() => {});

      setSubmitted(true);
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    } catch (err) {
      console.error('Error submitting contact lead:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-[#0F172A] text-white relative">
      {/* Schema.org JSON-LD Script for Local SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localSchema) }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono font-semibold text-[#D4AF37] uppercase tracking-widest block mb-2">
            Discreet Consultation
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white mb-4">
            Connect With Our <span className="gold-text">Private Advisors</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base font-light">
            Whether inquiring about off-market properties or scheduling a confidential valuation, our global advisory team is at your disposal 24/7.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column - Contact Details & Interactive Map Simulator */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900/90 border border-slate-800 p-6 sm:p-8 rounded-3xl shadow-xl">
              <h3 className="text-xl font-serif font-bold text-white mb-6 flex items-center gap-2">
                <Building className="w-5 h-5 text-[#D4AF37]" />
                Global Flagship Offices
              </h3>

              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-[#D4AF37]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                      Headquarters Address
                    </h4>
                    <p className="text-sm font-semibold text-white mt-0.5">
                      {settings.address || '9500 Wilshire Blvd, Beverly Hills, CA'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-[#D4AF37]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                      Direct Concierge Line
                    </h4>
                    <a
                      href={`tel:${settings.contactPhone}`}
                      className="text-sm font-semibold text-white hover:text-[#D4AF37] transition-colors mt-0.5 block"
                    >
                      {settings.contactPhone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-[#D4AF37]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                      Encrypted Email
                    </h4>
                    <a
                      href={`mailto:${settings.contactEmail}`}
                      className="text-sm font-semibold text-white hover:text-[#D4AF37] transition-colors mt-0.5 block"
                    >
                      {settings.contactEmail}
                    </a>
                  </div>
                </div>
              </div>

              {/* WhatsApp Direct Chat Trigger */}
              <div className="mt-8 pt-6 border-t border-slate-800">
                <a
                  href={`https://wa.me/${settings.whatsappNumber}?text=Hello%20Aura%20Haven,%20I%20would%20like%20to%20inquire%20about%20a%20luxury%20property.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-3 shadow-lg shadow-emerald-600/20 transition-all duration-300"
                >
                  <MessageSquare className="w-4 h-4 fill-current" />
                  <span>Instant WhatsApp Private Chat</span>
                </a>
              </div>
            </div>

            {/* Interactive Office Location Map Selector */}
            <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-3xl">
              <h4 className="text-xs font-mono text-[#D4AF37] uppercase tracking-wider mb-3">
                Interactive Global Locations
              </h4>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {mapPins.map((pin) => (
                  <button
                    key={pin.city}
                    onClick={() => setSelectedMapPin(pin.city)}
                    className={`p-2.5 rounded-xl text-left text-xs font-semibold transition-all ${
                      selectedMapPin === pin.city
                        ? 'bg-[#D4AF37] text-slate-950 font-bold'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {pin.city}
                  </button>
                ))}
              </div>

              <div className="relative h-44 rounded-2xl overflow-hidden border border-slate-700 bg-slate-950 flex flex-col justify-end p-4">
                <img
                  src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=800&q=80"
                  alt="Global Map View"
                  className="absolute inset-0 w-full h-full object-cover opacity-30 filter contrast-125"
                />
                <div className="relative z-10 bg-slate-900/90 p-3 rounded-xl border border-slate-800 backdrop-blur-md">
                  <span className="text-[10px] text-[#D4AF37] font-mono block">
                    {mapPins.find((p) => p.city === selectedMapPin)?.coords}
                  </span>
                  <span className="text-xs font-bold text-white block">
                    {mapPins.find((p) => p.city === selectedMapPin)?.addr}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 p-8 sm:p-10 rounded-3xl shadow-2xl relative">
            {submitted ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 rounded-full bg-[#D4AF37]/20 border-2 border-[#D4AF37] flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-8 h-8 text-[#D4AF37]" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-white mb-2">Inquiry Received</h3>
                <p className="text-slate-300 text-sm max-w-md mx-auto mb-6">
                  Thank you for connecting with Aura Haven. A Senior Private Advisor will contact you within 2 business hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold uppercase tracking-wider"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h3 className="text-2xl font-serif font-bold text-white mb-2">
                  Send Confidential Message
                </h3>
                <p className="text-xs text-slate-400 mb-6 font-light">
                  Please provide your contact details and message below. All communications remain strictly encrypted.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Lord Charles Sterling"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-sm focus:outline-none focus:border-[#D4AF37] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. sterling@capital.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-sm focus:outline-none focus:border-[#D4AF37] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-1.5">
                    Phone / WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +1 (310) 555-0199"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-sm focus:outline-none focus:border-[#D4AF37] transition-colors"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-1.5">
                    Your Requirements / Message *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe your desired location, property specs, budget, or timeline..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-sm focus:outline-none focus:border-[#D4AF37] transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  id="submit-contact-form-btn"
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#AA7C11] text-slate-950 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-[#D4AF37]/20 hover:scale-[1.02] transition-all duration-300 disabled:opacity-50"
                >
                  <Send className="w-4 h-4 text-slate-950" />
                  <span>{loading ? 'Submitting Message...' : 'Submit Confidential Inquiry'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
