interface Props {
  label: string
  value: number | string
  color: 'red' | 'yellow' | 'green' | 'blue' | 'white'
  icon: string
}

const colorMap = {
  red: 'text-red-400 bg-red-900/20 border-red-900/40',
  yellow: 'text-yellow-400 bg-yellow-900/20 border-yellow-900/40',
  green: 'text-green-400 bg-green-900/20 border-green-900/40',
  blue: 'text-blue-400 bg-blue-900/20 border-blue-900/40',
  white: 'text-white bg-gray-800 border-gray-700',
}

export default function StatCard({ label, value, color, icon }: Props) {
  return (
    <div className={`border rounded-xl p-5 ${colorMap[color]}`}>
      <div className="flex items-center justify-between mb-2">
        <p className="text-gray-400 text-sm">{label}</p>
        <span className="text-2xl">{icon}</span>
      </div>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  )
}
