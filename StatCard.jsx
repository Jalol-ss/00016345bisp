import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Car, Menu, X, MapPin, CalendarCheck, User, LogIn, Search, LayoutDashboard, ShieldCheck, LogOut } from 'lucide-react'
import { useState } from 'react'
import { useApp } from '../context/AppContext'
import NotificationsPopover from './NotificationsPopover'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { currentUser, isLoggedIn, logout, t } = useApp()
  const navigate = useNavigate()

  const link = ({ isActive }) =>
    `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition ${
      isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-100'
    }`

  const initials = currentUser?.name?.split(' ').map(n=>n[0]).slice(0,2).join('') || '?'

  const doLogout = () => {
    logout()
    setMenuOpen(false)
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 grid place-items-center text-white shadow-sm">
            <Car className="w-5 h-5" />
          </div>
          <div className="leading-tight">
            <div className="font-extrabold text-slate-900">RentRoad <span className="text-brand-600">UZ</span></div>
            <div className="text-[10px] uppercase tracking-widest text-slate-400">Car Rental Marketplace</div>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          <NavLink to="/" end className={link}><Car className="w-4 h-4"/>{t('nav.home')}</NavLink>
          <NavLink to="/find-cars" className={link}><Search className="w-4 h-4"/>{t('nav.find_cars')}</NavLink>
          <NavLink to="/map-view" className={link}><MapPin className="w-4 h-4"/>{t('nav.map_view')}</NavLink>
          <NavLink to="/bookings" className={link}><CalendarCheck className="w-4 h-4"/>{t('nav.my_bookings')}</NavLink>
          <NavLink to="/profile" className={link}><User className="w-4 h-4"/>{t('nav.profile')}</NavLink>
        </nav>

        <div className="hidden lg:flex items-center gap-2">
          {isLoggedIn && <NotificationsPopover/>}
          {!isLoggedIn && (
            <>
              <Link to="/login" className="btn-secondary text-xs"><LogIn className="w-4 h-4"/>{t('nav.login')}</Link>
              <Link to="/register" className="btn-primary text-xs">{t('nav.signup')}</Link>
            </>
          )}
          {isLoggedIn && (
            <div className="relative">
              <button onClick={()=>setMenuOpen(!menuOpen)} className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-slate-100 transition">
                <div className="w-8 h-8 rounded-lg bg-brand-100 text-brand-700 grid place-items-center text-xs font-bold">{initials}</div>
                <div className="text-left leading-tight">
                  <div className="text-xs font-semibold text-slate-900 max-w-[120px] truncate">{currentUser.name}</div>
                  <div className="text-[10px] uppercase text-slate-400 tracking-wider">{currentUser.role}</div>
                </div>
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-52 card p-2 shadow-lg z-50">
                  {currentUser.role === 'user' && (
                    <>
                      <Link to="/profile" onClick={()=>setMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-100"><User className="w-4 h-4"/>My profile</Link>
                      <Link to="/bookings" onClick={()=>setMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-100"><CalendarCheck className="w-4 h-4"/>My bookings</Link>
                    </>
                  )}
                  {currentUser.role === 'company' && (
                    <Link to="/company/dashboard" onClick={()=>setMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-100"><LayoutDashboard className="w-4 h-4"/>Company dashboard</Link>
                  )}
                  {currentUser.role === 'admin' && (
                    <Link to="/admin/dashboard" onClick={()=>setMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-100"><ShieldCheck className="w-4 h-4"/>Admin dashboard</Link>
                  )}
                  <div className="h-px bg-slate-100 my-1"/>
                  <button onClick={doLogout} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50"><LogOut className="w-4 h-4"/>Log out</button>
                </div>
              )}
            </div>
          )}
        </div>

        <button className="lg:hidden p-2" onClick={() => setOpen(!open)}>
          {open ? <X/> : <Menu/>}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-slate-100 bg-white">
          <div className="p-4 grid gap-1">
            <NavLink to="/" end className={link} onClick={()=>setOpen(false)}>Home</NavLink>
            <NavLink to="/find-cars" className={link} onClick={()=>setOpen(false)}>Find Cars</NavLink>
            <NavLink to="/map-view" className={link} onClick={()=>setOpen(false)}>Map View</NavLink>
            <NavLink to="/bookings" className={link} onClick={()=>setOpen(false)}>My Bookings</NavLink>
            <NavLink to="/profile" className={link} onClick={()=>setOpen(false)}>Profile</NavLink>
            <div className="h-px bg-slate-100 my-2"/>
            {!isLoggedIn ? (
              <>
                <NavLink to="/login" className={link} onClick={()=>setOpen(false)}>Login</NavLink>
                <NavLink to="/register" className={link} onClick={()=>setOpen(false)}>Sign up</NavLink>
              </>
            ) : (
              <button onClick={()=>{doLogout();setOpen(false)}} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50"><LogOut className="w-4 h-4"/>Log out</button>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
