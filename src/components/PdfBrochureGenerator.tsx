import React from 'react';
import { Property } from '../types';
import { Building2, Bed, Bath, Maximize2, Car, MapPin, CheckCircle2 } from 'lucide-react';

interface PdfBrochureGeneratorProps {
  property: Property;
  onClose: () => void;
}

export default function PdfBrochureGenerator({ property, onClose }: PdfBrochureGeneratorProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white text-slate-900 rounded-3xl max-w-4xl w-full p-8 shadow-2xl relative my-8 print:p-0 print:shadow-none print:m-0 print:w-full">
        {/* Printable Action Header (hidden during print) */}
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-200 print:hidden">
          <div>
            <h3 className="text-xl font-serif font-bold text-slate-900">Property Spec Brochure</h3>
            <p className="text-xs text-slate-500 font-mono">Print or save as PDF for offline presentation</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-5 py-2.5 rounded-xl bg-[#0F172A] text-[#D4AF37] font-bold text-xs uppercase tracking-wider shadow-lg hover:bg-slate-800"
            >
              Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-600 font-bold text-xs uppercase"
            >
              Close
            </button>
          </div>
        </div>

        {/* Brochure Content Container */}
        <div id="brochure-printable-area" className="space-y-6">
          {/* Header Banner */}
          <div className="flex items-center justify-between pb-4 border-b-2 border-[#D4AF37]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0F172A] flex items-center justify-center">
                <Building2 className="w-6 h-6 text-[#D4AF37]" />
              </div>
              <div>
                <h1 className="text-2xl font-serif font-bold text-[#0F172A] tracking-wider uppercase">
                  AURA HAVEN
                </h1>
                <span className="text-[10px] text-slate-500 font-mono tracking-widest uppercase block">
                  Private Estates Brochure
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-2xl font-serif font-bold text-[#B8860B] block">
                ${property.price.toLocaleString()}
              </span>
              <span className="text-xs font-mono text-slate-500">REF: {property.id}</span>
            </div>
          </div>

          {/* Property Main Image */}
          <div className="relative h-80 rounded-2xl overflow-hidden shadow-md">
            <img
              src={property.thumbnail}
              alt={property.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Title & Address */}
          <div>
            <h2 className="text-2xl font-serif font-bold text-slate-900">{property.title}</h2>
            <p className="text-sm text-slate-600 flex items-center gap-1.5 mt-1">
              <MapPin className="w-4 h-4 text-[#B8860B]" />
              {property.address}, {property.location}
            </p>
          </div>

          {/* Specs Bar */}
          <div className="grid grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
            <div>
              <span className="text-xs text-slate-500 uppercase font-mono block">Bedrooms</span>
              <span className="text-lg font-bold text-slate-900">{property.bedrooms} Suites</span>
            </div>
            <div>
              <span className="text-xs text-slate-500 uppercase font-mono block">Bathrooms</span>
              <span className="text-lg font-bold text-slate-900">{property.bathrooms} Baths</span>
            </div>
            <div>
              <span className="text-xs text-slate-500 uppercase font-mono block">Total Area</span>
              <span className="text-lg font-bold text-slate-900">
                {property.area.toLocaleString()} {property.areaUnit}
              </span>
            </div>
            <div>
              <span className="text-xs text-slate-500 uppercase font-mono block">Year Built</span>
              <span className="text-lg font-bold text-slate-900">{property.yearBuilt}</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-mono font-bold text-slate-900 uppercase tracking-wider mb-2">
              Estate Overview
            </h4>
            <p className="text-xs text-slate-700 leading-relaxed font-light">{property.description}</p>
          </div>

          {/* Amenities Grid */}
          <div>
            <h4 className="text-xs font-mono font-bold text-slate-900 uppercase tracking-wider mb-3">
              Included Amenities & Infrastructure
            </h4>
            <div className="grid grid-cols-3 gap-2">
              {property.amenities.map((amenity, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-slate-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#B8860B]" />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Agent Footer */}
          <div className="pt-6 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
            <div className="flex items-center gap-3">
              <img
                src={property.agent.photo}
                alt={property.agent.name}
                className="w-10 h-10 rounded-full object-cover border border-slate-300"
              />
              <div>
                <p className="font-bold text-slate-900">{property.agent.name}</p>
                <p className="text-[11px] text-slate-500">{property.agent.role}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-slate-900">{property.agent.phone}</p>
              <p className="text-[11px] text-slate-500">{property.agent.email}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
