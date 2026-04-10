import { Link } from 'react-router-dom'
import { Lock, LogIn, UserPlus } from 'lucide-react'

// Shown on personal pages (My Bookings, Profile) when the visitor is not logged in.
export default function AuthRequired({ title, message, icon: Icon = Lock }) {
  return (
    <div className="max-w-xl mx-auto px-4 py-20 text-center fade-in">
      <div className="w-20 h-20 mx-auto rounded-2xl bg-brand-50 text-brand-600 grid place-items-center">
        <Icon className="w-10 h-10"/>
      </div>
      <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-6">{title}</h2>
      <p className="text-slate-500 mt-2 max-w-sm mx-auto">{message}</p>
      <div className="mt-6 flex items-center justify-center gap-3">
        <Link to="/login" className="btn-primary"><LogIn className="w-4 h-4"/>Login</Link>
        <Link to="/register" className="btn-secondary"><UserPlus className="w-4 h-4"/>Create account</Link>
      </div>
    </div>
  )
}
