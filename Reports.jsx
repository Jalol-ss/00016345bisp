import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import Modal from '../../components/Modal'
import Badge from '../../components/Badge'
import { Check, X, RefreshCw, FileText } from 'lucide-react'

export default function AdminVerifications() {
  const { verifications, reviewVerification } = useApp()
  const [modal, setModal] = useState(null) // { verification, action }
  const [reason, setReason] = useState('')

  const openModal = (v, action) => { setModal({ verification: v, action }); setReason('') }
  const confirm = () => {
    if (!modal) return
    if ((modal.action === 'reject' || modal.action === 'resubmit') && !reason.trim()) return
    reviewVerification(modal.verification.id, modal.action, reason.trim())
    setModal(null)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Identity verifications</h1>
        <p className="text-slate-500 text-sm">Review submitted documents and approve/reject.</p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {verifications.map(v => (
          <div key={v.id} className="card p-5">
            <div className="flex items-center justify-between">
              <div className="font-bold text-slate-900">{v.name}</div>
              <Badge>{v.status}</Badge>
            </div>
            <div className="text-xs text-slate-500 mt-1">Submitted {v.submitted}</div>
            <div className="bg-slate-50 rounded-xl p-3 mt-3 text-sm space-y-1">
              <div className="flex items-center gap-2"><FileText className="w-4 h-4 text-brand-600"/>{v.docType}</div>
              <div className="text-xs text-slate-500 font-mono">{v.docNumber}</div>
            </div>
            {v.reason && (
              <div className="mt-2 text-xs text-slate-500 italic line-clamp-2">"{v.reason}"</div>
            )}
            <div className="mt-3 h-32 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl grid place-items-center text-xs text-slate-400">Document preview</div>
            <div className="grid grid-cols-3 gap-2 mt-3">
              <button onClick={()=>reviewVerification(v.id, 'approve')} className="btn text-xs bg-emerald-50 text-emerald-700 hover:bg-emerald-100"><Check className="w-3.5 h-3.5"/>Approve</button>
              <button onClick={()=>openModal(v, 'resubmit')} className="btn text-xs bg-amber-50 text-amber-700 hover:bg-amber-100"><RefreshCw className="w-3.5 h-3.5"/>Resubmit</button>
              <button onClick={()=>openModal(v, 'reject')} className="btn text-xs bg-red-50 text-red-700 hover:bg-red-100"><X className="w-3.5 h-3.5"/>Reject</button>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <Modal open={true} onClose={()=>setModal(null)}
          title={modal.action === 'reject' ? 'Reject verification' : 'Request resubmission'}
          footer={
            <>
              <button onClick={()=>setModal(null)} className="btn-secondary text-xs">Cancel</button>
              <button
                disabled={!reason.trim()}
                onClick={confirm}
                className="btn-primary text-xs disabled:opacity-40"
              >Confirm</button>
            </>
          }
        >
          <div className="space-y-3 text-sm">
            <p className="text-xs text-slate-500">
              This will notify <b>{modal.verification.name}</b> and {modal.action === 'reject' ? 'mark their verification as rejected.' : 'ask them to resubmit their documents.'}
            </p>
            <div>
              <div className="label">{modal.action === 'reject' ? 'Rejection reason' : 'What needs to be resubmitted / fixed?'}</div>
              <textarea
                rows={4}
                className="input"
                value={reason}
                onChange={e=>setReason(e.target.value)}
                placeholder={modal.action === 'reject' ? 'e.g. Document photo unreadable' : 'e.g. Please upload a clearer photo of the back side'}
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
