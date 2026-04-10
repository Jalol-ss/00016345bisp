import StatCard from '../../components/StatCard'
import Badge from '../../components/Badge'
import { Users, Building2, Car, CalendarCheck, DollarSign, ShieldCheck, AlertTriangle, MessageSquare } from 'lucide-react'
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, PieChart, Pie, Cell, Legend } from 'recharts'
import { useApp } from '../../context/AppContext'

const growth = [
  { m:'Jan', users: 1200, bookings: 320 },
  { m:'Feb', users: 1480, bookings: 410 },
  { m:'Mar', users: 1820, bookings: 530 },
  { m:'Apr', users: 2210, bookings: 690 },
  { m:'May', users: 2680, bookings: 820 },
  { m:'Jun', users: 3120, bookings: 980 }
]
const cityShare = [
  { name:'Tashkent', value: 48, color:'#1f54f5' },
  { name:'Samarkand', value: 18, color:'#3273ff' },
  { name:'Bukhara', value: 12, color:'#5896ff' },
  { name:'Fergana', value: 9, color:'#8ebcff' },
  { name:'Andijan', value: 7, color:'#bcd6ff' },
  { name:'Namangan', value: 6, color:'#d9e8ff' }
]

export default function AdminDashboard() {
  const { companies, users, bookings, cars } = useApp()
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">Platform overview</h1>
        <p className="text-slate-500">Monitor the entire RentRoad UZ marketplace.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Total users" value="3,124" delta={14}/>
        <StatCard icon={Building2} label="Companies" value={companies.length} delta={2}/>
        <StatCard icon={Car} label="Total cars" value="259" delta={6}/>
        <StatCard icon={CalendarCheck} label="Total bookings" value="4,820" delta={11}/>
        <StatCard icon={DollarSign} label="Revenue (YTD)" value="$1.4M" delta={22}/>
        <StatCard icon={CalendarCheck} label="Active rentals" value="142" sub="now on the road"/>
        <StatCard icon={ShieldCheck} label="Pending verifs" value="2" delta={-50}/>
        <StatCard icon={MessageSquare} label="Open tickets" value="7" sub="avg resp 18m"/>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="card p-5 lg:col-span-2">
          <h3 className="font-bold text-slate-900 mb-2">Growth — users vs bookings</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={growth}>
              <defs>
                <linearGradient id="ag1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#1f54f5" stopOpacity={0.4}/><stop offset="100%" stopColor="#1f54f5" stopOpacity={0}/></linearGradient>
                <linearGradient id="ag2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#10b981" stopOpacity={0.4}/><stop offset="100%" stopColor="#10b981" stopOpacity={0}/></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/>
              <XAxis dataKey="m" tick={{fontSize:12, fill:'#94a3b8'}} axisLine={false}/>
              <YAxis tick={{fontSize:12, fill:'#94a3b8'}} axisLine={false}/>
              <Tooltip/>
              <Area type="monotone" dataKey="users" stroke="#1f54f5" fill="url(#ag1)" strokeWidth={2}/>
              <Area type="monotone" dataKey="bookings" stroke="#10b981" fill="url(#ag2)" strokeWidth={2}/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="card p-5">
          <h3 className="font-bold text-slate-900 mb-2">Bookings by city</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={cityShare} dataKey="value" innerRadius={60} outerRadius={95} paddingAngle={3}>
                {cityShare.map((e,i)=><Cell key={i} fill={e.color}/>)}
              </Pie>
              <Legend wrapperStyle={{fontSize:11}}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card p-5">
          <h3 className="font-bold text-slate-900 mb-3">Top performing companies</h3>
          <div className="space-y-3">
            {[...companies].sort((a,b)=>b.rating-a.rating).slice(0,5).map((c,i)=>(
              <div key={c.id} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-brand-50 grid place-items-center text-lg">{c.logo}</div>
                <div className="flex-1">
                  <div className="font-semibold text-slate-900 text-sm">{c.name}</div>
                  <div className="text-xs text-slate-500">{c.fleetSize} cars · {c.branches} branches</div>
                </div>
                <div className="text-right text-xs">
                  <div className="font-bold text-slate-900">★ {c.rating}</div>
                  <div className="text-slate-500">{c.reviews} reviews</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="card p-5">
          <h3 className="font-bold text-slate-900 mb-3">Recent activity</h3>
          <div className="space-y-3 text-sm">
            {[
              ['New booking', 'BK10238 — Renault Duster', 'Just now'],
              ['Verification', 'New ID submitted by Bekzod E.', '5m ago'],
              ['New company', '"City Drive" applied to join', '2h ago'],
              ['Refund issued', '$120 refunded for BK10231', '4h ago']
            ].map(([t,d,w],i)=>(
              <div key={i} className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-brand-500"/>
                <div className="flex-1">
                  <div className="font-semibold text-slate-900">{t}</div>
                  <div className="text-xs text-slate-500">{d}</div>
                </div>
                <div className="text-xs text-slate-400">{w}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
