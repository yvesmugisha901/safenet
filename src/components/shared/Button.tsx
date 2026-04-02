interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

const variants = {
  primary: 'bg-red-600 hover:bg-red-700 text-white',
  secondary: 'bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700',
  danger: 'bg-red-900/40 hover:bg-red-900/60 text-red-400 border border-red-900/60',
  ghost: 'hover:bg-gray-800 text-gray-400 hover:text-white',
}

const sizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
}

export default function Button({ variant = 'primary', size = 'md', loading, children, disabled, ...props }: Props) {
  return (
    <button {...props} disabled={disabled || loading}
      className={`font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]} ${sizes[size]} ${props.className || ''}`}>
      {loading ? 'Loading...' : children}
    </button>
  )
}
