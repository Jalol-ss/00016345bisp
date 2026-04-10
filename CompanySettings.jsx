import { useApp } from '../../context/AppContext'
import Badge from '../../components/Badge'
import { useState } from 'react'

export default function AdminFleet() {
  const { cars, companies, branches } = useApp()
  const [company, setCompany] = useState('')
  const filtered = company ? cars.filter(c=>c.companyId===company) : cars
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Fleet oversight</h1>
        <p className="text-slate-500 text-sm">All cars across all rental companies.</p>
      </div>
      <div className="card p-4 flex items-center gap-3">
        <select value={company} onChange={e=>setCompany(e.target.value)} className="input w-auto">
          <option value="">All companies</option>
          {companies.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>
      <div className="card overflow-x-auto">
        <table className="w-full text-sm min-w-[800px]">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr><th className="text-left p-4">Car</th><th className="text-left p-4">Company</th><th className="text-left p-4">Branch</th><th className="text-left p-4">Plate</th><th className="text-left p-4">Price</th><th className="text-left p-4">Status</th></tr>
          </thead>
          <tbody>
            {filtered.map(c => (
              <tr key={c.id} className="border-t border-slate-100">
                <td className="p-4 flex items-center gap-3"><img src={c.image} className="w-12 h-9 rounded-md object-cover"/><span className="font-semibold">{c.name}</span></td>
                <td className="p-4">{companies.find(co=>co.id===c.companyId)?.name}</td>
                <td className="p-4 text-slate-500">{branches.find(b=>b.id===c.branchId)?.name}</td>
                <td className="p-4 font-mono text-xs">{c.plate}</td>
                <td className="p-4 font-semibold">${c.price}</td>
                <td className="p-4"><Badge>{c.status}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
