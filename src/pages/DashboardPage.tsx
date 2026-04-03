import { useAuth } from '../context/AuthContext'
import AdminDashboard from '../components/dashboard/AdminDashboard'
import ManagerDashboard from '../components/dashboard/ManagerDashboard'
import UserDashboard from '../components/dashboard/UserDashboard'

export default function DashboardPage() {
  const { user } = useAuth()

  if (user?.role === 'admin') return <AdminDashboard />
  if (user?.role === 'resource_manager') return <ManagerDashboard />
  return <UserDashboard />
}