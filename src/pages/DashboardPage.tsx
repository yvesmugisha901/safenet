// pages/DashboardPage.tsx
import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { emergencyAPI } from '../services/api';
import { Emergency } from '../types';
import { useSocket } from '../context/SocketContext';

const STATUS_COLORS: Record<string, string> = {
  pending:    '#ef4444',
  responding: '#f59e0b',
  resolved:   '#22c55e',
  cancelled:  '#6b7280',
};

const TYPE_COLORS = ['#ef4444', '#f59e0b', '#3b82f6', '#8b5cf6', '#22c55e', '#6b7280'];

export default function DashboardPage() {
  const [emergencies, setEmergencies] = useState<Emergency[]>([]);
  const [stats, setStats] = useState<any[]>([]);
  const { liveEmergencies } = useSocket();

  useEffect(() => {
    emergencyAPI.list().then((data: any) => setEmergencies(data));
    emergencyAPI.getStats().then((data: any) => setStats(data));
  }, []);

  // Merge real-time emergencies
  const allEmergencies = [
    ...liveEmergencies.filter(le => !emergencies.find(e => e.id === le.id)),
    ...emergencies,
  ];

  const counts = {
    pending:    allEmergencies.filter(e => e.status === 'pending').length,
    responding: allEmergencies.filter(e => e.status === 'responding').length,
    resolved:   allEmergencies.filter(e => e.status === 'resolved').length,
    total:      allEmergencies.length,
  };

  const typeData = ['medical','fire','flood','accident','crime','other'].map(type => ({
    name: type,
    count: allEmergencies.filter(e => e.type === type).length,
  }));

  const statusPieData = Object.entries(counts)
    .filter(([key]) => key !== 'total')
    .map(([name, value]) => ({ name, value }));

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-white text-2xl font-bold">Dashboard Overview</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total',      value: counts.total,      color: 'text-white',      bg: 'bg-gray-800' },
          { label: 'Pending',    value: counts.pending,    color: 'text-red-400',    bg: 'bg-red-900/20' },
          { label: 'Responding', value: counts.responding, color: 'text-yellow-400', bg: 'bg-yellow-900/20' },
          { label: 'Resolved',   value: counts.resolved,   color: 'text-green-400',  bg: 'bg-green-900/20' },
        ].map(card => (
          <div key={card.label} className={`${card.bg} border border-gray-800 rounded-xl p-5`}>
            <p className="text-gray-400 text-sm">{card.label}</p>
            <p className={`${card.color} text-3xl font-bold mt-1`}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bar Chart – by type */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h3 className="text-white font-semibold mb-4">Emergencies by Type</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={typeData}>
              <XAxis dataKey="name" stroke="#6b7280" tick={{ fontSize: 11 }} />
              <YAxis stroke="#6b7280" tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{ background: '#111827', border: '1px solid #374151', borderRadius: 8 }}
                labelStyle={{ color: '#f9fafb' }}
              />
              <Bar dataKey="count" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart – by status */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h3 className="text-white font-semibold mb-4">Status Breakdown</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={statusPieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70}>
                {statusPieData.map((entry, i) => (
                  <Cell key={i} fill={STATUS_COLORS[entry.name] || '#6b7280'} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: '#111827', border: '1px solid #374151', borderRadius: 8 }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-3 mt-2 justify-center">
            {statusPieData.map(d => (
              <span key={d.name} className="flex items-center gap-1 text-xs text-gray-400">
                <span className="w-2 h-2 rounded-full inline-block" style={{ background: STATUS_COLORS[d.name] }} />
                {d.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Emergencies Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-800 flex items-center justify-between">
          <h3 className="text-white font-semibold">Recent Emergencies</h3>
          {liveEmergencies.length > 0 && (
            <span className="flex items-center gap-1 text-xs text-red-400">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              {liveEmergencies.length} live
            </span>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800">
                {['Title', 'Type', 'Status', 'Reported By', 'Time'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-gray-500 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allEmergencies.slice(0, 10).map(e => (
                <tr key={e.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                  <td className="px-5 py-3 text-white">{e.title}</td>
                  <td className="px-5 py-3 text-gray-400 capitalize">{e.type}</td>
                  <td className="px-5 py-3">
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium capitalize"
                      style={{ background: `${STATUS_COLORS[e.status]}20`, color: STATUS_COLORS[e.status] }}>
                      {e.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-gray-400">{e.reported_by_name || '—'}</td>
                  <td className="px-5 py-3 text-gray-500">
                    {new Date(e.created_at).toLocaleString()}
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
