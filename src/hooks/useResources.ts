import { useState, useEffect, useCallback } from 'react'
import { Resource } from '../types'
import { resourceAPI } from '../services/api'

export function useResources() {
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetch = useCallback(async () => {
    setLoading(true)
    try {
      const data = await resourceAPI.list() as Resource[]
      setResources(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetch() }, [fetch])

  return { resources, loading, error, refetch: fetch }
}
