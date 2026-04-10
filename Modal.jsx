const map = {
  Available: 'bg-emerald-100 text-emerald-700',
  Booked: 'bg-blue-100 text-blue-700',
  'In Use': 'bg-indigo-100 text-indigo-700',
  'In Maintenance': 'bg-amber-100 text-amber-800',
  'In Detailing': 'bg-purple-100 text-purple-700',
  'Out of Service': 'bg-red-100 text-red-700',
  Upcoming: 'bg-blue-100 text-blue-700',
  Active: 'bg-emerald-100 text-emerald-700',
  Completed: 'bg-slate-100 text-slate-700',
  Cancelled: 'bg-red-100 text-red-700',
  Pending: 'bg-amber-100 text-amber-800',
  Approved: 'bg-emerald-100 text-emerald-700',
  Rejected: 'bg-red-100 text-red-700'
}

export default function Badge({ children }) {
  const cls = map[children] || 'bg-slate-100 text-slate-700'
  return <span className={`badge ${cls}`}>{children}</span>
}
