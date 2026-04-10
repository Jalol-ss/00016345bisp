import { useApp } from '../../context/AppContext'
import Badge from '../../components/Badge'
import { Ban, Eye } from 'lucide-react'

export default function AdminUsers() {
  const { users, bookings } = useApp()
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Users</h1>
        <p className="text-slate-500 text-sm">Manage all platform users.</p>
      </div>
      <div className="card overflow-x-auto">
        <table className="w-full text-sm min-w-[700px]">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr><th className="text-left p-4">User</th><th className="text-left p-4">Email</th><th className="text-left p-4">City</th><th className="text-left p-4">Joined</th><th className="text-left p-4">Bookings</th><th className="text-left p-4">Verified</th><th className="p-4"></th></tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} className="border-t border-slate-100 hover:bg-slate-50">
                <td className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-700 grid place-items-center font-bold">{u.name.split(' ').map(n=>n[0]).join('')}</div>
                  <div className="font-semibold">{u.name}</div>
                </td>
                <td className="p-4 text-slate-500">{u.email}</td>
                <td className="p-4">{u.city}</td>
                <td className="p-4 text-slate-500 text-xs">{u.joined}</td>
                <td className="p-4 font-semibold">{bookings.filter(b=>b.userId===u.id).length}</td>
                <td className="p-4"><Badge>{u.verified?'Approved':'Pending'}</Badge></td>
                <td className="p-4">
                  <div className="flex items-center gap-1">
                    <button className="w-8 h-8 grid place-items-center rounded-lg hover:bg-slate-100"><Eye className="w-4 h-4 text-slate-500"/></button>
                    <button className="w-8 h-8 grid place-items-center rounded-lg hover:bg-red-100 text-red-600"><Ban className="w-4 h-4"/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
