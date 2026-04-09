'use client';

import { useState, useMemo } from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import {
  Search,
  Download,
  Users,
  Building2,
  Mail,
  Phone,
  MapPin,
  ChevronDown,
  ChevronUp,
  Target,
  BarChart3,
  RefreshCw,
  CheckCircle,
} from 'lucide-react';

// ===== MOCK DATA: 50k Strata Leads =====
const COMPANIES = [
  'Strata Plus Management', 'Citywide Strata', 'Strata Community Group',
  'Elite Strata Services', 'Strata Choice', 'Netstrata', 'Strata 8',
  'Strata Management Assoc', 'Urban Strata', 'Premier Strata',
];

const SUBURBS = [
  'Sydney CBD', 'Parramatta', 'Chatswood', 'Bondi', 'Manly',
  'North Sydney', 'Liverpool', 'Penrith', 'Hornsby', 'Cronulla',
  'Melbourne CBD', 'St Kilda', 'South Yarra', 'Richmond', 'Brighton',
];

const STATUSES = ['new', 'contacted', 'qualified', 'proposal', 'won', 'lost'] as const;

function generateLeads(count: number) {
  const leads = [];
  for (let i = 0; i < count; i++) {
    const company = COMPANIES[Math.floor(Math.random() * COMPANIES.length)];
    const suburb = SUBURBS[Math.floor(Math.random() * SUBURBS.length)];
    const units = Math.floor(Math.random() * 500) + 20;
    leads.push({
      id: `lead-${i + 1}`,
      company,
      contact: ['Sarah M.', 'James T.', 'Emma L.', 'David K.', 'Lisa W.', 'Michael R.'][Math.floor(Math.random() * 6)],
      role: ['Strata Manager', 'Building Manager', 'Committee Chair', 'Facilities Director'][Math.floor(Math.random() * 4)],
      email: `contact@${company.toLowerCase().replace(/\s+/g, '')}.com.au`,
      phone: `04${Math.floor(Math.random() * 90 + 10)} ${Math.floor(Math.random() * 900 + 100)} ${Math.floor(Math.random() * 900 + 100)}`,
      suburb,
      state: suburb.includes('Melbourne') || suburb.includes('St Kilda') || suburb.includes('South Yarra') || suburb.includes('Richmond') || suburb.includes('Brighton') ? 'VIC' : 'NSW',
      units,
      status: STATUSES[Math.floor(Math.random() * STATUSES.length)] as typeof STATUSES[number],
      lastContact: new Date(Date.now() - Math.floor(Math.random() * 30) * 86400000).toISOString().split('T')[0],
      potentialValue: Math.round(units * (Math.random() * 50 + 80)),
    });
  }
  return leads;
}

const ALL_LEADS = generateLeads(50000);

// ===== STATUS BADGE =====
function StatusBadge({ status }: { status: typeof STATUSES[number] }) {
  const styles: Record<typeof STATUSES[number], string> = {
    new: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    contacted: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    qualified: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    proposal: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    won: 'bg-green-500/20 text-green-400 border-green-500/30',
    lost: 'bg-red-500/20 text-red-400 border-red-500/30',
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${styles[status]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

// ===== MAIN PAGE =====
export default function StrataLeadsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [stateFilter, setStateFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState<'potentialValue' | 'units' | 'lastContact'>('potentialValue');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const pageSize = 25;

  const stats = useMemo(() => {
    const total = ALL_LEADS.length;
    const won = ALL_LEADS.filter((l) => l.status === 'won').length;
    const qualified = ALL_LEADS.filter((l) => l.status === 'qualified').length;
    const pipeline = ALL_LEADS.filter((l) => l.status !== 'won' && l.status !== 'lost').reduce((s, l) => s + l.potentialValue, 0);
    return { total, won, qualified, pipeline };
  }, []);

  const filtered = useMemo(() => {
    let leads = [...ALL_LEADS];
    if (search) {
      const q = search.toLowerCase();
      leads = leads.filter((l) =>
        l.company.toLowerCase().includes(q) ||
        l.contact.toLowerCase().includes(q) ||
        l.suburb.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== 'all') leads = leads.filter((l) => l.status === statusFilter);
    if (stateFilter !== 'all') leads = leads.filter((l) => l.state === stateFilter);

    leads.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (typeof aVal === 'string' && typeof bVal === 'string') return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      return sortDir === 'asc' ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
    });

    return leads;
  }, [search, statusFilter, stateFilter, sortField, sortDir]);

  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(filtered.length / pageSize);

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortField(field); setSortDir('desc'); }
  };

  const exportCSV = () => {
    const header = 'Company,Contact,Role,Email,Phone,Suburb,State,Units,Status,Potential Value\n';
    const rows = filtered.map((l) => `${l.company},"${l.contact}",${l.role},${l.email},${l.phone},${l.suburb},${l.state},${l.units},${l.status},${l.potentialValue}`).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cleanaus-strata-leads-${filtered.length}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const SortIcon = ({ field }: { field: typeof sortField }) => {
    if (sortField !== field) return <ChevronDown className="h-3 w-3 text-white/30" />;
    return sortDir === 'asc' ? <ChevronUp className="h-3 w-3 text-blue-400" /> : <ChevronDown className="h-3 w-3 text-blue-400" />;
  };

  return (
    <div className="min-h-screen bg-bg pt-16">
      <div className="max-w-[1280px] mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Strata Leads Dashboard</h1>
            <p className="text-white/50 text-sm mt-1">{stats.total.toLocaleString()} leads &bull; AI-enriched &amp; verified</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={exportCSV}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition-all"
            >
              <Download className="h-4 w-4" />
              Export {filtered.length.toLocaleString()} Leads
            </button>
            <button
              type="button"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all"
            >
              <RefreshCw className="h-4 w-4" />
              Sync Leads
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { icon: Users, label: 'Total Leads', value: stats.total.toLocaleString(), color: 'text-blue-400' },
            { icon: Target, label: 'Qualified', value: stats.qualified.toLocaleString(), color: 'text-purple-400' },
            { icon: CheckCircle, label: 'Won Deals', value: stats.won.toLocaleString(), color: 'text-green-400' },
            { icon: BarChart3, label: 'Pipeline Value', value: `$${(stats.pipeline / 1000000).toFixed(1)}M`, color: 'text-cyan-400' },
          ].map((stat) => (
            <GlassCard key={stat.label} className="!hover:transform-none">
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-white/40 text-xs">{stat.label}</p>
                  <p className="text-lg font-bold">{stat.value}</p>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>

        {/* Filters */}
        <GlassCard className="!hover:transform-none mb-6">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
              <input
                type="text"
                placeholder="Search companies, contacts, suburbs..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/25"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-blue-500/50"
            >
              <option value="all" className="bg-bg">All Statuses</option>
              {STATUSES.map((s) => <option key={s} value={s} className="bg-bg">{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
            </select>
            <select
              value={stateFilter}
              onChange={(e) => { setStateFilter(e.target.value); setPage(1); }}
              className="px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-blue-500/50"
            >
              <option value="all" className="bg-bg">All States</option>
              <option value="NSW" className="bg-bg">NSW</option>
              <option value="VIC" className="bg-bg">VIC</option>
            </select>
          </div>
        </GlassCard>

        {/* Table */}
        <GlassCard className="!hover:transform-none !p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left px-4 py-3 text-white/40 font-medium text-xs uppercase tracking-wider">Company</th>
                  <th className="text-left px-4 py-3 text-white/40 font-medium text-xs uppercase tracking-wider">Contact</th>
                  <th className="text-left px-4 py-3 text-white/40 font-medium text-xs uppercase tracking-wider hidden md:table-cell">Location</th>
                  <th
                    className="text-left px-4 py-3 text-white/40 font-medium text-xs uppercase tracking-wider cursor-pointer hover:text-white/60 hidden lg:table-cell"
                    onClick={() => handleSort('units')}
                  >
                    <span className="flex items-center gap-1">Units <SortIcon field="units" /></span>
                  </th>
                  <th className="text-left px-4 py-3 text-white/40 font-medium text-xs uppercase tracking-wider">Status</th>
                  <th
                    className="text-right px-4 py-3 text-white/40 font-medium text-xs uppercase tracking-wider cursor-pointer hover:text-white/60"
                    onClick={() => handleSort('potentialValue')}
                  >
                    <span className="flex items-center justify-end gap-1">Value <SortIcon field="potentialValue" /></span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((lead) => (
                  <tr key={lead.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium">{lead.company}</p>
                      <p className="text-white/40 text-xs">{lead.role}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p>{lead.contact}</p>
                      <p className="text-white/40 text-xs flex items-center gap-1"><Mail className="h-3 w-3" />{lead.email.slice(0, 20)}...</p>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <p className="flex items-center gap-1"><MapPin className="h-3 w-3 text-white/30" />{lead.suburb}</p>
                      <p className="text-white/40 text-xs">{lead.state}</p>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="font-mono">{lead.units}</span>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={lead.status} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="font-semibold text-green-400">${lead.potentialValue.toLocaleString()}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-white/5">
            <p className="text-xs text-white/40">
              Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, filtered.length)} of {filtered.length.toLocaleString()}
            </p>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white/5 text-white/50 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                Prev
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum: number;
                if (totalPages <= 5) pageNum = i + 1;
                else if (page <= 3) pageNum = i + 1;
                else if (page >= totalPages - 2) pageNum = totalPages - 4 + i;
                else pageNum = page - 2 + i;

                return (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => setPage(pageNum)}
                    className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${
                      page === pageNum ? 'bg-blue-500/20 text-blue-400' : 'text-white/50 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white/5 text-white/50 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                Next
              </button>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
