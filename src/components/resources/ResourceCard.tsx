import { Resource } from '../../types'

interface Props { resource: Resource; onToggle?: (id: string, available: boolean) => void }

const TYPE_ICONS: Record<string, string> = {
  hospital: '🏥', fire_station: '🚒', shelter: '🏠', police: '👮', volunteer: '🤝'
}

export default function ResourceCard({ resource, onToggle }: Props) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-600 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <span className="text-3xl">{TYPE_ICONS[resource.type] || '📍'}</span>
          <div>
            <h3 className="text-white font-semibold">{resource.name}</h3>
            <p className="text-gray-400 text-sm capitalize mt-0.5">{resource.type.replace('_', ' ')}</p>
            <p className="text-gray-500 text-xs mt-1">📍 {resource.address}</p>
            {resource.phone && <p className="text-gray-500 text-xs">📞 {resource.phone}</p>}
            {resource.distance_km !== undefined && (
              <p className="text-blue-400 text-xs mt-1">📏 {resource.distance_km.toFixed(1)} km away</p>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${resource.available ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'
            }`}>
            {resource.available ? 'Available' : 'Unavailable'}
          </span>
          {resource.capacity > 0 && (
            <span className="text-gray-500 text-xs">Cap: {resource.capacity}</span>
          )}
          {onToggle && (
            <button onClick={() => onToggle(resource.id, !resource.available)}
              className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1 rounded-lg">
              Toggle
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
