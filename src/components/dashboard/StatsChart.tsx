import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Emergency } from '../../types'

interface Props { emergencies: Emergency[] }

const STATUS_COLORS: Record<string, string> = {
  pending: '#ef4444', responding: '#f59e0b', resolved: '#22c55e', cancelled: '#6b7280'
}

export default function StatsChart({ emergencies }: Props) {
  const typeData = ['medical', 'fire', 'flood', 'accident', 'crime', 'other'].map(type => ({
    name: type, count: emergencies.filter(e => e.type === type).length
  }))

  const statusData = ['pending', 'responding', 'resolved', 'cancelled'].map(status => ({
    name: status, value: emergencies.filter(e => e.status === status).length
  })).filter(d => d.value > 0)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <h3 className="text-white font-semibold mb-4">By Type</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={typeData}>
            <XAxis dataKey="name" stroke="#6b7280" tick={{ fontSize: 11 }} />
            <YAxis stroke="#6b7280" tick={{ fontSize: 11 }} />
            <Tooltip contentStyle={{ background: '#111827', border: '1px solid #374151', borderRadius: 8 }} />
            <Bar dataKey="count" fill="#ef4444" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <h3 className="text-white font-semibold mb-4">By Status</h3>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70}>
              {statusData.map((entry, i) => (
                <Cell key={i} fill={STATUS_COLORS[entry.name] || '#6b7280'} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ background: '#111827', border: '1px solid #374151', borderRadius: 8 }} />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex flex-wrap gap-3 mt-2 justify-center">
          {statusData.map(d => (
            <span key={d.name} className="flex items-center gap-1 text-xs text-gray-400">
              <span className="w-2 h-2 rounded-full inline-block" style={{ background: STATUS_COLORS[d.name] }} />
              {d.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
