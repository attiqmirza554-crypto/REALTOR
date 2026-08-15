import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Calendar, Send, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ScheduleVisitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ScheduleVisitModal({ isOpen, onClose }: ScheduleVisitModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    preferredDate: '',
    preferredTime: '14:00',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const newLead = {
      id: `lead-${Date.now()}`,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      type: 'schedule_visit',
      propertyTitle: 'General VIP Concierge Visit',
      preferredDate: formData.preferredDate,
      preferredTime: formData.preferredTime,
      message: formData.message,
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
          ...formData,
          type: 'schedule_visit',
          propertyTitle: 'General VIP Concierge Visit'
        })
      }).catch(() => {});

      setSubmitted(true);
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    } catch (err) {
      console.error('Error scheduling tour:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-slate-900 border border-[#D4AF37]/30 rounded-3xl max-w-lg w-full p-8 text-white relative shadow-2xl"
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-2">
          <Calendar className="w-6 h-6 text-[#D4AF37]" />
          <h3 className="text-xl font-serif font-bold text-white">Book Private Estate Tour</h3>
        </div>
        <p className="text-xs text-slate-400 mb-6 font-light">
          Request a private chauffeur-driven or helicopter-assisted tour with our Senior Advisory team.
        </p>

        {submitted ? (
          <div className="text-center py-8">
            <CheckCircle2 className="w-14 h-14 text-[#D4AF37] mx-auto mb-3" />
            <h4 className="text-lg font-serif font-bold text-white mb-2">Tour Request Confirmed</h4>
            <p className="text-xs text-slate-300 mb-6">
              A private coordinator will call you shortly to confirm helicopter or security logistics.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-[#D4AF37] text-slate-950 font-bold text-xs uppercase"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Lord Alexander Vance"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="vance@capital.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-1">
                  Phone / WhatsApp *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+1 (310) 555-0199"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-1">
                  Preferred Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.preferredDate}
                  onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-1">
                  Preferred Time *
                </label>
                <select
                  value={formData.preferredTime}
                  onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                >
                  <option value="10:00">10:00 AM</option>
                  <option value="12:00">12:00 PM</option>
                  <option value="14:00">02:00 PM</option>
                  <option value="16:00">04:00 PM</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-1">
                Special Tour Requirements
              </label>
              <textarea
                rows={3}
                placeholder="Specific property IDs, security protocols, airport pickup..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-[#D4AF37] resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              id="submit-general-visit-btn"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#AA7C11] text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#D4AF37]/20"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{loading ? 'Submitting...' : 'Confirm Tour Booking'}</span>
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
