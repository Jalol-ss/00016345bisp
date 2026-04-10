import { Link, useNavigate } from 'react-router-dom'
import { Car, Mail, Lock, User, ShieldCheck, Building2, UserCircle, AlertCircle } from 'lucide-react'
import { useState } from 'react'
import { useApp, DEMO_ACCOUNTS } from '../../context/AppContext'

export function Login() { return <AuthShell mode="login"/> }
export function Register() { return <AuthShell mode="register"/> }

function AuthShell({ mode }) {
  const isLogin = mode === 'login'
  const navigate = useNavigate()
  const { login, register } = useApp()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    if (isLogin) {
      const res = login(email, password)
      if (!res.ok) { setError(res.error); return }
      navigate(res.redirect)
      return
    }
    // Register flow — creates a brand new user
    if (password !== confirm) { setError('Passwords do not match'); return }
    const res = register(name, email, password)
    if (!res.ok) { setError(res.error); return }
    navigate(res.redirect)
  }

  const quickLogin = (acc) => {
    setEmail(acc.email)
    setPassword(acc.password)
    const res = login(acc.email, acc.password)
    if (res.ok) navigate(res.redirect)
  }

  const roleIcon = { user: UserCircle, company: Building2, admin: ShieldCheck }
  const adminAcc   = DEMO_ACCOUNTS.find(a => a.role === 'admin')
  const userAcc    = DEMO_ACCOUNTS.find(a => a.role === 'user')
  const companyAccs = DEMO_ACCOUNTS.filter(a => a.role === 'company')

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* ----- LEFT SIDE — branding + demo credentials ----- */}
      <div className="hidden lg:flex relative bg-gradient-to-br from-brand-700 via-brand-600 to-brand-900 text-white p-10 items-start overflow-y-auto">
        <div className="absolute inset-0 opacity-20" style={{backgroundImage:'radial-gradient(circle at 20% 30%, white 1px, transparent 1px)', backgroundSize:'30px 30px'}}/>
        <div className="relative w-full max-w-md mx-auto">
          <Link to="/" className="flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-white/15 grid place-items-center"><Car className="w-5 h-5"/></div>
            <div className="font-extrabold text-xl">RentRoad UZ</div>
          </Link>
          <h1 className="text-3xl font-extrabold leading-tight">{isLogin ? 'Welcome back.' : 'Join the road.'}</h1>
          <p className="mt-2 text-brand-100">The unified national car rental platform of Uzbekistan. One marketplace, every verified rental company.</p>

          {isLogin && (
            <div className="mt-6 rounded-2xl bg-white/10 border border-white/20 backdrop-blur p-4">
              <div className="flex items-center gap-2 text-sm font-bold mb-3">
                <AlertCircle className="w-4 h-4"/>Demo credentials
              </div>

              {/* Admin */}
              <DemoCard acc={adminAcc} onClick={() => quickLogin(adminAcc)} icon={ShieldCheck} label="Admin"/>

              {/* User */}
              <div className="mt-3">
                <DemoCard acc={userAcc} onClick={() => quickLogin(userAcc)} icon={UserCircle} label="End user"/>
              </div>

              {/* Companies */}
              <div className="mt-4">
                <div className="text-[11px] uppercase tracking-wider text-brand-200 font-bold mb-2">Companies (one dashboard each)</div>
                <div className="space-y-2">
                  {companyAccs.map(a => (
                    <DemoCard key={a.email} acc={a} onClick={() => quickLogin(a)} icon={Building2} label={a.name}/>
                  ))}
                </div>
              </div>

              <div className="text-[11px] text-brand-200 mt-3">Tap any card to log in instantly. New accounts you register are kept separate from these demo logins.</div>
            </div>
          )}
        </div>
      </div>

      {/* ----- RIGHT SIDE — form ----- */}
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <Link to="/" className="flex items-center gap-2 mb-6 lg:hidden">
            <div className="w-9 h-9 rounded-xl bg-brand-600 grid place-items-center text-white"><Car className="w-5 h-5"/></div>
            <span className="font-extrabold">RentRoad UZ</span>
          </Link>
          <h2 className="text-2xl font-extrabold text-slate-900">{isLogin?'Sign in to your account':'Create your account'}</h2>
          <p className="text-sm text-slate-500 mt-1">{isLogin?'Welcome back, please enter your details.':'Sign up to book cars across Uzbekistan.'}</p>

          {isLogin && (
            <div className="lg:hidden mt-4 rounded-xl bg-brand-50 border border-brand-100 p-3">
              <div className="text-xs font-bold text-brand-700 mb-2">Demo accounts — tap to log in</div>
              <div className="grid gap-1 max-h-44 overflow-y-auto">
                {DEMO_ACCOUNTS.map(a => (
                  <button key={a.email} type="button" onClick={()=>quickLogin(a)}
                    className="w-full flex items-center justify-between text-left py-1 text-[11px]">
                    <span className="font-semibold capitalize">{a.role === 'company' ? a.name : a.role}</span>
                    <span className="font-mono text-brand-700 truncate ml-2">{a.email}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-3">
            {!isLogin && (
              <div>
                <label className="label">Full name</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-3.5 text-slate-400"/>
                  <input value={name} onChange={e=>setName(e.target.value)} required className="input pl-9" placeholder="Jane Doe"/>
                </div>
              </div>
            )}
            <div>
              <label className="label">Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3.5 text-slate-400"/>
                <input value={email} onChange={e=>setEmail(e.target.value)} type="email" required className="input pl-9" placeholder="you@example.com"/>
              </div>
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3.5 text-slate-400"/>
                <input value={password} onChange={e=>setPassword(e.target.value)} type="password" required className="input pl-9" placeholder="••••••••"/>
              </div>
            </div>
            {!isLogin && (
              <div>
                <label className="label">Confirm password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-3.5 text-slate-400"/>
                  <input value={confirm} onChange={e=>setConfirm(e.target.value)} type="password" required className="input pl-9" placeholder="••••••••"/>
                </div>
              </div>
            )}
            {error && (
              <div className="text-xs rounded-lg bg-red-50 text-red-700 p-3 border border-red-100">{error}</div>
            )}
            <button type="submit" className="btn-primary w-full">{isLogin?'Sign in':'Create account'}</button>
          </form>

          <div className="mt-5 text-center text-sm text-slate-500">
            {isLogin
              ? <>Don't have an account? <Link to="/register" className="text-brand-600 font-semibold">Sign up</Link></>
              : <>Already have an account? <Link to="/login" className="text-brand-600 font-semibold">Sign in</Link></>}
          </div>
        </div>
      </div>
    </div>
  )
}

function DemoCard({ acc, onClick, icon: Icon, label }) {
  if (!acc) return null
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center gap-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl p-2.5 text-left transition"
    >
      <div className="w-8 h-8 rounded-lg bg-white/20 grid place-items-center"><Icon className="w-4 h-4"/></div>
      <div className="flex-1 min-w-0">
        <div className="text-[10px] uppercase tracking-wide text-brand-200 font-bold">{label}</div>
        <div className="text-xs font-mono truncate">{acc.email}</div>
        <div className="text-[10px] font-mono text-brand-200">{acc.password}</div>
      </div>
      <div className="text-[10px] font-bold bg-white/20 rounded-md px-2 py-0.5">Log in</div>
    </button>
  )
}
