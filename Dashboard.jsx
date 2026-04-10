import DashboardLayout from '../../components/DashboardLayout'
import { LayoutDashboard, Building2, Users, CalendarCheck, ShieldCheck, Car, BarChart3, LifeBuoy, Settings } from 'lucide-react'

const navItems = [
  { to: '/admin/dashboard', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/admin/companies', label: 'Companies', icon: Building2 },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/bookings', label: 'Bookings', icon: CalendarCheck },
  { to: '/admin/verifications', label: 'Verifications', icon: ShieldCheck, badge: '2' },
  { to: '/admin/fleet', label: 'Fleet oversight', icon: Car },
  { to: '/admin/reports', label: 'Reports', icon: BarChart3 },
  { to: '/admin/support', label: 'Support', icon: LifeBuoy },
  { to: '/admin/settings', label: 'Settings', icon: Settings }
]

export default function AdminShell() {
  return <DashboardLayout title="Admin Portal" subtitle="RentRoad UZ — Super Admin" navItems={navItems}/>
}
