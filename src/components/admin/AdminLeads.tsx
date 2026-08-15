import { useState } from 'react';
import { Users, Download, Search, Mail, Phone, Calendar, CheckCircle2 } from 'lucide-react';
import { Lead } from '../../types';

interface AdminLeadsProps {
  leads: Lead[];
  onRefresh: () => void;
}

export default function AdminLeads({ leads, onRefresh }: AdminLeadsProps) {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');

  const filtered = leads.filter((l) => {
    if (search && !l.name.toLowerCase().includes(search.toLowerCase()) && !l.email.toLowerCase().includes(search.toLowerCase()))
      return false;
    if (typeFilter !== 'All' && l.type !== typeFilter) return false;
    return true;
  });

  const handleStatusChange = async (id: string, newStatus: any) => {
    const updatedLeads = leads.map((l) => (l.id === id ? { ...l, status: newStatus } : l));
    try {
      localStorage.setItem('aurahaven_leads', JSON.stringify(updatedLeads));
    } catch (err) {
      console.error('LocalStorage write error:', err);
    }
    fetch(`/api/leads/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    }).catch(() => {});
    onRefresh();
  };

  const handleExportCSV = () => {
    try {
      const headers = ['ID,Name,Email,Phone,Type,Property,Preferred Date,Preferred Time,Status,Created At'];
      const rows = leads.map((l) =>
        [
          l.id,
          `"${l.name.replace(/"/g, '""')}"`,
          `"${l.email}"`,
          `"${l.phone}"`,
          `"${l.type}"`,
          `"${(l.propertyTitle || 'General').replace(/"/g, '""')}"`,
          `"${l.preferredDate || ''}"`,
          `"${l.preferredTime || ''}"`,
          `"${l.status}"`,
          `"${l.createdAt}"`
        ].join(',')
      );
      const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent([headers, ...rows].join('\n'));
      const link = document.createElement('a');
      link.setAttribute('href', csvContent);
      link.setAttribute('download', `aurahaven_leads_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      window.open('/api/leads/export', '_blank');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search leads by client name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-[#D4AF37] w-64"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none"
          >
            <option value="All">All Inquiry Types</option>
            <option value="schedule_visit">Tour Visits</option>
            <option value="general_inquiry">General Inquiry</option>
            <option value="callback">Callback Requests</option>
          </select>
        </div>

        <button
          onClick={handleExportCSV}
          id="export-csv-btn"
          className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-[#D4AF37] text-slate-200 hover:text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-2 border border-slate-700 transition-all"
        >
          <Download className="w-4 h-4" />
          <span>Export Leads CSV</span>
        </button>
      </div>

      {/* Leads Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-mono text-slate-400 uppercase">
                <th className="p-4">Client Contact</th>
                <th className="p-4">Inquiry Category</th>
                <th className="p-4">Target Estate</th>
                <th className="p-4">Tour Slot</th>
                <th className="p-4">Received On</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-xs">
              {filtered.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-800/40">
                  <td className="p-4">
                    <h4 className="font-serif font-bold text-white">{lead.name}</h4>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3 text-[#D4AF37]" /> {lead.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3 text-[#D4AF37]" /> {lead.phone}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 font-mono capitalize">
                      {lead.type.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-4 text-slate-300 max-w-[200px] truncate">
                    {lead.propertyTitle || 'General Private Concierge'}
                  </td>
                  <td className="p-4 text-slate-400 font-mono">
                    {lead.preferredDate ? `${lead.preferredDate} @ ${lead.preferredTime}` : 'N/A'}
                  </td>
                  <td className="p-4 text-slate-400 font-mono">
                    {new Date(lead.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <select
                      value={lead.status}
                      onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border focus:outline-none cursor-pointer ${
                        lead.status === 'New'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : lead.status === 'Contacted'
                          ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                          : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      }`}
                    >
                      <option value="New" className="bg-slate-900 text-white">New Pending</option>
                      <option value="Contacted" className="bg-slate-900 text-white">Contacted</option>
                      <option value="Qualified" className="bg-slate-900 text-white">Qualified VIP</option>
                      <option value="Concluded" className="bg-slate-900 text-white">Concluded</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
