import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  MapPin,
  Heart,
  Scale,
  Share2,
  Printer,
  Bed,
  Bath,
  Maximize2,
  Car,
  Calendar,
  CheckCircle2,
  Phone,
  Mail,
  MessageSquare,
  Compass,
  School,
  Hospital,
  ShoppingBag,
  Train,
  Utensils,
  Video,
  Layers,
  ChevronLeft,
  ChevronRight,
  Send,
  X,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Property } from '../types';
import PropertyCard from './PropertyCard';
import PdfBrochureGenerator from './PdfBrochureGenerator';

interface PropertyDetailsViewProps {
  property: Property;
  allProperties: Property[];
  onBack: () => void;
  onSelectProperty: (property: Property) => void;
  isWishlisted: boolean;
  onToggleWishlist: (property: Property) => void;
  isCompared: boolean;
  onToggleCompare: (property: Property) => void;
  onShare: (property: Property) => void;
}

export default function PropertyDetailsView({
  property,
  allProperties,
  onBack,
  onSelectProperty,
  isWishlisted,
  onToggleWishlist,
  isCompared,
  onToggleCompare,
  onShare
}: PropertyDetailsViewProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'floorplan' | 'virtual' | 'map'>('overview');
  const [nearbyCategory, setNearbyCategory] = useState<'school' | 'hospital' | 'mall' | 'metro' | 'dining'>('school');
  const [brochureOpen, setBrochureOpen] = useState(false);

  // Visit Form State
  const [visitDate, setVisitDate] = useState('');
  const [visitTime, setVisitTime] = useState('14:00');
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientNote, setClientNote] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  const images = property.images && property.images.length > 0 ? property.images : [property.thumbnail];

  // Nearby places data generator based on coordinates
  const nearbyData = {
    school: [
      { name: 'Beverly Hills Preparatory Academy', dist: '0.8 miles', rating: '4.9 ★' },
      { name: 'International Baccalaureate College', dist: '1.4 miles', rating: '4.8 ★' }
    ],
    hospital: [
      { name: 'Cedars-Sinai Medical Center', dist: '2.1 miles', rating: '5.0 ★' },
      { name: 'St. John’s Health Institute', dist: '3.5 miles', rating: '4.9 ★' }
    ],
    mall: [
      { name: 'Rodeo Drive Luxury Avenue', dist: '1.2 miles', rating: '5.0 ★' },
      { name: 'Saks Fifth Avenue Flagship', dist: '1.5 miles', rating: '4.9 ★' }
    ],
    metro: [
      { name: 'Wilshire / Beverly Metro Station', dist: '0.9 miles', rating: '4.7 ★' },
      { name: 'Century City Transit Hub', dist: '1.8 miles', rating: '4.8 ★' }
    ],
    dining: [
      { name: 'Spago by Wolfgang Puck', dist: '0.7 miles', rating: '5.0 ★' },
      { name: 'Matsuhisa Japanese Dining', dist: '1.1 miles', rating: '4.9 ★' }
    ]
  };

  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);

    const newLead = {
      id: `lead-${Date.now()}`,
      name: clientName,
      email: clientEmail,
      phone: clientPhone,
      type: 'schedule_visit',
      propertyId: property.id,
      propertyTitle: property.title,
      preferredDate: visitDate,
      preferredTime: visitTime,
      message: clientNote,
      createdAt: new Date().toISOString(),
      status: 'New'
    };

    try {
      const existingLeads = JSON.parse(localStorage.getItem('aurahaven_leads') || '[]');
      localStorage.setItem('aurahaven_leads', JSON.stringify([newLead, ...existingLeads]));

      fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'schedule_visit',
          propertyId: property.id,
          propertyTitle: property.title,
          name: clientName,
          email: clientEmail,
          phone: clientPhone,
          message: clientNote,
          preferredDate: visitDate,
          preferredTime: visitTime
        })
      }).catch(() => {});

      setFormSubmitted(true);
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
    } catch (err) {
      console.error('Error submitting tour request:', err);
    } finally {
      setFormLoading(false);
    }
  };

  const similarProperties = allProperties
    .filter((p) => p.id !== property.id && (p.propertyType === property.propertyType || p.location === property.location))
    .slice(0, 3);

  return (
    <div className="pt-24 pb-24 bg-[#0F172A] text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Navigation Bar */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-[#D4AF37] transition-all text-xs font-semibold uppercase tracking-wider"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Portfolio</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setBrochureOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-[#D4AF37] text-slate-200 text-xs font-semibold flex items-center gap-2 transition-all"
              title="Download / Print Brochure"
            >
              <Printer className="w-4 h-4 text-[#D4AF37]" />
              <span className="hidden sm:inline">Brochure</span>
            </button>

            <button
              onClick={() => onShare(property)}
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 hover:text-white transition-all"
              title="Share Estate"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              onClick={() => onToggleCompare(property)}
              className={`p-2.5 rounded-xl border transition-all ${
                isCompared
                  ? 'bg-[#D4AF37] text-slate-950 border-[#D4AF37]'
                  : 'bg-slate-900 text-slate-200 border-slate-800 hover:text-white'
              }`}
              title="Compare Estate"
            >
              <Scale className="w-4 h-4" />
            </button>

            <button
              onClick={() => onToggleWishlist(property)}
              className={`p-2.5 rounded-xl border transition-all ${
                isWishlisted
                  ? 'bg-rose-500 text-white border-rose-500'
                  : 'bg-slate-900 text-slate-200 border-slate-800 hover:text-white'
              }`}
              title="Save to Wishlist"
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Gallery Showcase Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-10">
          {/* Main Selected Image */}
          <div
            onClick={() => setLightboxOpen(true)}
            className="lg:col-span-8 relative h-[380px] sm:h-[480px] rounded-3xl overflow-hidden cursor-pointer group bg-slate-950 border border-slate-800"
          >
            <img
              src={images[selectedImageIndex]}
              alt={property.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

            {/* Price Tag Overlay */}
            <div className="absolute bottom-6 left-6 z-10">
              <span className="text-3xl sm:text-4xl font-serif font-bold gold-text">
                ${property.price.toLocaleString()}
              </span>
              <p className="text-xs text-slate-300 font-mono mt-1">{property.purpose} | Ref #{property.id}</p>
            </div>

            <div className="absolute bottom-6 right-6 z-10 px-4 py-2 rounded-xl bg-slate-900/90 text-white text-xs font-semibold border border-slate-700 backdrop-blur-md">
              Click to Expand ({images.length} Photos)
            </div>
          </div>

          {/* Thumbnails Column */}
          <div className="lg:col-span-4 grid grid-cols-2 lg:grid-cols-1 gap-4">
            {images.slice(0, 3).map((img, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedImageIndex(idx)}
                className={`relative h-[115px] sm:h-[150px] rounded-2xl overflow-hidden cursor-pointer border-2 transition-all ${
                  idx === selectedImageIndex ? 'border-[#D4AF37] scale-[0.98]' : 'border-slate-800 hover:border-slate-600'
                }`}
              >
                <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Property Information Overview & Sticky Agent Contact Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mb-16">
          {/* Left Details Column */}
          <div className="lg:col-span-8 space-y-10">
            {/* Title & Location Header */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="px-3 py-1 rounded-lg bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-bold uppercase tracking-wider">
                  {property.propertyType}
                </span>
                <span className="px-3 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                  {property.status}
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white mb-3">
                {property.title}
              </h1>

              <p className="text-slate-300 text-sm flex items-center gap-2 font-medium">
                <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>{property.address}, {property.location}, {property.zipCode}</span>
              </p>
            </div>

            {/* Key Specs Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 rounded-3xl bg-slate-900/90 border border-slate-800 text-center">
              <div>
                <span className="text-slate-400 text-xs font-mono uppercase block mb-1">Bedrooms</span>
                <span className="text-2xl font-serif font-bold text-white">{property.bedrooms} Suites</span>
              </div>
              <div className="border-l border-slate-800">
                <span className="text-slate-400 text-xs font-mono uppercase block mb-1">Bathrooms</span>
                <span className="text-2xl font-serif font-bold text-white">{property.bathrooms} Baths</span>
              </div>
              <div className="border-l border-slate-800">
                <span className="text-slate-400 text-xs font-mono uppercase block mb-1">Total Sq.Ft</span>
                <span className="text-2xl font-serif font-bold text-[#D4AF37]">
                  {property.area.toLocaleString()}
                </span>
              </div>
              <div className="border-l border-slate-800">
                <span className="text-slate-400 text-xs font-mono uppercase block mb-1">Year Built</span>
                <span className="text-2xl font-serif font-bold text-white">{property.yearBuilt}</span>
              </div>
            </div>

            {/* Interactive Tabs Header (Overview, Floor Plan, Virtual Tour, Map & Nearby) */}
            <div className="border-b border-slate-800 flex items-center gap-4 overflow-x-auto custom-scrollbar">
              <button
                onClick={() => setActiveTab('overview')}
                className={`pb-3 text-xs font-mono font-bold uppercase tracking-wider transition-all border-b-2 whitespace-nowrap ${
                  activeTab === 'overview'
                    ? 'border-[#D4AF37] text-[#D4AF37]'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                Overview & Specs
              </button>
              <button
                onClick={() => setActiveTab('floorplan')}
                className={`pb-3 text-xs font-mono font-bold uppercase tracking-wider transition-all border-b-2 whitespace-nowrap ${
                  activeTab === 'floorplan'
                    ? 'border-[#D4AF37] text-[#D4AF37]'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                Architectural Floor Plan
              </button>
              <button
                onClick={() => setActiveTab('virtual')}
                className={`pb-3 text-xs font-mono font-bold uppercase tracking-wider transition-all border-b-2 whitespace-nowrap ${
                  activeTab === 'virtual'
                    ? 'border-[#D4AF37] text-[#D4AF37]'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                3D Virtual Tour
              </button>
              <button
                onClick={() => setActiveTab('map')}
                className={`pb-3 text-xs font-mono font-bold uppercase tracking-wider transition-all border-b-2 whitespace-nowrap ${
                  activeTab === 'map'
                    ? 'border-[#D4AF37] text-[#D4AF37]'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                Location & Nearby Places
              </button>
            </div>

            {/* Tab Contents */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Description */}
                <div>
                  <h3 className="text-xl font-serif font-bold text-white mb-3">Architectural Description</h3>
                  <p className="text-slate-300 text-sm leading-relaxed font-light whitespace-pre-line">
                    {property.description}
                  </p>
                </div>

                {/* Amenities Checklist */}
                <div>
                  <h3 className="text-xl font-serif font-bold text-white mb-4">Included Luxury Amenities</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {property.amenities.map((amenity, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-semibold text-slate-200"
                      >
                        <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0" />
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'floorplan' && (
              <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 text-center">
                <h3 className="text-lg font-serif font-bold text-white mb-2">Architectural Blueprint</h3>
                <p className="text-xs text-slate-400 mb-6">Interactive 2D/3D floor layout with dimension guides.</p>
                <div className="relative rounded-2xl overflow-hidden border border-slate-700 bg-slate-950 p-4 max-w-2xl mx-auto">
                  <img
                    src={property.floorPlan || 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1000&q=80'}
                    alt="Floor Plan"
                    className="w-full h-auto object-contain rounded-xl"
                  />
                </div>
              </div>
            )}

            {activeTab === 'virtual' && (
              <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 text-center">
                <h3 className="text-lg font-serif font-bold text-white mb-2">3D Matterport Virtual Tour</h3>
                <p className="text-xs text-slate-400 mb-6">Explore every room in full 360-degree spatial depth.</p>
                <div className="relative h-96 rounded-2xl overflow-hidden border border-slate-700 bg-slate-950 flex flex-col items-center justify-center p-6">
                  <Video className="w-16 h-16 text-[#D4AF37] mb-4 animate-bounce" />
                  <h4 className="text-base font-serif font-bold text-white mb-2">Launch Interactive 3D Tour</h4>
                  <p className="text-xs text-slate-400 max-w-md mb-6">
                    Spatial 3D walk-through model initialized for {property.title}.
                  </p>
                  <a
                    href={property.virtualTourUrl || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg"
                  >
                    Open Fullscreen Tour
                  </a>
                </div>
              </div>
            )}

            {activeTab === 'map' && (
              <div className="space-y-6">
                <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800">
                  <h3 className="text-lg font-serif font-bold text-white mb-4">Location Coordinates</h3>
                  <div className="relative h-64 rounded-2xl overflow-hidden border border-slate-700 bg-slate-950 flex items-center justify-center">
                    <img
                      src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1200&q=80"
                      alt="Map View"
                      className="w-full h-full object-cover opacity-40"
                    />
                    <div className="absolute z-10 bg-slate-900/90 p-4 rounded-2xl border border-[#D4AF37]/40 text-center backdrop-blur-md">
                      <MapPin className="w-8 h-8 text-[#D4AF37] mx-auto mb-1 animate-pulse" />
                      <span className="text-xs font-bold text-white block">{property.address}</span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        LAT: {property.coordinates.lat} | LNG: {property.coordinates.lng}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Nearby Places Filters */}
                <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800">
                  <h4 className="text-sm font-serif font-bold text-white mb-4">Nearby Points of Interest</h4>
                  <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2 custom-scrollbar">
                    <button
                      onClick={() => setNearbyCategory('school')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                        nearbyCategory === 'school' ? 'bg-[#D4AF37] text-slate-950 font-bold' : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      <School className="w-3.5 h-3.5" /> Schools
                    </button>
                    <button
                      onClick={() => setNearbyCategory('hospital')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                        nearbyCategory === 'hospital' ? 'bg-[#D4AF37] text-slate-950 font-bold' : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      <Hospital className="w-3.5 h-3.5" /> Hospitals
                    </button>
                    <button
                      onClick={() => setNearbyCategory('mall')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                        nearbyCategory === 'mall' ? 'bg-[#D4AF37] text-slate-950 font-bold' : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      <ShoppingBag className="w-3.5 h-3.5" /> Malls
                    </button>
                    <button
                      onClick={() => setNearbyCategory('metro')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                        nearbyCategory === 'metro' ? 'bg-[#D4AF37] text-slate-950 font-bold' : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      <Train className="w-3.5 h-3.5" /> Metro
                    </button>
                    <button
                      onClick={() => setNearbyCategory('dining')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                        nearbyCategory === 'dining' ? 'bg-[#D4AF37] text-slate-950 font-bold' : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      <Utensils className="w-3.5 h-3.5" /> Fine Dining
                    </button>
                  </div>

                  <div className="space-y-2">
                    {nearbyData[nearbyCategory].map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 text-xs font-medium"
                      >
                        <span className="text-white">{item.name}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-[#D4AF37] font-bold">{item.dist}</span>
                          <span className="text-slate-400 font-mono">{item.rating}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Sticky Column - Agent Card & Book Visit Form */}
          <div className="lg:col-span-4 space-y-6 sticky top-24">
            {/* Agent Contact Card */}
            <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-3xl shadow-xl">
              <div className="flex items-center gap-4 mb-5 pb-5 border-b border-slate-800">
                <img
                  src={property.agent.photo}
                  alt={property.agent.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-[#D4AF37]"
                />
                <div>
                  <h4 className="text-base font-serif font-bold text-white">{property.agent.name}</h4>
                  <span className="text-xs text-[#D4AF37] font-mono block">{property.agent.role}</span>
                  <span className="text-[11px] text-slate-400">Aura Haven Senior Advisory</span>
                </div>
              </div>

              <div className="space-y-2 mb-6 text-xs">
                <a
                  href={`tel:${property.agent.phone}`}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-800 text-slate-200 hover:text-white flex items-center gap-2 font-medium"
                >
                  <Phone className="w-4 h-4 text-[#D4AF37]" />
                  <span>{property.agent.phone}</span>
                </a>
                <a
                  href={`mailto:${property.agent.email}`}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-800 text-slate-200 hover:text-white flex items-center gap-2 font-medium truncate"
                >
                  <Mail className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <span className="truncate">{property.agent.email}</span>
                </a>
              </div>

              <a
                href={`https://wa.me/${property.agent.whatsapp}?text=Hi%20${encodeURIComponent(property.agent.name)},%20I%20am%20interested%20in%20${encodeURIComponent(property.title)}%20(Ref:%20${property.id}).`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all"
              >
                <MessageSquare className="w-4 h-4 fill-current" />
                <span>WhatsApp Private Agent</span>
              </a>
            </div>

            {/* Schedule Private Visit Form */}
            <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-3xl shadow-xl">
              <h4 className="text-lg font-serif font-bold text-white mb-2 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#D4AF37]" />
                Schedule Private Viewing
              </h4>
              <p className="text-xs text-slate-400 mb-5 font-light">
                Request a confidential in-person or virtual walkthrough.
              </p>

              {formSubmitted ? (
                <div className="text-center py-8">
                  <CheckCircle2 className="w-12 h-12 text-[#D4AF37] mx-auto mb-3" />
                  <h5 className="text-base font-serif font-bold text-white mb-1">Viewing Request Sent</h5>
                  <p className="text-xs text-slate-300">
                    Your viewing slot for {visitDate} at {visitTime} has been submitted to {property.agent.name}.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleScheduleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-1">
                        Preferred Date *
                      </label>
                      <input
                        type="date"
                        required
                        value={visitDate}
                        onChange={(e) => setVisitDate(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-1">
                        Time Slot *
                      </label>
                      <select
                        value={visitTime}
                        onChange={(e) => setVisitTime(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                      >
                        <option value="10:00">10:00 AM</option>
                        <option value="12:00">12:00 PM</option>
                        <option value="14:00">02:00 PM</option>
                        <option value="16:00">04:00 PM</option>
                        <option value="18:00">06:00 PM</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <input
                      type="text"
                      required
                      placeholder="Your Full Name *"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <input
                      type="email"
                      required
                      placeholder="Your Email *"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <input
                      type="tel"
                      required
                      placeholder="Your Phone Number *"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={formLoading}
                    id="schedule-visit-submit-btn"
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#AA7C11] text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#D4AF37]/20 hover:scale-[1.02] transition-all"
                  >
                    <Send className="w-3.5 h-3.5 text-slate-950" />
                    <span>{formLoading ? 'Booking Slot...' : 'Confirm Visit Booking'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Similar Properties Section */}
        {similarProperties.length > 0 && (
          <div className="pt-16 border-t border-slate-800">
            <span className="text-xs font-mono font-semibold text-[#D4AF37] uppercase tracking-widest block mb-2">
              Curated Alternatives
            </span>
            <h3 className="text-2xl font-serif font-bold text-white mb-8">
              Similar Luxury Estates
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {similarProperties.map((similar) => (
                <PropertyCard
                  key={similar.id}
                  property={similar}
                  onSelectProperty={onSelectProperty}
                  isWishlisted={false}
                  onToggleWishlist={onToggleWishlist}
                  isCompared={false}
                  onToggleCompare={onToggleCompare}
                  onShare={onShare}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-6 right-6 p-3 rounded-full bg-slate-800 text-white hover:bg-[#D4AF37] hover:text-slate-950"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={images[selectedImageIndex]}
            alt="Fullscreen"
            className="max-w-full max-h-[85vh] object-contain rounded-2xl"
          />
        </div>
      )}

      {/* Downloadable PDF Brochure Modal */}
      {brochureOpen && (
        <PdfBrochureGenerator property={property} onClose={() => setBrochureOpen(false)} />
      )}
    </div>
  );
}
