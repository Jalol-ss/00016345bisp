import { useApp } from '../../context/AppContext'
import Badge from '../../components/Badge'
import { Wrench, Sparkles, AlertTriangle } from 'lucide-react'

export default function Maintenance() {
  const { cars, branches, currentUser } = useApp()
  const myCompanyId = currentUser?.companyId || 'c1'
  const myCars = cars.filter(c => c.companyId === myCompanyId)
  const maint = myCars.filter(c => c.status === 'In Maintenance')
  const detail = myCars.filter(c => c.status === 'In Detailing')
  const oos = myCars.filter(c => c.status === 'Out of Service')

  const queue = [...maint, ...detail, ...oos]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Maintenance & detailing</h1>
        <p className="text-slate-500 text-sm">Track service queue, inspections and damage reports.</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div className="card p-5"><div className="flex items-center gap-3"><div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 grid place-items-center"><Wrench/></div><div><div className="text-2xl font-extrabold">{maint.length}</div><div className="text-xs text-slate-500">In maintenance</div></div></div></div>
        <div className="card p-5"><div className="flex items-center gap-3"><div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 grid place-items-center"><Sparkles/></div><div><div className="text-2xl font-extrabold">{detail.length}</div><div className="text-xs text-slate-500">In detailing</div></div></div></div>
        <div className="card p-5"><div className="flex items-center gap-3"><div className="w-11 h-11 rounded-xl bg-red-50 text-red-600 grid place-items-center"><AlertTriangle/></div><div><div className="text-2xl font-extrabold">{oos.length}</div><div className="text-xs text-slate-500">Out of service</div></div></div></div>
      </div>

      <div className="card overflow-hidden">
        <div className="p-5 border-b border-slate-100 font-bold">Service queue</div>
        {queue.length ? (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr><th className="text-left p-4">Car</th><th className="text-left p-4">Plate</th><th className="text-left p-4">Branch</th><th className="text-left p-4">Mileage</th><th className="text-left p-4">Status</th></tr>
            </thead>
            <tbody>
              {queue.map(c => {
                const br = branches.find(b => b.id === c.branchId)
                return (
                  <tr key={c.id} className="border-t border-slate-100">
                    <td className="p-4 font-semibold">{c.name}</td>
                    <td className="p-4 font-mono text-xs">{c.plate}</td>
                    <td className="p-4 text-slate-500">{br?.name || '—'}</td>
                    <td className="p-4">{c.mileage.toLocaleString()} km</td>
                    <td className="p-4"><Badge>{c.status}</Badge></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        ) : (
          <div className="p-12 text-center text-sm text-slate-400">No vehicles in service right now.</div>
        )}
      </div>
    </div>
  )
}
