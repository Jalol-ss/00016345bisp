import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import Modal from '../../components/Modal'
import Badge from '../../components/Badge'
import { Edit3, Send, Eye } from 'lucide-react'

const tabs = ['All','Upcoming','Active','Completed','Cancelled']

export default function CompanyBookings() {
  const {
    bookings, cars, branches, users, currentUser, formatPrice,
    companyModifyBooking, sendAlternativeOffer
  } = useApp()
  const [tab, setTab] = useState('All')
  const [detail, setDetail] = useState(null)
  const [modify, setModify] = useState(null)
  const [offer, setOffer] = useState(null)

  const myCompanyId = currentUser?.companyId || 'c1'
  const my = bookings.filter(b => b.companyId === myCompanyId)
  const filtered = tab === 'All' ? my : my.filter(b => b.status === tab)

  const customerName = (b) => {
    const u = users.find(u => u.id === b.userId)
    return u?.name || b.userName || '—'
  }
  const customerEmail = (b) => users.find(u => u.id === b.userId)?.email || ''

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Bookings</h1>
        <p className="text-slate-500 text-sm">All your company bookings in one place. Click a row for details.</p>
      </div>
      <div className="card p-2 inline-flex flex-wrap gap-1">
        {tabs.map(t => (
          <button key={t} onClick={()=>setTab(t)} className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
            tab===t ? 'bg-brand-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}>{t}</button>
        ))}
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm min-w-[900px]">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="text-left p-4">Booking</th>
              <th className="text-left p-4">Customer</th>
              <th className="text-left p-4">Car</th>
              <th className="text-left p-4">Pickup → Drop-off</th>
              <th className="text-left p-4">Dates</th>
              <th className="text-left p-4">Total</th>
              <th className="text-left p-4">Status</th>
              <th className="text-left p-4"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(b => {
              const car = cars.find(c => c.id === b.carId)
              const p = branches.find(x => x.id === b.pickupBranchId)
              const d = branches.find(x => x.id === b.dropoffBranchId)
              return (
                <tr key={b.id} className="border-t border-slate-100 hover:bg-slate-50 cursor-pointer" onClick={()=>setDetail(b)}>
                  <td className="p-4 font-mono text-xs">{b.id}</td>
                  <td className="p-4 font-semibold">{customerName(b)}</td>
                  <td className="p-4">{car?.name}</td>
                  <td className="p-4 text-slate-500 text-xs">{p?.name} → {d?.name}</td>
                  <td className="p-4 text-slate-500 text-xs">{b.pickupDate} → {b.returnDate}</td>
                  <td className="p-4 font-semibold">{formatPrice(b.total)}</td>
                  <td className="p-4"><Badge>{b.status}</Badge></td>
                  <td className="p-4">
                    <div className="flex items-center gap-1" onClick={e=>e.stopPropagation()}>
                      <button title="View details" onClick={()=>setDetail(b)} className="w-8 h-8 grid place-items-center rounded-lg hover:bg-slate-100 text-slate-600"><Eye className="w-4 h-4"/></button>
                      <button title="Modify booking" onClick={()=>setModify(b)} className="w-8 h-8 grid place-items-center rounded-lg hover:bg-amber-100 text-amber-600"><Edit3 className="w-4 h-4"/></button>
                      <button title="Send alternative offer" onClick={()=>setOffer(b)} className="w-8 h-8 grid place-items-center rounded-lg hover:bg-brand-50 text-brand-600"><Send className="w-4 h-4"/></button>
                    </div>
                  </td>
                </tr>
              )
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={8} className="p-10 text-center text-slate-400">No bookings in this tab.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* --- Detail modal --- */}
      {detail && (() => {
        const car = cars.find(c => c.id === detail.carId)
        const p = branches.find(x => x.id === detail.pickupBranchId)
        const d = branches.find(x => x.id === detail.dropoffBranchId)
        return (
          <Modal open={true} onClose={()=>setDetail(null)} title={`Booking ${detail.id}`}
            footer={
              <>
                <button onClick={()=>setDetail(null)} className="btn-secondary text-xs">Close</button>
                <button onClick={()=>{setModify(detail); setDetail(null)}} className="btn-secondary text-xs"><Edit3 className="w-3.5 h-3.5"/>Modify</button>
                <button onClick={()=>{setOffer(detail); setDetail(null)}} className="btn-primary text-xs"><Send className="w-3.5 h-3.5"/>Send offer</button>
              </>
            }
          >
            <div className="space-y-3 text-sm">
              <Row label="Customer" value={customerName(detail)}/>
              <Row label="Email" value={customerEmail(detail)}/>
              <div className="h-px bg-slate-100"/>
              <Row label="Car" value={car?.name}/>
              <Row label="Plate" value={car?.plate}/>
              <Row label="Pickup" value={`${p?.name || ''} (${p?.city || ''})`}/>
              <Row label="Drop-off" value={`${d?.name || ''} (${d?.city || ''})`}/>
              <Row label="Pickup date" value={detail.pickupDate}/>
              <Row label="Return date" value={detail.returnDate}/>
              <div className="h-px bg-slate-100"/>
              <Row label="Status" value={detail.status}/>
              <Row label="Add-ons" value={(detail.addons || []).join(', ') || 'None'}/>
              <Row label="Insurance" value={detail.insurance || 'Basic'}/>
              <Row label="Total" value={formatPrice(detail.total)} bold/>
              {detail.alternativeOffer && (
                <div className="rounded-xl bg-amber-50 border border-amber-100 p-3 text-xs">
                  <b>Pending alternative offer:</b> {detail.alternativeOffer.message}
                </div>
              )}
            </div>
          </Modal>
        )
      })()}

      {/* --- Modify modal (company side) --- */}
      {modify && (
        <CompanyModifyModal
          booking={modify}
          cars={cars.filter(c => c.companyId === myCompanyId)}
          branches={branches.filter(b => b.companyId === myCompanyId)}
          onClose={()=>setModify(null)}
          onSave={(patch, note)=>{ companyModifyBooking(modify.id, patch, note); setModify(null) }}
        />
      )}

      {/* --- Offer modal --- */}
      {offer && (
        <OfferModal
          booking={offer}
          cars={cars.filter(c => c.companyId === myCompanyId)}
          onClose={()=>setOffer(null)}
          onSend={(o)=>{ sendAlternativeOffer(offer.id, o); setOffer(null) }}
        />
      )}
    </div>
  )
}

function Row({ label, value, bold }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="text-xs uppercase text-slate-400 tracking-wide">{label}</span>
      <span className={`text-sm ${bold ? 'font-extrabold text-slate-900' : 'text-slate-800'}`}>{value || '—'}</span>
    </div>
  )
}

function CompanyModifyModal({ booking, cars, branches, onClose, onSave }) {
  const [form, setForm] = useState({
    pickupDate: booking.pickupDate,
    returnDate: booking.returnDate,
    pickupBranchId: booking.pickupBranchId,
    dropoffBranchId: booking.dropoffBranchId,
    carId: booking.carId,
    status: booking.status
  })
  const [note, setNote] = useState('')
  const submit = (e) => { e.preventDefault(); onSave(form, note) }

  return (
    <Modal open={true} onClose={onClose} title={`Modify booking ${booking.id}`}
      footer={
        <>
          <button onClick={onClose} className="btn-secondary text-xs">Cancel</button>
          <button form="cmp-modify-form" type="submit" className="btn-primary text-xs">Save & notify customer</button>
        </>
      }
    >
      <form id="cmp-modify-form" onSubmit={submit} className="space-y-3 text-sm">
        <div className="grid sm:grid-cols-2 gap-3">
          <div><div className="label">Pickup date</div><input type="date" className="input" value={form.pickupDate} onChange={e=>setForm({...form, pickupDate: e.target.value})}/></div>
          <div><div className="label">Return date</div><input type="date" className="input" value={form.returnDate} onChange={e=>setForm({...form, returnDate: e.target.value})}/></div>
        </div>
        <div>
          <div className="label">Pickup branch</div>
          <select className="input" value={form.pickupBranchId} onChange={e=>setForm({...form, pickupBranchId: e.target.value})}>
            {branches.map(b => <option key={b.id} value={b.id}>{b.name}, {b.city}</option>)}
          </select>
        </div>
        <div>
          <div className="label">Drop-off branch</div>
          <select className="input" value={form.dropoffBranchId} onChange={e=>setForm({...form, dropoffBranchId: e.target.value})}>
            {branches.map(b => <option key={b.id} value={b.id}>{b.name}, {b.city}</option>)}
          </select>
        </div>
        <div>
          <div className="label">Car</div>
          <select className="input" value={form.carId} onChange={e=>setForm({...form, carId: e.target.value})}>
            {cars.map(c => <option key={c.id} value={c.id}>{c.name} — ${c.price}/day</option>)}
          </select>
        </div>
        <div>
          <div className="label">Status</div>
          <select className="input" value={form.status} onChange={e=>setForm({...form, status: e.target.value})}>
            {['Upcoming','Active','Completed','Cancelled'].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <div className="label">Note to customer (optional)</div>
          <textarea rows={3} className="input" value={note} onChange={e=>setNote(e.target.value)} placeholder="Explain what changed and why…"/>
        </div>
      </form>
    </Modal>
  )
}

function OfferModal({ booking, cars, onClose, onSend }) {
  const [form, setForm] = useState({
    carId: booking.carId,
    reason: '',
    price: booking.total,
    message: ''
  })
  const submit = (e) => {
    e.preventDefault()
    onSend({
      carId: form.carId,
      proposedPrice: Number(form.price),
      reason: form.reason.trim(),
      message: form.message.trim() || form.reason.trim()
    })
  }
  return (
    <Modal open={true} onClose={onClose} title={`Send alternative offer — ${booking.id}`}
      footer={
        <>
          <button onClick={onClose} className="btn-secondary text-xs">Cancel</button>
          <button form="offer-form" type="submit" className="btn-primary text-xs"><Send className="w-3.5 h-3.5"/>Send offer</button>
        </>
      }
    >
      <form id="offer-form" onSubmit={submit} className="space-y-3 text-sm">
        <p className="text-xs text-slate-500">Propose an alternative car or price. The customer will be notified and can accept or reject.</p>
        <div>
          <div className="label">Suggested car</div>
          <select className="input" value={form.carId} onChange={e=>setForm({...form, carId: e.target.value})}>
            {cars.map(c => <option key={c.id} value={c.id}>{c.name} — ${c.price}/day</option>)}
          </select>
        </div>
        <div>
          <div className="label">Reason</div>
          <input className="input" value={form.reason} onChange={e=>setForm({...form, reason: e.target.value})} placeholder="e.g. Original car unexpectedly in maintenance"/>
        </div>
        <div>
          <div className="label">Revised total (USD)</div>
          <input type="number" className="input" value={form.price} onChange={e=>setForm({...form, price: e.target.value})}/>
        </div>
        <div>
          <div className="label">Message to customer</div>
          <textarea rows={3} className="input" value={form.message} onChange={e=>setForm({...form, message: e.target.value})} placeholder="Leave a personal note for the customer…"/>
        </div>
      </form>
    </Modal>
  )
}
