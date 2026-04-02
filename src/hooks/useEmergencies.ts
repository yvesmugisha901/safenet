import { useState, useEffect, useCallback } from 'react'
import { Emergency } from '../types'
import { emergencyAPI } from '../services/api'

export function useEmergencies() {
  const [emergencies, setEmergencies] = useState<Emergency[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetch = useCallback(async () => {
    setLoading(true)
    try {
      const data = await emergencyAPI.list() as Emergency[]
      setEmergencies(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetch() }, [fetch])

  return { emergencies, loading, error, refetch: fetch }
}
