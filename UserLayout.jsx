import { MapPin, Calendar, Search, ArrowRightLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

const cities = ['Tashkent', 'Samarkand', 'Bukhara', 'Andijan', 'Namangan', 'Fergana']

export default function SearchForm({ compact=false }) {
  const navigate = useNavigate()
  const { searchQuery, setSearchQuery } = useApp()

  const update = (k, v) => setSearchQuery({ ...searchQuery, [k]: v })

  const submit = (e) => {
    e.preventDefault()
    navigate('/find-cars')
  }

  return (
    <form onSubmit={submit} className={`card p-4 md:p-5 grid gap-3 ${compact ? '' : 'shadow-card'}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <input type="checkbox" id="diff" checked={searchQuery.differentDropoff} onChange={e=>update('differentDropoff', e.target.checked)} className="accent-brand-600"/>
          <label htmlFor="diff" className="cursor-pointer">Drop off at a different branch</label>
        </div>
        <div className="hidden md:flex items-center gap-1 text-xs text-brand-700 font-semibold">
          <ArrowRightLeft className="w-3.5 h-3.5"/> Cross-branch supported
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        <div className="md:col-span-1">
          <label className="label">Pickup</label>
          <div className="relative">
            <MapPin className="w-4 h-4 absolute left-3 top-3.5 text-slate-400"/>
            <select value={searchQuery.pickupCity} onChange={e=>update('pickupCity', e.target.value)} className="input pl-9 appearance-none">
              {cities.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div className="md:col-span-1">
          <label className="label">Drop-off</label>
          <div className="relative">
            <MapPin className="w-4 h-4 absolute left-3 top-3.5 text-slate-400"/>
            <select disabled={!searchQuery.differentDropoff} value={searchQuery.dropoffCity} onChange={e=>update('dropoffCity', e.target.value)} className="input pl-9 appearance-none disabled:bg-slate-50 disabled:text-slate-400">
              {cities.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div className="md:col-span-1">
          <label className="label">Pickup date</label>
          <div className="relative">
            <Calendar className="w-4 h-4 absolute left-3 top-3.5 text-slate-400"/>
            <input type="date" value={searchQuery.pickupDate} onChange={e=>update('pickupDate', e.target.value)} className="input pl-9"/>
          </div>
        </div>
        <div className="md:col-span-1">
          <label className="label">Return date</label>
          <div className="relative">
            <Calendar className="w-4 h-4 absolute left-3 top-3.5 text-slate-400"/>
            <input type="date" value={searchQuery.returnDate} onChange={e=>update('returnDate', e.target.value)} className="input pl-9"/>
          </div>
        </div>
        <div className="md:col-span-1 flex items-end">
          <button className="btn-primary w-full h-[46px]"><Search className="w-4 h-4"/>Find Cars</button>
        </div>
      </div>
    </form>
  )
}
