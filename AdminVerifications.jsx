import { useApp } from '../../context/AppContext'
import Badge from '../../components/Badge'

export default function AdminBookings() {
  const { bookings, cars, companies, users } = useApp()
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">All bookings</h1>
        <p className="text-slate-500 text-sm">Monitor every booking across the platform.</p>
      </div>
      <div className="card overflow-x-auto">
        <table className="w-full text-sm min-w-[900px]">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr><th className="text-left p-4">ID</th><th className="text-left p-4">User</th><th className="text-left p-4">Company</th><th className="text-left p-4">Car</th><th className="text-left p-4">Dates</th><th className="text-left p-4">Total</th><th className="text-left p-4">Status</th></tr>
          </thead>
          <tbody>
            {bookings.map(b => (
              <tr key={b.id} className="border-t border-slate-100 hover:bg-slate-50">
                <td className="p-4 font-mono text-xs">{b.id}</td>
                <td className="p-4 font-semibold">{users.find(u=>u.id===b.userId)?.name}</td>
                <td className="p-4">{companies.find(c=>c.id===b.companyId)?.name}</td>
                <td className="p-4">{cars.find(c=>c.id===b.carId)?.name}</td>
                <td className="p-4 text-slate-500 text-xs">{b.pickupDate} → {b.returnDate}</td>
                <td className="p-4 font-semibold">${b.total}</td>
                <td className="p-4"><Badge>{b.status}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
