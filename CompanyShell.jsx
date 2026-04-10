import StatCard from '../../components/StatCard'
import { DollarSign, TrendingUp, Building2, Users } from 'lucide-react'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line } from 'recharts'

const commission = [
  { m:'Jan', value: 2840 },{ m:'Feb', value: 3120 },{ m:'Mar', value: 3760 },
  { m:'Apr', value: 4210 },{ m:'May', value: 4890 },{ m:'Jun', value: 5320 }
]
const categories = [
  { name:'Sedan', count: 84 },
  { name:'SUV', count: 71 },
  { name:'Economy', count: 52 },
  { name:'Luxury', count: 31 },
  { name:'Van', count: 21 }
]

export default function AdminReports() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Reports</h1>
        <p className="text-slate-500 text-sm">Platform-wide analytics and financial overview.</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={DollarSign} label="Platform commission" value="$148K" delta={19}/>
        <StatCard icon={TrendingUp} label="Growth (MoM)" value="14%" delta={3}/>
        <StatCard icon={Building2} label="Active companies" value="6" delta={2}/>
        <StatCard icon={Users} label="New users" value="312" delta={9}/>
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card p-5">
          <h3 className="font-bold text-slate-900 mb-2">Commission revenue</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={commission}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/>
              <XAxis dataKey="m" tick={{fontSize:12, fill:'#94a3b8'}} axisLine={false}/>
              <YAxis tick={{fontSize:12, fill:'#94a3b8'}} axisLine={false}/>
              <Tooltip/>
              <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} dot={{r:5}}/>
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="card p-5">
          <h3 className="font-bold text-slate-900 mb-2">Most popular categories</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={categories}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/>
              <XAxis dataKey="name" tick={{fontSize:12, fill:'#94a3b8'}} axisLine={false}/>
              <YAxis tick={{fontSize:12, fill:'#94a3b8'}} axisLine={false}/>
              <Tooltip/>
              <Bar dataKey="count" fill="#1f54f5" radius={[8,8,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
