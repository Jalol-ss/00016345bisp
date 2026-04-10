import { MessageCircle, X } from 'lucide-react'
import { useState } from 'react'

export default function SupportWidget() {
  const [open, setOpen] = useState(false)
  return (
    <div className="fixed bottom-6 right-6 z-50">
      {open && (
        <div className="card w-72 mb-3 overflow-hidden">
          <div className="bg-brand-600 text-white p-4">
            <div className="font-bold">Need help?</div>
            <div className="text-xs text-brand-100">We typically reply in a few minutes</div>
          </div>
          <div className="p-4 text-sm text-slate-600">
            <p className="mb-3">Hi 👋 Have a question about your booking, verification or fleet? Tap below to chat with a real agent.</p>
            <button className="btn-primary w-full text-xs">Start a chat</button>
          </div>
        </div>
      )}
      <button onClick={()=>setOpen(!open)} className="w-14 h-14 rounded-full bg-brand-600 hover:bg-brand-700 text-white shadow-lg grid place-items-center transition">
        {open ? <X className="w-5 h-5"/> : <MessageCircle className="w-6 h-6"/>}
      </button>
    </div>
  )
}
