import { motion } from 'motion/react';
import {
  Building,
  Users,
  Calendar,
  DollarSign,
  Plus,
  ArrowUpRight,
  ShieldCheck,
  TrendingUp
} from 'lucide-react';
import { Property, Lead } from '../../types';

interface AdminOverviewProps {
  properties: Property[];
  leads: Lead[];
  onNavigate: (section: string) => void;
  onOpenAddProperty: () => void;
}

export default function AdminOverview({
  properties,
  leads,
  onNavigate,
  onOpenAddProperty
}: AdminOverviewProps) {
  const totalValue = properties.reduce((acc, p) => acc + p.price, 0);
  const totalLeads = leads.length;
  const visitRequests = leads.filter((l) => l.type === 'schedule_visit').length;
  const readyProps = properties.filter((p) => p.status === 'Ready').length;

  return (
    <div className="space-y-8">
      {/* Top Banner & Quick Add Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-[#D4AF37]/30 shadow-xl">
        <div>
          <h2 className="text-xl font-serif font-bold text-white">Aura Haven Executive Overview</h2>
          <p className="text-xs text-slate-300 font-light mt-0.5">
            Real-time control center for private listings, lead pipelines, and client tour scheduling.
          </p>
        </div>
        <button
          onClick={onOpenAddProperty}
          id="admin-quick-add-prop-btn"
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-[#D4AF37]/20 hover:scale-105 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Estate</span>
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Metric 1 */}
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono text-slate-400 uppercase">Portfolio Valuation</span>
            <div className="p-2.5 rounded-xl bg-[#D4AF37]/10 text-[#D4AF37]">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <span className="text-2xl font-serif font-bold text-[#D4AF37] block">
            ${(totalValue / 1000000).toFixed(1)}M
          </span>
          <span className="text-[11px] text-emerald-400 flex items-center gap-1 mt-2">
            <TrendingUp className="w-3.5 h-3.5" /> +14.2% quarter growth
          </span>
        </div>

        {/* Metric 2 */}
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono text-slate-400 uppercase">Active Properties</span>
            <div className="p-2.5 rounded-xl bg-slate-800 text-white">
              <Building className="w-5 h-5 text-[#D4AF37]" />
            </div>
          </div>
          <span className="text-2xl font-serif font-bold text-white block">{properties.length}</span>
          <span className="text-[11px] text-slate-400 mt-2 block">{readyProps} Ready for Acquisition</span>
        </div>

        {/* Metric 3 */}
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono text-slate-400 uppercase">Total Leads</span>
            <div className="p-2.5 rounded-xl bg-slate-800 text-white">
              <Users className="w-5 h-5 text-[#D4AF37]" />
            </div>
          </div>
          <span className="text-2xl font-serif font-bold text-white block">{totalLeads}</span>
          <span className="text-[11px] text-amber-400 mt-2 block">
            {leads.filter((l) => l.status === 'New').length} New Pending Action
          </span>
        </div>

        {/* Metric 4 */}
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono text-slate-400 uppercase">Tour Requests</span>
            <div className="p-2.5 rounded-xl bg-slate-800 text-white">
              <Calendar className="w-5 h-5 text-[#D4AF37]" />
            </div>
          </div>
          <span className="text-2xl font-serif font-bold text-[#D4AF37] block">{visitRequests}</span>
          <span className="text-[11px] text-slate-400 mt-2 block">Private Viewing Slots</span>
        </div>
      </div>

      {/* Streams: Recent Inquiries & Property Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Inquiries Table */}
        <div className="lg:col-span-8 bg-slate-900/90 border border-slate-800 p-6 rounded-3xl shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-serif font-bold text-white">Recent Client Inquiries</h3>
            <button
              onClick={() => onNavigate('leads')}
              className="text-xs text-[#D4AF37] font-mono hover:underline flex items-center gap-1"
            >
              View All Leads <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[11px] font-mono text-slate-400 uppercase">
                  <th className="p-2.5">Client</th>
                  <th className="p-2.5">Inquiry Type</th>
                  <th className="p-2.5">Estate Title</th>
                  <th className="p-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-xs">
                {leads.slice(0, 5).map((l) => (
                  <tr key={l.id} className="hover:bg-slate-800/40">
                    <td className="p-2.5 font-semibold text-white">{l.name}</td>
                    <td className="p-2.5 text-slate-300 capitalize">{l.type.replace('_', ' ')}</td>
                    <td className="p-2.5 text-slate-400 max-w-[180px] truncate">{l.propertyTitle || 'General'}</td>
                    <td className="p-2.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          l.status === 'New'
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-emerald-500/20 text-emerald-300'
                        }`}
                      >
                        {l.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Estate Portfolio Breakdown */}
        <div className="lg:col-span-4 bg-slate-900/90 border border-slate-800 p-6 rounded-3xl shadow-xl">
          <h3 className="text-lg font-serif font-bold text-white mb-4">Portfolio Distribution</h3>
          <div className="space-y-4 text-xs font-medium">
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Villas & Mansions</span>
                <span className="text-[#D4AF37] font-mono">
                  {properties.filter((p) => p.propertyType === 'Villa' || p.propertyType === 'Mansion').length}
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-[#D4AF37] w-3/4" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Penthouses</span>
                <span className="text-[#D4AF37] font-mono">
                  {properties.filter((p) => p.propertyType === 'Penthouse').length}
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-1/2" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Historic Chateaux</span>
                <span className="text-[#D4AF37] font-mono">
                  {properties.filter((p) => p.propertyType === 'Chateau').length}
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-sky-500 w-1/3" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
