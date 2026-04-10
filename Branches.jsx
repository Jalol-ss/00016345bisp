import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import Modal from '../../components/Modal'
import Badge from '../../components/Badge'
import { Star, BadgeCheck, Ban, RotateCcw, Eye, Building2, Mail, Users, CalendarDays } from 'lucide-react'
import { DEMO_ACCOUNTS } from '../../context/AppContext'

export default function AdminCompanies() {
  const {
    companies, cars, bookings, branches,
    suspendCompany, unsuspendCompany, formatPrice
  } = useApp()
  const [viewing, setViewing] = useState(null)
  const [suspending, setSuspending] = useState(null)
  const [reason, setReason] = useState('')

  const emailFor = (companyId) =>
    DEMO_ACCOUNTS.find(a => a.companyId === companyId)?.email || '—'

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Companies</h1>
        <p className="text-slate-500 text-sm">All rental partners on the platform.</p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {companies.map(c => {
          const isSuspended = c.status === 'suspended'
          return (
            <div key={c.id} className="card p-5">
              <div className="flex items-start gap-3">
                <div className="w-14 h-14 rounded-2xl bg-brand-50 grid place-items-center text-2xl">{c.logo}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-slate-900">{c.name}</h3>
                    {c.verified && <BadgeCheck className="w-4 h-4 text-brand-600"/>}
                    {isSuspended && <span className="badge bg-red-100 text-red-700 text-[10px]">Suspended</span>}
                  </div>
                  <div className="text-xs text-slate-500">{c.headquarters} · since {c.founded}</div>
                </div>
              </div>
              <p className="text-sm text-slate-500 mt-3 line-clamp-2">{c.description}</p>
              <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-100 text-center">
                <div><div className="font-bold text-slate-900">{c.fleetSize}</div><div className="text-[10px] uppercase text-slate-400">Cars</div></div>
                <div><div className="font-bold text-slate-900">{c.branches}</div><div className="text-[10px] uppercase text-slate-400">Branches</div></div>
                <div><div className="font-bold text-amber-500 flex items-center justify-center gap-1"><Star className="w-3 h-3 fill-amber-400"/>{c.rating}</div><div className="text-[10px] uppercase text-slate-400">Rating</div></div>
              </div>
              <div className="flex gap-2 mt-4">
                <button onClick={()=>setViewing(c)} className="btn-secondary text-xs flex-1"><Eye className="w-3.5 h-3.5"/>View</button>
                {isSuspended ? (
                  <button onClick={()=>unsuspendCompany(c.id)} className="btn text-xs flex-1 text-emerald-700 hover:bg-emerald-50"><RotateCcw className="w-3.5 h-3.5"/>Unsuspend</button>
                ) : (
                  <button onClick={()=>{setSuspending(c); setReason('')}} className="btn text-xs flex-1 text-red-600 hover:bg-red-50"><Ban className="w-3.5 h-3.5"/>Suspend</button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* --- VIEW MODAL ------------------------------------------------- */}
      {viewing && (() => {
        const myCars = cars.filter(x => x.companyId === viewing.id)
        const myBookings = bookings.filter(x => x.companyId === viewing.id)
        const myBranches = branches.filter(x => x.companyId === viewing.id)
        const earnings = myBookings.reduce((s, b) => s + (b.total || 0), 0)
        return (
          <Modal open={true} onClose={()=>setViewing(null)} title={`${viewing.name}`}
            footer={<button onClick={()=>setViewing(null)} className="btn-secondary text-xs">Close</button>}
          >
            <div className="space-y-4 text-sm">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-brand-50 grid place-items-center text-2xl">{viewing.logo}</div>
                <div>
                  <div className="font-bold text-slate-900">{viewing.name}</div>
                  <div className="text-xs text-slate-500 flex items-center gap-1"><Mail className="w-3 h-3"/>{emailFor(viewing.id)}</div>
                  <div className="text-xs text-slate-500">{viewing.headquarters} · since {viewing.founded}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Stat label="Fleet" value={myCars.length}/>
                <Stat label="Branches" value={myBranches.length}/>
                <Stat label="Bookings" value={myBookings.length}/>
                <Stat label="Earnings" value={formatPrice(earnings)}/>
              </div>

              <div>
                <div className="font-bold text-slate-900 mb-2">Status</div>
                <div className="flex items-center gap-2">
                  <Badge>{viewing.status === 'suspended' ? 'Suspended' : 'Active'}</Badge>
                  {viewing.verified && <span className="badge bg-emerald-100 text-emerald-700 text-[10px]">Verified</span>}
                </div>
                {viewing.status === 'suspended' && viewing.suspensionReason && (
                  <div className="mt-2 rounded-xl bg-red-50 border border-red-100 p-3 text-xs text-red-700">
                    <b>Reason:</b> {viewing.suspensionReason}
                  </div>
                )}
              </div>

              <div>
                <div className="font-bold text-slate-900 mb-2">Branches</div>
                {myBranches.length === 0 ? (
                  <p className="text-xs text-slate-400">No branches registered.</p>
                ) : (
                  <ul className="space-y-1 text-xs">
                    {myBranches.map(b => (
                      <li key={b.id} className="flex items-center gap-2">
                        <Building2 className="w-3 h-3 text-slate-400"/>
                        <span className="text-slate-700">{b.name}, {b.city}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div>
                <div className="font-bold text-slate-900 mb-2">Fleet ({myCars.length})</div>
                {myCars.length === 0 ? (
                  <p className="text-xs text-slate-400">No cars in fleet.</p>
                ) : (
                  <div className="max-h-36 overflow-y-auto border border-slate-100 rounded-xl divide-y divide-slate-100">
                    {myCars.map(car => (
                      <div key={car.id} className="p-2 flex items-center justify-between text-xs">
                        <span className="text-slate-700">{car.name}</span>
                        <span className="text-slate-400">{car.status}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Modal>
        )
      })()}

      {/* --- SUSPEND MODAL --------------------------------------------- */}
      {suspending && (
        <Modal open={true} onClose={()=>setSuspending(null)} title={`Suspend ${suspending.name}`}
          footer={
            <>
              <button onClick={()=>setSuspending(null)} className="btn-secondary text-xs">Cancel</button>
              <button
                disabled={!reason.trim()}
                onClick={()=>{
                  suspendCompany(suspending.id, reason.trim())
                  setSuspending(null)
                }}
                className="btn-primary text-xs disabled:opacity-40"
              ><Ban className="w-3.5 h-3.5"/>Confirm suspend</button>
            </>
          }
        >
          <div className="space-y-3 text-sm">
            <div className="rounded-xl bg-amber-50 border border-amber-100 p-3 text-xs text-amber-800">
              Suspending a company notifies them immediately with a <b>2-week grace period</b> to collect any outstanding cars related to cross-branch operations.
            </div>
            <div>
              <div className="label">Reason for suspension</div>
              <textarea
                rows={4}
                className="input"
                value={reason}
                onChange={e=>setReason(e.target.value)}
                placeholder="e.g. Repeated customer complaints about vehicle condition"
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-100 p-3">
      <div className="text-[10px] uppercase tracking-wider font-bold text-slate-400">{label}</div>
      <div className="text-sm font-extrabold text-slate-900 mt-0.5">{value}</div>
    </div>
  )
}
