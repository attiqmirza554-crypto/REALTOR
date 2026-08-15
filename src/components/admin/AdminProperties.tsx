import { useState } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Copy,
  Star,
  Eye,
  Building,
  Check
} from 'lucide-react';
import { Property } from '../../types';
import AdminPropertyForm from './AdminPropertyForm';

interface AdminPropertiesProps {
  properties: Property[];
  onRefresh: () => void;
  onOpenAddModal: () => void;
}

export default function AdminProperties({
  properties,
  onRefresh
}: AdminPropertiesProps) {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Filter properties
  const filtered = properties.filter((p) => {
    if (search && !p.title.toLowerCase().includes(search.toLowerCase()) && !p.location.toLowerCase().includes(search.toLowerCase()))
      return false;
    if (filterType !== 'All' && p.propertyType !== filterType) return false;
    return true;
  });

  // Persistent LocalStorage helper
  const savePropertiesToLocalStorage = (newList: Property[]) => {
    try {
      localStorage.setItem('aurahaven_properties', JSON.stringify(newList));
    } catch (err) {
      console.error('LocalStorage write error:', err);
    }
  };

  const handleSaveProperty = async (data: Partial<Property>) => {
    try {
      let updatedProps: Property[] = [...properties];

      if (editingProperty) {
        // Edit existing property
        const index = updatedProps.findIndex((p) => p.id === editingProperty.id);
        if (index !== -1) {
          updatedProps[index] = { ...updatedProps[index], ...data } as Property;
        }

        // Try API in background
        fetch(`/api/properties/${editingProperty.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        }).catch(() => {});
      } else {
        // Create new property
        const newProp: Property = {
          id: `prop-${Date.now()}`,
          title: data.title || 'New Luxury Estate',
          slug: data.slug || `estate-${Date.now()}`,
          shortDescription: data.shortDescription || 'Exclusive luxury estate listing.',
          description: data.description || 'Full specifications available upon request.',
          price: data.price || 15000000,
          discountPrice: data.discountPrice || 0,
          propertyType: data.propertyType || 'Mansion',
          purpose: data.purpose || 'Sale',
          location: data.location || 'Beverly Hills, CA',
          address: data.address || '',
          city: data.city || 'Beverly Hills',
          state: data.state || 'California',
          country: data.country || 'United States',
          zipCode: data.zipCode || '90210',
          coordinates: data.coordinates || { lat: 34.0736, lng: -118.4003 },
          bedrooms: data.bedrooms || 5,
          bathrooms: data.bathrooms || 6,
          balcony: data.balcony || 2,
          parking: data.parking || 4,
          area: data.area || 8500,
          areaUnit: data.areaUnit || 'Sq.Ft',
          yearBuilt: data.yearBuilt || 2024,
          status: data.status || 'Ready',
          amenities: data.amenities || ['Swimming Pool', 'Gym', 'Security'],
          images: data.images?.length
            ? data.images
            : ['https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80'],
          thumbnail:
            data.thumbnail ||
            'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1000&q=80',
          floorPlan: data.floorPlan || '',
          videoUrl: data.videoUrl || '',
          virtualTourUrl: data.virtualTourUrl || '',
          seoTitle: data.seoTitle || '',
          seoDescription: data.seoDescription || '',
          seoKeywords: data.seoKeywords || '',
          isFeatured: data.isFeatured !== undefined ? data.isFeatured : true,
          isPublished: data.isPublished !== undefined ? data.isPublished : true,
          createdAt: new Date().toISOString(),
          viewsCount: 1,
          agent: data.agent || {
            name: 'Victoria Sterling',
            photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
            phone: '+1 (310) 555-0199',
            email: 'v.sterling@aurahaven.com',
            whatsapp: '13105550199',
            role: 'Senior Luxury Advisor'
          }
        };

        updatedProps = [newProp, ...updatedProps];

        // Try API in background
        fetch('/api/properties', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        }).catch(() => {});
      }

      savePropertiesToLocalStorage(updatedProps);
      setIsFormOpen(false);
      setEditingProperty(null);
      onRefresh();
    } catch (err) {
      console.error('Error saving property:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this property listing?')) {
      const updatedProps = properties.filter((p) => p.id !== id);
      savePropertiesToLocalStorage(updatedProps);
      fetch(`/api/properties/${id}`, { method: 'DELETE' }).catch(() => {});
      onRefresh();
    }
  };

  const handleDuplicate = async (id: string) => {
    const target = properties.find((p) => p.id === id);
    if (target) {
      const duplicated: Property = {
        ...target,
        id: `prop-${Date.now()}`,
        title: `${target.title} (Copy)`,
        createdAt: new Date().toISOString()
      };
      const updatedProps = [duplicated, ...properties];
      savePropertiesToLocalStorage(updatedProps);
      fetch(`/api/properties/${id}/duplicate`, { method: 'POST' }).catch(() => {});
      onRefresh();
    }
  };

  const handleToggleFeatured = async (id: string) => {
    const updatedProps = properties.map((p) =>
      p.id === id ? { ...p, isFeatured: !p.isFeatured } : p
    );
    savePropertiesToLocalStorage(updatedProps);
    fetch(`/api/properties/${id}/toggle-featured`, { method: 'PATCH' }).catch(() => {});
    onRefresh();
  };

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search estates..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-[#D4AF37] w-64"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none"
          >
            <option value="All">All Architecture Types</option>
            <option value="Villa">Villas</option>
            <option value="Penthouse">Penthouses</option>
            <option value="Mansion">Mansions</option>
            <option value="Chateau">Châteaux</option>
            <option value="Apartment">Apartments</option>
          </select>
        </div>

        <button
          onClick={() => {
            setEditingProperty(null);
            setIsFormOpen(true);
          }}
          className="px-5 py-2.5 rounded-xl bg-[#D4AF37] text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-[#D4AF37]/20"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Estate</span>
        </button>
      </div>

      {/* Properties Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-mono text-slate-400 uppercase">
                <th className="p-4">Estate</th>
                <th className="p-4">Valuation</th>
                <th className="p-4">Location</th>
                <th className="p-4">Specs</th>
                <th className="p-4">Status</th>
                <th className="p-4">Featured</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-xs">
              {filtered.map((prop) => (
                <tr key={prop.id} className="hover:bg-slate-800/50">
                  <td className="p-4 flex items-center gap-3">
                    <img
                      src={prop.thumbnail}
                      alt={prop.title}
                      className="w-12 h-12 object-cover rounded-xl"
                    />
                    <div>
                      <h4 className="font-serif font-bold text-white line-clamp-1">{prop.title}</h4>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {prop.propertyType} | {prop.purpose}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 font-serif font-bold text-[#D4AF37]">
                    ${prop.price.toLocaleString()}
                  </td>
                  <td className="p-4 text-slate-300">{prop.location}</td>
                  <td className="p-4 text-slate-400 font-mono">
                    {prop.bedrooms}B / {prop.bathrooms}Ba / {prop.area.toLocaleString()} sq.ft
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        prop.status === 'Ready'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}
                    >
                      {prop.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => handleToggleFeatured(prop.id)}
                      className={`p-1.5 rounded-lg border transition-all ${
                        prop.isFeatured
                          ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#D4AF37]'
                          : 'bg-slate-800 border-slate-700 text-slate-500'
                      }`}
                      title="Toggle Featured"
                    >
                      <Star className={`w-3.5 h-3.5 ${prop.isFeatured ? 'fill-current' : ''}`} />
                    </button>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setEditingProperty(prop);
                          setIsFormOpen(true);
                        }}
                        className="p-2 rounded-lg bg-slate-800 hover:bg-[#D4AF37] text-slate-300 hover:text-slate-950 transition-colors"
                        title="Edit Estate"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDuplicate(prop.id)}
                        className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                        title="Duplicate Listing"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDelete(prop.id)}
                        className="p-2 rounded-lg bg-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white transition-colors"
                        title="Delete Listing"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Modal */}
      {isFormOpen && (
        <AdminPropertyForm
          propertyToEdit={editingProperty}
          onSave={handleSaveProperty}
          onClose={() => {
            setIsFormOpen(false);
            setEditingProperty(null);
          }}
        />
      )}
    </div>
  );
}
