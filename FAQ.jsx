import DashboardLayout from '../../components/DashboardLayout'
import AuthRequired from '../../components/AuthRequired'
import { useApp } from '../../context/AppContext'
import { LayoutDashboard, Car, Building2, CalendarCheck, Users, BarChart3, Wrench, Settings } from 'lucide-react'

const navItems = [
  { to: '/company/dashboard', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/company/fleet', label: 'Fleet', icon: Car },
  { to: '/company/branches', label: 'Branches', icon: Building2 },
  { to: '/company/bookings', label: 'Bookings', icon: CalendarCheck },
  { to: '/company/customers', label: 'Customers', icon: Users },
  { to: '/company/maintenance', label: 'Maintenance', icon: Wrench },
  { to: '/company/reports', label: 'Reports', icon: BarChart3 },
  { to: '/company/settings', label: 'Settings', icon: Settings }
]

export default function CompanyShell() {
  const { isLoggedIn, currentUser, companies } = useApp()
  if (!isLoggedIn || currentUser?.role !== 'company') {
    return (
      <AuthRequired
        icon={Building2}
        title="Company login required"
        message="This dashboard is only available to authenticated rental companies. Please log in with a company account."
      />
    )
  }
  const company = companies.find(c => c.id === currentUser.companyId)
  const subtitle = `${company?.name || currentUser.name} — ${company?.headquarters || 'Uzbekistan'} HQ`
  return <DashboardLayout title="Company Portal" subtitle={subtitle} navItems={navItems}/>
}
