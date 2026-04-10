import { Link } from 'react-router-dom'
import { Star, Users, Fuel, Settings2, Briefcase, Heart, Building2, MapPin } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function CarCard({ car }) {
  const { favorites, toggleFavorite, companies, branches, formatPrice } = useApp()
  const company = companies.find(c => c.id === car.companyId)
  const branch = branches.find(b => b.id === car.branchId)
  const fav = favorites.includes(car.id)

  return (
    <div className="card overflow-hidden group hover:shadow-lg hover:-translate-y-1 transition-all duration-300 fade-in">
      <div className="relative">
        <img src={car.image} alt={car.name} className="w-full h-44 object-cover bg-slate-100" loading="lazy"/>
        <button onClick={()=>toggleFavorite(car.id)} className="absolute top-3 right-3 w-9 h-9 grid place-items-center rounded-full bg-white/90 backdrop-blur shadow-sm hover:scale-110 transition">
          <Heart className={`w-4 h-4 ${fav ? 'fill-red-500 text-red-500' : 'text-slate-500'}`}/>
        </button>
        <div className="absolute bottom-3 left-3 badge bg-white/95 text-slate-700 shadow-sm">
          {car.type}
        </div>
        {car.status !== 'Available' && (
          <div className="absolute top-3 left-3 badge bg-amber-100 text-amber-800">{car.status}</div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-bold text-slate-900 leading-tight">{car.name}</h3>
            <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
              <Building2 className="w-3 h-3"/>{company?.name}
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm font-semibold text-amber-500">
            <Star className="w-4 h-4 fill-amber-400"/>{car.rating}
          </div>
        </div>

        <div className="text-xs text-slate-500 flex items-center gap-1 mt-1">
          <MapPin className="w-3 h-3"/>{branch?.name}, {branch?.city}
        </div>

        <div className="grid grid-cols-4 gap-2 mt-4 text-xs text-slate-500">
          <div className="flex flex-col items-center gap-1"><Users className="w-4 h-4"/>{car.seats} seats</div>
          <div className="flex flex-col items-center gap-1"><Fuel className="w-4 h-4"/>{car.fuel}</div>
          <div className="flex flex-col items-center gap-1"><Settings2 className="w-4 h-4"/>{car.transmission.slice(0,4)}</div>
          <div className="flex flex-col items-center gap-1"><Briefcase className="w-4 h-4"/>{car.luggage} bags</div>
        </div>

        <div className="flex items-end justify-between mt-4 pt-4 border-t border-slate-100">
          <div>
            <div className="text-xl font-extrabold text-slate-900">{formatPrice(car.price)}<span className="text-xs text-slate-400 font-medium">/day</span></div>
          </div>
          <Link to={`/car/${car.id}`} className="btn-primary text-xs">Book Now</Link>
        </div>
      </div>
    </div>
  )
}
