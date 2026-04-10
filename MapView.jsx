import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import Modal from '../../components/Modal'
import Badge from '../../components/Badge'
import { Plus, Search, Wrench, Sparkles, Edit3, CheckCircle2 } from 'lucide-react'

const statuses = ['All','Available','Booked','In Use','In Maintenance','In Detailing','Out of Service']

export default function Fleet() {
  const {
    cars, branches, updateCarStatus, updateCar,
    addMaintenanceRecord, closeMaintenanceRecord, currentUser
  } = useApp()
  const [filter, setFilter] = useState('All')
  const [q, setQ] = useState('')

  // Modal state
  const [maintModal, setMaintModal]     = useState(null) // car
  const [detailModal, setDetailModal]   = useState(null) // car
  const [closeModal, setCloseModal]     = useState(null) // car (back to Available)
  const [editModal, setEditModal]       = useState(null) // car

  const [maintReason, setMaintReason]   = useState('')
  const [invoice, setInvoice]           = useState('')
  const [invoiceAmount, setInvoiceAmount] = useState('')

  const myCompanyId = currentUser?.companyId || 'c1'
  const myCars = cars.filter(c => c.companyId === myCompanyId)
  const filtered = myCars.filter(c =>
    (filter==='All' || c.status===filter) &&
    (!q || c.name.toLowerCase().includes(q.toLowerCase()) || c.plate.toLowerCase().includes(q.toLowerCase()))
  )

  const submitMaintenance = () => {
    if (!maintModal || !maintReason.trim()) return
    addMaintenanceRecord({
      carId: maintModal.id,
      companyId: myCompanyId,
      type: 'maintenance',
      issue: maintReason.trim()
    })
    updateCarStatus(maintModal.id, 'In Maintenance')
    setMaintModal(null)
    setMaintReason('')
  }

  const submitDetailing = () => {
    if (!detailModal) return
    addMaintenanceRecord({
      carId: detailModal.id,
      companyId: myCompanyId,
      type: 'detailing',
      issue: 'Routine detailing'
    })
    updateCarStatus(detailModal.id, 'In Detailing')
    setDetailModal(null)
  }

  const submitClose = () => {
    if (!closeModal || !invoice.trim()) return
    closeMaintenanceRecord(closeModal.id, {
      invoice: invoice.trim(),
      amount: invoiceAmount ? Number(invoiceAmount) : 0
    })
    updateCarStatus(closeModal.id, 'Available')
    setCloseModal(null)
    setInvoice('')
    setInvoiceAmount('')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Fleet management</h1>
          <p className="text-slate-500 text-sm">Manage all your vehicles, statuses, and condition.</p>
        </div>
        <button className="btn-primary"><Plus className="w-4 h-4"/>Add car</button>
      </div>

      <div className="card p-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400"/>
          <input value={q} onChange={e=>setQ(e.target.value)} className="input pl-9" placeholder="Search by model or plate…"/>
        </div>
        <div className="flex flex-wrap gap-2">
          {statuses.map(s => (
            <button key={s} onClick={()=>setFilter(s)} className={`text-xs px-3 py-1.5 rounded-full border transition ${
              filter===s?'bg-brand-600 text-white border-brand-600':'border-slate-200 text-slate-600 hover:border-brand-400'
            }`}>{s}</button>
          ))}
        </div>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm min-w-[900px]">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="text-left p-4">Car</th><th className="text-left p-4">Plate</th><th className="text-left p-4">Branch</th>
              <th className="text-left p-4">Mileage</th><th className="text-left p-4">Daily price</th><th className="text-left p-4">Status</th><th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(c => {
              const branch = branches.find(b => b.id === c.branchId)
              const isOut = c.status === 'In Maintenance' || c.status === 'In Detailing' || c.status === 'Out of Service'
              return (
                <tr key={c.id} className="border-t border-slate-100 hover:bg-slate-50">
                  <td className="p-4 flex items-center gap-3">
                    <img src={c.image} className="w-14 h-10 rounded-lg object-cover"/>
                    <div>
                      <div className="font-semibold text-slate-900">{c.name}</div>
                      <div className="text-xs text-slate-400">{c.type} · {c.transmission}</div>
                    </div>
                  </td>
                  <td className="p-4 font-mono text-xs">{c.plate}</td>
                  <td className="p-4 text-slate-600">{branch?.name || '—'}<div className="text-[10px] text-slate-400">{branch?.city}</div></td>
                  <td className="p-4">{c.mileage.toLocaleString()} km</td>
                  <td className="p-4 font-semibold">${c.price}</td>
                  <td className="p-4"><Badge>{c.status}</Badge></td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      <button title="Send to maintenance"
                        onClick={()=>{setMaintModal(c); setMaintReason('')}}
                        className="w-8 h-8 grid place-items-center rounded-lg hover:bg-amber-100 text-amber-600"
                      ><Wrench className="w-4 h-4"/></button>
                      <button title="Send to detailing"
                        onClick={()=>setDetailModal(c)}
                        className="w-8 h-8 grid place-items-center rounded-lg hover:bg-purple-100 text-purple-600"
                      ><Sparkles className="w-4 h-4"/></button>
                      {isOut && (
                        <button title="Mark available (requires invoice)"
                          onClick={()=>{setCloseModal(c); setInvoice(''); setInvoiceAmount('')}}
                          className="w-8 h-8 grid place-items-center rounded-lg hover:bg-emerald-100 text-emerald-600"
                        ><CheckCircle2 className="w-4 h-4"/></button>
                      )}
                      <button title="Edit car details"
                        onClick={()=>setEditModal(c)}
                        className="w-8 h-8 grid place-items-center rounded-lg hover:bg-slate-100 text-slate-600"
                      ><Edit3 className="w-4 h-4"/></button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* --- Maintenance modal --- */}
      {maintModal && (
        <Modal open={true} onClose={()=>setMaintModal(null)} title={`Send ${maintModal.name} to maintenance`}
          footer={
            <>
              <button onClick={()=>setMaintModal(null)} className="btn-secondary text-xs">Cancel</button>
              <button disabled={!maintReason.trim()} onClick={submitMaintenance} className="btn-primary text-xs disabled:opacity-40">Confirm</button>
            </>
          }
        >
          <div className="space-y-3 text-sm">
            <p className="text-xs text-slate-500">The car will be marked as In Maintenance and will not be bookable until you mark it available.</p>
            <div>
              <div className="label">Issue description</div>
              <textarea rows={4} className="input" value={maintReason} onChange={e=>setMaintReason(e.target.value)} placeholder="e.g. Brake pads worn, needs replacement"/>
            </div>
          </div>
        </Modal>
      )}

      {/* --- Detailing modal (no reason required) --- */}
      {detailModal && (
        <Modal open={true} onClose={()=>setDetailModal(null)} title={`Send ${detailModal.name} to detailing`}
          footer={
            <>
              <button onClick={()=>setDetailModal(null)} className="btn-secondary text-xs">Cancel</button>
              <button onClick={submitDetailing} className="btn-primary text-xs">Confirm</button>
            </>
          }
        >
          <p className="text-sm text-slate-600">The car will be marked as <b>In Detailing</b> and won't be bookable until you mark it available again.</p>
        </Modal>
      )}

      {/* --- Close / back-to-available modal --- */}
      {closeModal && (
        <Modal open={true} onClose={()=>setCloseModal(null)} title={`Return ${closeModal.name} to service`}
          footer={
            <>
              <button onClick={()=>setCloseModal(null)} className="btn-secondary text-xs">Cancel</button>
              <button disabled={!invoice.trim()} onClick={submitClose} className="btn-primary text-xs disabled:opacity-40">Mark available</button>
            </>
          }
        >
          <div className="space-y-3 text-sm">
            <p className="text-xs text-slate-500">Provide the invoice / receipt reference so the cost can be tracked against this vehicle.</p>
            <div>
              <div className="label">Invoice / receipt number</div>
              <input className="input" value={invoice} onChange={e=>setInvoice(e.target.value)} placeholder="e.g. INV-2026-0412"/>
            </div>
            <div>
              <div className="label">Amount (USD, optional)</div>
              <input type="number" className="input" value={invoiceAmount} onChange={e=>setInvoiceAmount(e.target.value)} placeholder="e.g. 240"/>
            </div>
          </div>
        </Modal>
      )}

      {/* --- Edit car modal --- */}
      {editModal && (
        <EditCarModal
          car={editModal}
          branches={branches.filter(b => b.companyId === myCompanyId)}
          onClose={()=>setEditModal(null)}
          onSave={(patch)=>{ updateCar(editModal.id, patch); setEditModal(null) }}
        />
      )}
    </div>
  )
}

function EditCarModal({ car, branches, onClose, onSave }) {
  const [form, setForm] = useState({
    name: car.name,
    plate: car.plate,
    price: car.price,
    mileage: car.mileage,
    branchId: car.branchId,
    seats: car.seats,
    type: car.type
  })
  const submit = (e) => {
    e.preventDefault()
    onSave({
      ...form,
      price: Number(form.price),
      mileage: Number(form.mileage),
      seats: Number(form.seats)
    })
  }
  return (
    <Modal open={true} onClose={onClose} title={`Edit ${car.name}`}
      footer={
        <>
          <button onClick={onClose} className="btn-secondary text-xs">Cancel</button>
          <button form="edit-car-form" type="submit" className="btn-primary text-xs">Save changes</button>
        </>
      }
    >
      <form id="edit-car-form" onSubmit={submit} className="space-y-3 text-sm">
        <div className="grid sm:grid-cols-2 gap-3">
          <div><div className="label">Name</div><input className="input" value={form.name} onChange={e=>setForm({...form, name: e.target.value})}/></div>
          <div><div className="label">Plate</div><input className="input" value={form.plate} onChange={e=>setForm({...form, plate: e.target.value})}/></div>
          <div><div className="label">Daily price (USD)</div><input type="number" className="input" value={form.price} onChange={e=>setForm({...form, price: e.target.value})}/></div>
          <div><div className="label">Mileage (km)</div><input type="number" className="input" value={form.mileage} onChange={e=>setForm({...form, mileage: e.target.value})}/></div>
          <div><div className="label">Seats</div><input type="number" className="input" value={form.seats} onChange={e=>setForm({...form, seats: e.target.value})}/></div>
          <div><div className="label">Type</div><input className="input" value={form.type} onChange={e=>setForm({...form, type: e.target.value})}/></div>
        </div>
        <div>
          <div className="label">Branch</div>
          <select className="input" value={form.branchId} onChange={e=>setForm({...form, branchId: e.target.value})}>
            {branches.map(b => <option key={b.id} value={b.id}>{b.name}, {b.city}</option>)}
          </select>
        </div>
      </form>
    </Modal>
  )
}
