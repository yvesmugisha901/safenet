import { Emergency } from '../../types'

interface Props { emergencies: Emergency[] }

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-red-900/30 text-red-400',
  responding: 'bg-yellow-900/30 text-yellow-400',
  resolved: 'bg-green-900/30 text-green-400',
  cancelled: 'bg-gray-800 text-gray-500',
}

const TYPE_ICONS: Record<string, string> = {
  medical: '🏥', fire: '🔥', flood: '🌊', accident: '🚗', crime: '🚨', other: '⚠️'
}

export default function EmergencyTable({ emergencies }: Props) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-800">
        <h3 className="text-white font-semibold">Recent Emergencies</h3>
      </div>
      {emergencies.length === 0 ? (
        <div className="px-5 py-10 text-center text-gray-500">No emergencies reported yet</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800">
                {['Type', 'Title', 'Status', 'Reported By', 'Time'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-gray-500 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {emergencies.map(e => (
                <tr key={e.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                  <td className="px-5 py-3 text-xl">{TYPE_ICONS[e.type] || '⚠️'}</td>
                  <td className="px-5 py-3 text-white font-medium">{e.title}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${STATUS_COLORS[e.status]}`}>
                      {e.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-gray-400">{e.reported_by_name || '—'}</td>
                  <td className="px-5 py-3 text-gray-500 text-xs">
                    {new Date(e.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
