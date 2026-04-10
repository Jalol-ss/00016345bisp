import { useApp } from '../../context/AppContext'
import Badge from '../../components/Badge'
import { Star, Users as UsersIcon } from 'lucide-react'

export default function Customers() {
  const { users, bookings, currentUser, formatPrice } = useApp()
  const myCompanyId = currentUser?.companyId || 'c1'
  const myBookings = bookings.filter(b => b.companyId === myCompanyId)
  const customerIds = [...new Set(myBookings.map(b => b.userId))]
  const myCustomers = users.filter(u => customerIds.includes(u.id))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Customers</h1>
        <p className="text-slate-500 text-sm">Customers who have rented from your company.</p>
      </div>
      <div className="card overflow-x-auto">
        {myCustomers.length ? (
          <table className="w-full text-sm min-w-[800px]">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="text-left p-4">Customer</th>
                <th className="text-left p-4">Email</th>
                <th className="text-left p-4">City</th>
                <th className="text-left p-4">Rentals</th>
                <th className="text-left p-4">Total spent</th>
                <th className="text-left p-4">Verified</th>
                <th className="text-left p-4">Rating</th>
              </tr>
            </thead>
            <tbody>
              {myCustomers.map(u => {
                const userBookings = myBookings.filter(b => b.userId === u.id)
                const spent = userBookings.reduce((s, b) => s + (b.total || 0), 0)
                return (
                  <tr key={u.id} className="border-t border-slate-100 hover:bg-slate-50">
                    <td className="p-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-700 grid place-items-center font-bold">{u.name.split(' ').map(n=>n[0]).join('')}</div>
                      <div className="font-semibold">{u.name}</div>
                    </td>
                    <td className="p-4 text-slate-500">{u.email}</td>
                    <td className="p-4">{u.city}</td>
                    <td className="p-4 font-semibold">{userBookings.length}</td>
                    <td className="p-4 font-semibold">{formatPrice(spent)}</td>
                    <td className="p-4"><Badge>{u.verified?'Approved':'Pending'}</Badge></td>
                    <td className="p-4 flex items-center gap-1 text-amber-500"><Star className="w-4 h-4 fill-amber-400"/>{(4 + (u.id.length % 10)/10).toFixed(1)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        ) : (
          <div className="p-14 text-center">
            <div className="w-16 h-16 rounded-2xl bg-brand-50 text-brand-600 grid place-items-center mx-auto"><UsersIcon className="w-8 h-8"/></div>
            <h3 className="text-lg font-extrabold text-slate-900 mt-4">No customers yet</h3>
            <p className="text-sm text-slate-500 mt-1">Customers who book your cars will appear here.</p>
          </div>
        )}
      </div>
    </div>
  )
}
