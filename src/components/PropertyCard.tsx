import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Heart,
  Scale,
  Share2,
  Bed,
  Bath,
  Maximize2,
  Car,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Eye
} from 'lucide-react';
import { Property } from '../types';

interface PropertyCardProps {
  key?: string;
  property: Property;
  onSelectProperty: (property: Property) => void;
  isWishlisted: boolean;
  onToggleWishlist: (property: Property) => void;
  isCompared: boolean;
  onToggleCompare: (property: Property) => void;
  onShare: (property: Property) => void;
}

export default function PropertyCard({
  property,
  onSelectProperty,
  isWishlisted,
  onToggleWishlist,
  isCompared,
  onToggleCompare,
  onShare
}: PropertyCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = property.images && property.images.length > 0 ? property.images : [property.thumbnail];

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      className="group bg-slate-900/90 border border-slate-800 hover:border-[#D4AF37]/50 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-[#D4AF37]/10 transition-all duration-300 flex flex-col h-full"
    >
      {/* Image Gallery Container */}
      <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-slate-950 group">
        <img
          src={images[currentImageIndex]}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 cursor-pointer"
          onClick={() => onSelectProperty(property)}
        />

        {/* Overlay Dark Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/40 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5 z-10">
          {property.isFeatured && (
            <span className="px-2.5 py-1 rounded-md bg-[#D4AF37] text-slate-950 font-bold text-[10px] uppercase tracking-wider shadow-md">
              Featured
            </span>
          )}
          <span className="px-2.5 py-1 rounded-md bg-slate-900/90 text-white font-medium text-[10px] uppercase tracking-wider backdrop-blur-md border border-slate-700">
            For {property.purpose}
          </span>
          <span
            className={`px-2.5 py-1 rounded-md font-semibold text-[10px] uppercase tracking-wider backdrop-blur-md ${
              property.status === 'Ready'
                ? 'bg-emerald-500/80 text-white'
                : property.status === 'Upcoming'
                ? 'bg-amber-500/80 text-white'
                : 'bg-rose-500/80 text-white'
            }`}
          >
            {property.status}
          </span>
        </div>

        {/* Top Right Action Buttons */}
        <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(property);
            }}
            className={`p-2 rounded-xl backdrop-blur-md border transition-all ${
              isWishlisted
                ? 'bg-rose-500 text-white border-rose-400 scale-110'
                : 'bg-slate-900/80 text-slate-200 border-slate-700 hover:text-white hover:bg-slate-800'
            }`}
            title="Add to Wishlist"
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleCompare(property);
            }}
            className={`p-2 rounded-xl backdrop-blur-md border transition-all ${
              isCompared
                ? 'bg-[#D4AF37] text-slate-950 border-[#D4AF37] scale-110'
                : 'bg-slate-900/80 text-slate-200 border-slate-700 hover:text-white hover:bg-slate-800'
            }`}
            title="Compare Property"
          >
            <Scale className="w-4 h-4" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onShare(property);
            }}
            className="p-2 rounded-xl bg-slate-900/80 text-slate-200 border border-slate-700 hover:text-white hover:bg-slate-800 backdrop-blur-md transition-all"
            title="Share Estate"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        {/* Gallery Navigation Arrows */}
        {images.length > 1 && (
          <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity z-10">
            <button
              onClick={handlePrevImage}
              className="p-1.5 rounded-full bg-slate-900/80 text-white hover:bg-[#D4AF37] hover:text-slate-950 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextImage}
              className="p-1.5 rounded-full bg-slate-900/80 text-white hover:bg-[#D4AF37] hover:text-slate-950 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Image Dots */}
        {images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 z-10">
            {images.map((_, i) => (
              <span
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  i === currentImageIndex ? 'bg-[#D4AF37] w-3' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Card Content Body */}
      <div className="p-5 flex flex-col justify-between flex-grow">
        <div>
          {/* Price & Location */}
          <div className="flex items-baseline justify-between gap-2 mb-2">
            <div>
              <span className="text-xl font-serif font-bold text-[#D4AF37]">
                ${property.price.toLocaleString()}
              </span>
              {property.purpose === 'Rent' && (
                <span className="text-xs text-slate-400 font-mono"> / mo</span>
              )}
            </div>
            <span className="text-xs text-slate-400 font-mono uppercase tracking-wider">
              {property.propertyType}
            </span>
          </div>

          {/* Title */}
          <h3
            onClick={() => onSelectProperty(property)}
            className="text-base font-serif font-bold text-white group-hover:text-[#D4AF37] transition-colors cursor-pointer line-clamp-1 mb-2"
          >
            {property.title}
          </h3>

          {/* Address / Location */}
          <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-4">
            <MapPin className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
            <span className="truncate">{property.location}</span>
          </div>

          {/* Key Specs Bar */}
          <div className="grid grid-cols-4 gap-2 py-3 px-2 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-300 text-[11px] font-medium text-center mb-4">
            <div className="flex flex-col items-center justify-center">
              <span className="flex items-center gap-1 text-slate-400">
                <Bed className="w-3.5 h-3.5 text-[#D4AF37]" /> Beds
              </span>
              <span className="font-semibold text-white mt-0.5">{property.bedrooms}</span>
            </div>
            <div className="flex flex-col items-center justify-center border-l border-slate-800">
              <span className="flex items-center gap-1 text-slate-400">
                <Bath className="w-3.5 h-3.5 text-[#D4AF37]" /> Baths
              </span>
              <span className="font-semibold text-white mt-0.5">{property.bathrooms}</span>
            </div>
            <div className="flex flex-col items-center justify-center border-l border-slate-800">
              <span className="flex items-center gap-1 text-slate-400">
                <Maximize2 className="w-3.5 h-3.5 text-[#D4AF37]" /> Area
              </span>
              <span className="font-semibold text-white mt-0.5">
                {property.area.toLocaleString()} {property.areaUnit}
              </span>
            </div>
            <div className="flex flex-col items-center justify-center border-l border-slate-800">
              <span className="flex items-center gap-1 text-slate-400">
                <Car className="w-3.5 h-3.5 text-[#D4AF37]" /> Garage
              </span>
              <span className="font-semibold text-white mt-0.5">{property.parking}</span>
            </div>
          </div>
        </div>

        {/* View Details CTA */}
        <button
          onClick={() => onSelectProperty(property)}
          id={`view-details-${property.id}`}
          className="w-full py-2.5 rounded-xl bg-slate-800 group-hover:bg-[#D4AF37] text-slate-200 group-hover:text-slate-950 font-semibold text-xs tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2"
        >
          <Eye className="w-4 h-4" />
          <span>View Details</span>
        </button>
      </div>
    </motion.div>
  );
}
