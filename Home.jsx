import StatCard from '../../components/StatCard'
import Badge from '../../components/Badge'
import { Car, CheckCircle2, Wrench, Sparkles, CalendarCheck, DollarSign, Users, AlertTriangle, TrendingUp } from 'lucide-react'
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, PieChart, Pie, Cell, Legend } from 'recharts'
import { useApp } from '../../context/AppContext'

const fleetMixColors = ['#1f54f5', '#3273ff', '#5896ff', '#8ebcff', '#bcd6ff', '#d6e6ff']

export default function CompanyDashboard() {
  const { cars, bookings, branches, users, currentUser, companies, formatPrice } = useApp()
  const myCompanyId = currentUser?.companyId || 'c1'
  const company = companies.find(c => c.id === myCompanyId)

  const myCars = cars.filter(c => c.companyId === myCompanyId)
  const myBookings = bookings.filter(b => b.companyId === myCompanyId)
  const myBranches = branches.filter(b => b.companyId === myCompanyId)

  const total = myCars.length || 1
  const available = myCars.filter(c => c.status === 'Available').length
  const maintenance = myCars.filter(c => c.status === 'In Maintenance').length
  const detailing = myCars.filter(c => c.status === 'In Detailing').length
  const active = myBookings.filter(b => b.status === 'Active').length
  const upcoming = myBookings.filter(b => b.status === 'Upcoming').length
  const revenueWeek = myBookings
    .filter(b => b.status !== 'Cancelled')
    .reduce((sum, b) => sum + (b.total || 0), 0)
  const utilization = Math.round(((total - available) / total) * 100)

  // Build dynamic charts
  const revenueData = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((d, i) => ({
    name: d,
    revenue: Math.round((revenueWeek / 7) * (0.7 + ((i * 13) % 7) / 10))
  }))

  const branchData = myBranches.map(b => ({
    name: b.name.length > 12 ? b.name.slice(0, 11) + '…' : b.name,
    bookings: myBookings.filter(x => x.pickupBranchId === b.id).length || b.cars
  }))

  const typeMap = {}
  myCars.forEach(c => { typeMap[c.type] = (typeMap[c.type] || 0) + 1 })
  const fleetMix = Object.entries(typeMap).map(([name, value], i) => ({
    name, value, color: fleetMixColors[i % fleetMixColors.length]
  }))

  const todaySchedule = myBookings.slice(0, 4).map(b => {
    const car = myCars.find(c => c.id === b.carId)
    const u = users.find(x => x.id === b.userId)
    const br = myBranches.find(x => x.id === b.pickupBranchId)
    return {
      t: b.pickupDate?.slice(5) || '—',
      n: u?.name || 'Customer',
      c: car?.name || '—',
      b: br?.name || '—',
      type: b.status === 'Active' ? 'Drop-off' : 'Pickup',
      s: b.status
    }
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">Welcome back, {company?.name || currentUser?.name || 'Partner'} 👋</h1>
        <p className="text-slate-500">Here's what's happening across your fleet today.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Car} label="Total cars" value={String(myCars.length)} sub={`${myBranches.length} branches`}/>
        <StatCard icon={CheckCircle2} label="Available" value={String(available)} sub={`${Math.round((available/total)*100)}% of fleet`}/>
        <StatCard icon={Wrench} label="In maintenance" value={String(maintenance)}/>
        <StatCard icon={Sparkles} label="In detailing" value={String(detailing)}/>
        <StatCard icon={CalendarCheck} label="Active rentals" value={String(active)}/>
        <StatCard icon={CalendarCheck} label="Upcoming" value={String(upcoming)} sub="next 7 days"/>
        <StatCard icon={DollarSign} label="Revenue (total)" value={formatPrice(revenueWeek)}/>
        <StatCard icon={TrendingUp} label="Utilization" value={`${utilization}%`}/>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-slate-900">Revenue trend</h3>
            <span className="text-xs text-slate-500">Last 7 days</span>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/>
              <XAxis dataKey="name" tick={{fontSize:12, fill:'#94a3b8'}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fontSize:12, fill:'#94a3b8'}} axisLine={false} tickLine={false}/>
              <Tooltip/>
              <Line type="monotone" dataKey="revenue" stroke="#1f54f5" strokeWidth={3} dot={{r:5}}/>
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="card p-5">
          <h3 className="font-bold text-slate-900 mb-2">Fleet mix</h3>
          {fleetMix.length ? (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={fleetMix} dataKey="value" innerRadius={50} outerRadius={80} paddingAngle={3}>
                  {fleetMix.map((e,i)=><Cell key={i} fill={e.color}/>)}
                </Pie>
                <Legend wrapperStyle={{fontSize:12}}/>
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[260px] grid place-items-center text-sm text-slate-400">No fleet data</div>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="card p-5 lg:col-span-2">
          <h3 className="font-bold text-slate-900 mb-2">Bookings by branch</h3>
          {branchData.length ? (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={branchData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/>
                <XAxis dataKey="name" tick={{fontSize:11, fill:'#94a3b8'}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fontSize:12, fill:'#94a3b8'}} axisLine={false} tickLine={false}/>
                <Tooltip/>
                <Bar dataKey="bookings" fill="#3273ff" radius={[8,8,0,0]}/>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[240px] grid place-items-center text-sm text-slate-400">No branches yet</div>
          )}
        </div>
        <div className="card p-5">
          <h3 className="font-bold text-slate-900 mb-3">Alerts & reminders</h3>
          <div className="space-y-3">
            {[
              maintenance > 0 && { icon: Wrench, color:'amber', t:`${maintenance} car${maintenance>1?'s':''} currently in service` },
              upcoming > 0 && { icon: CalendarCheck, color:'brand', t:`${upcoming} upcoming booking${upcoming>1?'s':''} to confirm` },
              active > 0 && { icon: AlertTriangle, color:'red', t:`${active} active rental${active>1?'s':''} on the road` },
              { icon: Users, color:'emerald', t:`${myBranches.length} branch${myBranches.length===1?'':'es'} reporting today` }
            ].filter(Boolean).map((a,i)=>(
              <div key={i} className="flex items-start gap-3">
                <div className={`w-9 h-9 rounded-xl bg-${a.color}-50 text-${a.color}-600 grid place-items-center shrink-0`}><a.icon className="w-4 h-4"/></div>
                <div className="text-sm text-slate-700">{a.t}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="p-5 flex items-center justify-between border-b border-slate-100">
          <h3 className="font-bold text-slate-900">Recent bookings</h3>
          <Badge>Live</Badge>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr><th className="text-left p-3">Date</th><th className="text-left p-3">Customer</th><th className="text-left p-3">Car</th><th className="text-left p-3">Branch</th><th className="text-left p-3">Type</th><th className="text-left p-3">Status</th></tr>
          </thead>
          <tbody>
            {todaySchedule.length ? todaySchedule.map((r,i)=>(
              <tr key={i} className="border-t border-slate-100">
                <td className="p-3 font-mono text-xs">{r.t}</td>
                <td className="p-3 font-semibold">{r.n}</td>
                <td className="p-3">{r.c}</td>
                <td className="p-3 text-slate-500">{r.b}</td>
                <td className="p-3">{r.type}</td>
                <td className="p-3"><Badge>{r.s}</Badge></td>
              </tr>
            )) : (
              <tr><td colSpan="6" className="p-8 text-center text-sm text-slate-400">No bookings yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
