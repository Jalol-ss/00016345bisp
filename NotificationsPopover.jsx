import { Link, NavLink, Outlet } from 'react-router-dom'
import { Search, Car } from 'lucide-react'
import NotificationsPopover from './NotificationsPopover'

// Reusable shell for both company and admin dashboards
export default function DashboardLayout({ title, subtitle, navItems, accent='brand' }) {
  return (
    <div className="min-h-screen bg-slate-100 flex">
      <aside className="hidden lg:flex w-64 bg-white border-r border-slate-200 flex-col">
        <Link to="/" className="h-16 flex items-center gap-2 px-5 border-b border-slate-100">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 grid place-items-center text-white"><Car className="w-5 h-5"/></div>
          <div>
            <div className="font-extrabold text-slate-900">RentRoad UZ</div>
            <div className="text-[10px] uppercase tracking-widest text-slate-400">{title}</div>
          </div>
        </Link>
        <nav className="p-3 flex-1 overflow-y-auto">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({isActive}) => `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium mb-1 transition ${
                isActive ? `bg-${accent}-50 text-${accent}-700` : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <item.icon className="w-4 h-4"/>{item.label}
              {item.badge && <span className="ml-auto badge bg-red-100 text-red-700">{item.badge}</span>}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-100">
          <Link to="/" className="text-xs text-slate-500 hover:text-brand-600">← Back to user site</Link>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
          <div>
            <div className="text-sm font-bold text-slate-900">{subtitle}</div>
            <div className="text-xs text-slate-500">{new Date().toDateString()}</div>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative hidden md:block">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400"/>
              <input className="input pl-9 py-2 w-64" placeholder="Search…"/>
            </div>
            <NotificationsPopover/>
            <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-700 grid place-items-center font-bold">RR</div>
          </div>
        </header>
        <main className="flex-1 p-6">
          <Outlet/>
        </main>
      </div>
    </div>
  )
}
