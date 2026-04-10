import { TrendingUp, TrendingDown } from 'lucide-react'

export default function StatCard({ icon: Icon, label, value, delta, color='brand', sub }) {
  const positive = (delta ?? 0) >= 0
  return (
    <div className="card p-5 hover:shadow-lg transition fade-in">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</div>
          <div className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-1.5">{value}</div>
          {sub && <div className="text-xs text-slate-500 mt-1">{sub}</div>}
        </div>
        <div className={`w-11 h-11 rounded-xl grid place-items-center bg-${color}-50 text-${color}-600`}>
          {Icon && <Icon className="w-5 h-5"/>}
        </div>
      </div>
      {delta !== undefined && (
        <div className={`mt-3 flex items-center gap-1 text-xs font-semibold ${positive ? 'text-emerald-600' : 'text-red-500'}`}>
          {positive ? <TrendingUp className="w-3.5 h-3.5"/> : <TrendingDown className="w-3.5 h-3.5"/>}
          {positive ? '+' : ''}{delta}% vs last month
        </div>
      )}
    </div>
  )
}
