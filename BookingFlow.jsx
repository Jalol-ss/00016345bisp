import { useApp } from '../../context/AppContext'
import { MapPin, Phone, Clock, Plus, Car, Users } from 'lucide-react'

export default function Branches() {
  const { branches, currentUser } = useApp()
  const myCompanyId = currentUser?.companyId || 'c1'
  const my = branches.filter(b=>b.companyId===myCompanyId)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Branches</h1>
          <p className="text-slate-500 text-sm">Locations, capacity, and performance per branch.</p>
        </div>
        <button className="btn-primary"><Plus className="w-4 h-4"/>Add branch</button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {my.map(b => (
          <div key={b.id} className="card p-5 hover:shadow-lg transition">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-bold text-slate-900">{b.name}</div>
                <div className="text-xs text-slate-500 flex items-center gap-1 mt-1"><MapPin className="w-3 h-3"/>{b.city}</div>
              </div>
              <div className="badge bg-emerald-100 text-emerald-700">Open</div>
            </div>
            <div className="mt-4 space-y-1.5 text-xs text-slate-500">
              <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5"/>{b.address}</div>
              <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5"/>{b.phone}</div>
              <div className="flex items-center gap-2"><Clock className="w-3.5 h-3.5"/>{b.hours}</div>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-100">
              <Stat icon={Car} label="Cars" value={b.cars}/>
              <Stat icon={Users} label="Staff" value={Math.round(b.cars/3)}/>
              <Stat icon={Car} label="Capacity" value={`${Math.round(b.cars/b.capacity*100)}%`}/>
            </div>
            <div className="mt-3">
              <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Utilization</div>
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-brand-600 rounded-full" style={{width: `${Math.round(b.cars/b.capacity*100)}%`}}/>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function Stat({ icon: Icon, label, value }) {
  return (
    <div className="text-center">
      <Icon className="w-4 h-4 text-brand-600 mx-auto"/>
      <div className="text-sm font-bold text-slate-900 mt-1">{value}</div>
      <div className="text-[10px] uppercase text-slate-400">{label}</div>
    </div>
  )
}
