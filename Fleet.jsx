import Badge from '../../components/Badge'

const tickets = [
  { id:'#T-1042', user:'Aziza K.', subject:'Refund request for BK10231', status:'Pending', time:'2h ago' },
  { id:'#T-1041', user:'Bekzod E.', subject:'Damage dispute', status:'Active', time:'5h ago' },
  { id:'#T-1040', user:'Jasur R.', subject:'Cannot upload document', status:'Completed', time:'1d ago' },
  { id:'#T-1039', user:'Dilnoza Y.', subject:'Wrong pickup branch', status:'Approved', time:'2d ago' }
]

export default function AdminSupport() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Support center</h1>
        <p className="text-slate-500 text-sm">Customer complaints, disputes and ticket resolution.</p>
      </div>
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr><th className="text-left p-4">Ticket</th><th className="text-left p-4">User</th><th className="text-left p-4">Subject</th><th className="text-left p-4">Status</th><th className="text-left p-4">Time</th></tr>
          </thead>
          <tbody>
            {tickets.map(t => (
              <tr key={t.id} className="border-t border-slate-100 hover:bg-slate-50">
                <td className="p-4 font-mono text-xs">{t.id}</td>
                <td className="p-4 font-semibold">{t.user}</td>
                <td className="p-4">{t.subject}</td>
                <td className="p-4"><Badge>{t.status}</Badge></td>
                <td className="p-4 text-slate-500 text-xs">{t.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
