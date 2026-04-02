import { useState, useEffect } from 'react'
import { Notification } from '../types'
import { notificationAPI } from '../services/api'

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  const fetch = async () => {
    try {
      const data = await notificationAPI.list() as Notification[]
      setNotifications(data)
      setUnreadCount(data.filter(n => !n.read).length)
    } catch { }
  }

  const markRead = async (id: string) => {
    await notificationAPI.markRead(id)
    fetch()
  }

  useEffect(() => { fetch() }, [])

  return { notifications, unreadCount, markRead, refetch: fetch }
}
