import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

// Fake verification steps shown to the user
const VERIFICATION_STEPS = [
  { label: 'Validating organization credentials', duration: 900 },
  { label: 'Cross-referencing resource manager registry', duration: 1200 },
  { label: 'Verifying authorization level', duration: 800 },
  { label: 'Checking department access rights', duration: 700 },
  { label: 'Finalizing account privileges', duration: 600 },
]

function ResourceManagerVerificationModal({
  onComplete,
  onCancel,
}: {
  onComplete: () => void
  onCancel: () => void
}) {
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [done, setDone] = useState(false)

  useEffect(() => {
    let stepIndex = 0

    const runStep = () => {
      if (stepIndex >= VERIFICATION_STEPS.length) {
        setDone(true)
        return
      }

      setCurrentStep(stepIndex)

      const timer = setTimeout(() => {
        setCompletedSteps(prev => [...prev, stepIndex])
        stepIndex++
        runStep()
      }, VERIFICATION_STEPS[stepIndex].duration)

      return timer
    }

    const t = runStep()
    return () => clearTimeout(t as any)
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8 w-full max-w-md mx-4 shadow-2xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-red-600/20 border border-red-500/40 flex items-center justify-center">
            <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg">Resource Manager Verification</h3>
            <p className="text-gray-400 text-sm">Elevated privileges require identity check</p>
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-3 mb-6">
          {VERIFICATION_STEPS.map((step, i) => {
            const isCompleted = completedSteps.includes(i)
            const isActive = currentStep === i && !isCompleted
            const isPending = i > currentStep

            return (
              <div key={i} className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300
                ${isActive ? 'bg-red-950/40 border border-red-700/40' : ''}
                ${isCompleted ? 'opacity-60' : ''}
                ${isPending ? 'opacity-30' : ''}`}>

                {/* Icon */}
                <div className="w-6 h-6 flex-shrink-0 flex items-center justify-center">
                  {isCompleted ? (
                    <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : isActive ? (
                    <svg className="w-5 h-5 text-red-400 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-gray-600" />
                  )}
                </div>

                <span className={`text-sm ${isActive ? 'text-white' : isCompleted ? 'text-gray-400' : 'text-gray-600'}`}>
                  {step.label}
                </span>

                {isCompleted && (
                  <span className="ml-auto text-xs text-green-500 font-medium">OK</span>
                )}
              </div>
            )
          })}
        </div>

        {/* Result */}
        {done ? (
          <div className="space-y-4">
            <div className="bg-green-900/30 border border-green-700/50 rounded-lg p-4 flex items-start gap-3">
              <svg className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-green-300 text-sm font-medium">Verification Passed</p>
                <p className="text-green-500/70 text-xs mt-0.5">
                  Your identity has been confirmed. Resource Manager access will be granted.
                </p>
              </div>
            </div>
            <button
              onClick={onComplete}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 rounded-lg transition-colors">
              Continue Registration
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <p className="text-gray-500 text-xs">
              Step {currentStep + 1} of {VERIFICATION_STEPS.length}
            </p>
            <button
              onClick={onCancel}
              className="text-gray-500 hover:text-gray-300 text-sm transition-colors">
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function RegisterForm() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', role: 'user' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showVerification, setShowVerification] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Intercept resource_manager role — show fake verification first
    if (form.role === 'resource_manager') {
      setShowVerification(true)
      return
    }

    await doRegister()
  }

  const doRegister = async () => {
    setLoading(true)
    try {
      await register(form)
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const handleVerificationComplete = () => {
    setShowVerification(false)
    doRegister()
  }

  const handleVerificationCancel = () => {
    setShowVerification(false)
  }

  return (
    <>
      {showVerification && (
        <ResourceManagerVerificationModal
          onComplete={handleVerificationComplete}
          onCancel={handleVerificationCancel}
        />
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-900/40 border border-red-700 text-red-300 rounded-lg p-3 text-sm">{error}</div>
        )}
        {[
          { label: 'Full Name', key: 'name', type: 'text', placeholder: 'John Doe' },
          { label: 'Email', key: 'email', type: 'email', placeholder: 'you@example.com' },
          { label: 'Password', key: 'password', type: 'password', placeholder: '••••••••' },
          { label: 'Phone', key: 'phone', type: 'tel', placeholder: '+250 788 000 000' },
        ].map(field => (
          <div key={field.key}>
            <label className="text-gray-400 text-sm block mb-1">{field.label}</label>
            <input type={field.type} required={field.key !== 'phone'}
              value={(form as any)[field.key]}
              onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-red-500"
              placeholder={field.placeholder} />
          </div>
        ))}
        <div>
          <label className="text-gray-400 text-sm block mb-1">Role</label>
          <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-red-500">
            <option value="user">User</option>
            <option value="resource_manager">Resource Manager</option>
          </select>
        </div>
        <button type="submit" disabled={loading}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-50">
          {loading ? 'Creating account...' : 'Create Account'}
        </button>
        <p className="text-gray-500 text-sm text-center">
          Already have an account? <Link to="/login" className="text-red-400 hover:text-red-300">Sign in</Link>
        </p>
      </form>
    </>
  )
}