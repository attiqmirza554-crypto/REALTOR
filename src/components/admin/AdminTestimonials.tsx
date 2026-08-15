import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Star, MessageSquare } from 'lucide-react';
import { Testimonial } from '../../types';

interface AdminTestimonialsProps {
  testimonials: Testimonial[];
  onRefresh: () => void;
}

export default function AdminTestimonials({ testimonials, onRefresh }: AdminTestimonialsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    role: 'Billionaire Investor',
    company: 'Capital Group',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    content: '',
    rating: 5,
    location: 'Beverly Hills'
  });

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      role: 'Private Investor',
      company: 'Aura Capital',
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      content: '',
      rating: 5,
      location: 'Beverly Hills'
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    let updated = [...testimonials];
    if (editingItem) {
      updated = updated.map((t) => (t.id === editingItem.id ? { ...t, clientName: formData.name, role: formData.role, review: formData.content, photo: formData.photo, location: formData.location } : t));
      fetch(`/api/testimonials/${editingItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      }).catch(() => {});
    } else {
      const newT: Testimonial = {
        id: `test-${Date.now()}`,
        clientName: formData.name,
        photo: formData.photo,
        role: formData.role,
        location: formData.location,
        rating: formData.rating,
        review: formData.content,
        verified: true,
        isFeatured: true
      };
      updated = [newT, ...updated];
      fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      }).catch(() => {});
    }
    try {
      localStorage.setItem('aurahaven_testimonials', JSON.stringify(updated));
    } catch (err) {
      console.error('LocalStorage write error:', err);
    }
    setIsModalOpen(false);
    onRefresh();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this client testimonial?')) {
      const updated = testimonials.filter((t) => t.id !== id);
      try {
        localStorage.setItem('aurahaven_testimonials', JSON.stringify(updated));
      } catch (err) {
        console.error('LocalStorage write error:', err);
      }
      fetch(`/api/testimonials/${id}`, { method: 'DELETE' }).catch(() => {});
      onRefresh();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-[#D4AF37] font-mono text-xs uppercase tracking-widest">
          Verified Patron Reviews ({testimonials.length})
        </h3>
        <button
          onClick={handleOpenAdd}
          className="px-5 py-2.5 rounded-xl bg-[#D4AF37] text-slate-950 font-bold text-xs uppercase flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Review
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((t) => (
          <div key={t.id} className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={t.photo} alt={t.name} className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <h4 className="font-serif font-bold text-white text-sm">{t.name}</h4>
                  <span className="text-[11px] text-[#D4AF37] font-mono block">{t.role}</span>
                </div>
              </div>
              <button
                onClick={() => handleDelete(t.id)}
                className="p-2 text-rose-400 hover:text-white"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300 italic font-light">"{t.content}"</p>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs">
              <span className="text-slate-400 font-mono">{t.location}</span>
              <div className="flex gap-0.5 text-[#D4AF37]">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-[#D4AF37]/30 p-6 rounded-3xl max-w-md w-full text-white">
            <h3 className="text-lg font-serif font-bold mb-4">Add Client Review</h3>
            <form onSubmit={handleSave} className="space-y-3">
              <input
                type="text"
                required
                placeholder="Client Name *"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
              />
              <input
                type="text"
                required
                placeholder="Title / Role *"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
              />
              <textarea
                required
                rows={3}
                placeholder="Review Content *"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
              />
              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#D4AF37] text-slate-950 rounded-xl text-xs font-bold uppercase"
                >
                  Save Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
