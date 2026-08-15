import React, { useState } from 'react';
import { X, Save, Plus, Trash2, Check, Sparkles } from 'lucide-react';
import { Property, PropertyType, PropertyPurpose, PropertyStatus } from '../../types';

interface AdminPropertyFormProps {
  propertyToEdit?: Property | null;
  onSave: (propertyData: Partial<Property>) => void;
  onClose: () => void;
}

export default function AdminPropertyForm({
  propertyToEdit,
  onSave,
  onClose
}: AdminPropertyFormProps) {
  const [activeTab, setActiveTab] = useState<'basic' | 'location' | 'specs' | 'media' | 'seo'>('basic');

  const [formData, setFormData] = useState<Partial<Property>>(
    propertyToEdit || {
      title: '',
      slug: '',
      shortDescription: '',
      description: '',
      price: 15000000,
      discountPrice: 0,
      propertyType: 'Mansion',
      purpose: 'Sale',
      location: 'Beverly Hills, CA',
      address: '',
      city: 'Beverly Hills',
      state: 'California',
      country: 'United States',
      zipCode: '90210',
      coordinates: { lat: 34.0736, lng: -118.4003 },
      bedrooms: 5,
      bathrooms: 6,
      balcony: 2,
      parking: 4,
      area: 8500,
      areaUnit: 'Sq.Ft',
      yearBuilt: 2024,
      status: 'Ready',
      amenities: [
        'Swimming Pool',
        'Gym',
        'Security',
        'Power Backup',
        'Smart Home Automation'
      ],
      images: [
        'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80'
      ],
      thumbnail: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1000&q=80',
      floorPlan: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1000&q=80',
      videoUrl: '',
      virtualTourUrl: '',
      seoTitle: '',
      seoDescription: '',
      seoKeywords: '',
      isFeatured: true,
      isPublished: true
    }
  );

  const [newImageInput, setNewImageInput] = useState('');

  const allPossibleAmenities = [
    'Swimming Pool',
    'Gym',
    'Lift',
    'Garden',
    'Security',
    'Power Backup',
    'Club House',
    'Children Park',
    'Wine Cellar',
    'Private Cinema',
    'Helipad',
    'Smart Home Automation',
    'Private Beach',
    'Marina Berth',
    'Tennis Court'
  ];

  const handleAmenityToggle = (amenity: string) => {
    const current = formData.amenities || [];
    if (current.includes(amenity)) {
      setFormData({ ...formData, amenities: current.filter((a) => a !== amenity) });
    } else {
      setFormData({ ...formData, amenities: [...current, amenity] });
    }
  };

  const handleAddGalleryImage = () => {
    if (newImageInput.trim()) {
      setFormData({
        ...formData,
        images: [...(formData.images || []), newImageInput.trim()]
      });
      setNewImageInput('');
    }
  };

  const handleRemoveGalleryImage = (idx: number) => {
    const imgs = [...(formData.images || [])];
    imgs.splice(idx, 1);
    setFormData({ ...formData, images: imgs });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-[#D4AF37]/30 rounded-3xl max-w-4xl w-full p-6 sm:p-8 text-white relative shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-serif font-bold text-white mb-1">
          {propertyToEdit ? 'Edit Luxury Estate' : 'Add New Luxury Estate'}
        </h2>
        <p className="text-xs text-slate-400 font-mono mb-6">
          Provide complete specification details for public listing.
        </p>

        {/* Tab Selector */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-6 overflow-x-auto custom-scrollbar">
          {(['basic', 'location', 'specs', 'media', 'seo'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
                activeTab === tab
                  ? 'bg-[#D4AF37] text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {tab} Details
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* TAB 1: BASIC DETAILS */}
          {activeTab === 'basic' && (
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-1">
                  Property Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      title: e.target.value,
                      slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-')
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-1">
                    Property Slug
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-300 font-mono"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-1">
                    Property Architecture Type *
                  </label>
                  <select
                    value={formData.propertyType}
                    onChange={(e) => setFormData({ ...formData, propertyType: e.target.value as PropertyType })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                  >
                    <option value="Villa">Villa</option>
                    <option value="Penthouse">Penthouse</option>
                    <option value="Mansion">Mansion</option>
                    <option value="Chateau">Chateau</option>
                    <option value="Apartment">Apartment</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-1">
                    Purpose *
                  </label>
                  <select
                    value={formData.purpose}
                    onChange={(e) => setFormData({ ...formData, purpose: e.target.value as PropertyPurpose })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                  >
                    <option value="Sale">Sale</option>
                    <option value="Rent">Rent</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-1">
                    Valuation Price ($) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white font-serif font-bold text-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-1">
                    Status *
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as PropertyStatus })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                  >
                    <option value="Ready">Ready to Move</option>
                    <option value="Upcoming">Under Construction</option>
                    <option value="Sold">Sold / Acquired</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-1">
                  Short Tagline Description *
                </label>
                <input
                  type="text"
                  required
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-1">
                  Full Description *
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white resize-none"
                />
              </div>
            </div>
          )}

          {/* TAB 2: LOCATION DETAILS */}
          {activeTab === 'location' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-1">
                    Display Location Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-1">
                    Full Street Address
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-1">
                    State / Province
                  </label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-1">
                    Zip Code
                  </label>
                  <input
                    type="text"
                    value={formData.zipCode}
                    onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-1">
                    Latitude Coordinates
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.coordinates?.lat}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        coordinates: { ...formData.coordinates!, lat: Number(e.target.value) }
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-1">
                    Longitude Coordinates
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.coordinates?.lng}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        coordinates: { ...formData.coordinates!, lng: Number(e.target.value) }
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SPECS & AMENITIES */}
          {activeTab === 'specs' && (
            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-1">
                    Bedrooms
                  </label>
                  <input
                    type="number"
                    value={formData.bedrooms}
                    onChange={(e) => setFormData({ ...formData, bedrooms: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-1">
                    Bathrooms
                  </label>
                  <input
                    type="number"
                    value={formData.bathrooms}
                    onChange={(e) => setFormData({ ...formData, bathrooms: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-1">
                    Garage Spaces
                  </label>
                  <input
                    type="number"
                    value={formData.parking}
                    onChange={(e) => setFormData({ ...formData, parking: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-1">
                    Year Built
                  </label>
                  <input
                    type="number"
                    value={formData.yearBuilt}
                    onChange={(e) => setFormData({ ...formData, yearBuilt: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-1">
                    Total Area Size
                  </label>
                  <input
                    type="number"
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-1">
                    Area Unit
                  </label>
                  <select
                    value={formData.areaUnit}
                    onChange={(e) => setFormData({ ...formData, areaUnit: e.target.value as any })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                  >
                    <option value="Sq.Ft">Sq.Ft</option>
                    <option value="Sq.M">Sq.M</option>
                  </select>
                </div>
              </div>

              {/* Amenities Checkboxes */}
              <div>
                <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-2">
                  Select Included Amenities
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {allPossibleAmenities.map((amenity) => {
                    const isChecked = formData.amenities?.includes(amenity);
                    return (
                      <button
                        key={amenity}
                        type="button"
                        onClick={() => handleAmenityToggle(amenity)}
                        className={`p-2.5 rounded-xl text-left text-xs font-semibold border transition-all flex items-center justify-between ${
                          isChecked
                            ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#D4AF37]'
                            : 'bg-slate-800 border-slate-700 text-slate-300'
                        }`}
                      >
                        <span>{amenity}</span>
                        {isChecked && <Check className="w-3.5 h-3.5" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: MEDIA & GALLERY */}
          {activeTab === 'media' && (
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-1">
                  Main Thumbnail URL *
                </label>
                <input
                  type="text"
                  required
                  value={formData.thumbnail}
                  onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                />
              </div>

              {/* Gallery Images List */}
              <div>
                <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-2">
                  Gallery Photo URLs
                </label>
                <div className="space-y-2 mb-3">
                  {formData.images?.map((img, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-slate-800 p-2 rounded-xl">
                      <img src={img} alt="Thumbnail" className="w-10 h-10 object-cover rounded-lg" />
                      <span className="text-xs text-slate-300 truncate flex-grow">{img}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveGalleryImage(idx)}
                        className="p-1.5 text-rose-400 hover:text-white"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Paste Image URL..."
                    value={newImageInput}
                    onChange={(e) => setNewImageInput(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddGalleryImage}
                    className="px-4 py-2 rounded-xl bg-slate-700 hover:bg-[#D4AF37] text-white hover:text-slate-950 font-bold text-xs"
                  >
                    Add
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-1">
                    Floor Plan Image URL
                  </label>
                  <input
                    type="text"
                    value={formData.floorPlan}
                    onChange={(e) => setFormData({ ...formData, floorPlan: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-1">
                    3D Virtual Tour / Matterport Link
                  </label>
                  <input
                    type="text"
                    value={formData.virtualTourUrl}
                    onChange={(e) => setFormData({ ...formData, virtualTourUrl: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: SEO & PUBLISHING */}
          {activeTab === 'seo' && (
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-1">
                  SEO Title
                </label>
                <input
                  type="text"
                  value={formData.seoTitle}
                  onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-1">
                  SEO Meta Description
                </label>
                <textarea
                  rows={3}
                  value={formData.seoDescription}
                  onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white resize-none"
                />
              </div>

              <div className="flex items-center gap-6 pt-4 border-t border-slate-800">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="w-4 h-4 accent-[#D4AF37]"
                  />
                  <span>Featured Property (Home Page Spotlight)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold">
                  <input
                    type="checkbox"
                    checked={formData.isPublished}
                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                    className="w-4 h-4 accent-[#D4AF37]"
                  />
                  <span>Publish Immediately</span>
                </label>
              </div>
            </div>
          )}

          {/* Submit Action Footer */}
          <div className="pt-6 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs uppercase"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg"
            >
              <Save className="w-4 h-4" />
              <span>Save Estate Record</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
