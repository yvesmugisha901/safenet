export const EMERGENCY_TYPES = [
  { value: 'medical', label: 'Medical', icon: '🏥' },
  { value: 'fire', label: 'Fire', icon: '🔥' },
  { value: 'flood', label: 'Flood', icon: '🌊' },
  { value: 'accident', label: 'Accident', icon: '🚗' },
  { value: 'crime', label: 'Crime', icon: '🚨' },
  { value: 'other', label: 'Other', icon: '⚠️' },
]

export const RESOURCE_TYPES = [
  { value: 'hospital', label: 'Hospital', icon: '🏥' },
  { value: 'fire_station', label: 'Fire Station', icon: '🚒' },
  { value: 'shelter', label: 'Shelter', icon: '🏠' },
  { value: 'police', label: 'Police', icon: '👮' },
  { value: 'volunteer', label: 'Volunteer', icon: '🤝' },
]

export const STATUS_LABELS = {
  pending: { label: 'Pending', color: 'text-red-400' },
  responding: { label: 'Responding', color: 'text-yellow-400' },
  resolved: { label: 'Resolved', color: 'text-green-400' },
  cancelled: { label: 'Cancelled', color: 'text-gray-500' },
}
