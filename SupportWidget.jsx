import { useState, useRef, useEffect } from 'react'
import { Bell, Check, X } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function NotificationsPopover() {
  const { myNotifications, markNotificationRead, markAllNotificationsRead } = useApp()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const unread = myNotifications.filter(n => !n.read).length

  const kindStyle = (k) => {
    if (k === 'suspension')   return 'bg-red-100 text-red-700'
    if (k === 'verification') return 'bg-emerald-100 text-emerald-700'
    if (k === 'offer')        return 'bg-amber-100 text-amber-700'
    if (k === 'booking')      return 'bg-brand-100 text-brand-700'
    return 'bg-slate-100 text-slate-700'
  }

  return (
    <div className="relative" ref={ref}>
      <button onClick={()=>setOpen(o=>!o)} className="relative w-10 h-10 grid place-items-center rounded-xl hover:bg-slate-100">
        <Bell className="w-5 h-5 text-slate-600"/>
        {unread > 0 && (
          <span className="absolute top-1.5 right-1.5 min-w-[16px] h-4 px-1 rounded-full bg-red-500 text-white text-[10px] font-bold grid place-items-center">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-96 max-w-[90vw] card shadow-lg z-50">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900">Notifications</h3>
              <p className="text-xs text-slate-500">{unread} unread</p>
            </div>
            {unread > 0 && (
              <button onClick={markAllNotificationsRead} className="text-xs text-brand-600 font-semibold flex items-center gap-1"><Check className="w-3 h-3"/>Mark all read</button>
            )}
          </div>
          <div className="max-h-96 overflow-y-auto">
            {myNotifications.length === 0 ? (
              <div className="p-10 text-center text-slate-500 text-sm">
                <Bell className="w-8 h-8 mx-auto text-slate-300 mb-2"/>
                You're all caught up.
              </div>
            ) : myNotifications.map(n => (
              <div key={n.id} className={`p-4 border-b border-slate-100 flex items-start gap-3 ${!n.read ? 'bg-brand-50/30' : ''}`}>
                <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${kindStyle(n.kind)} uppercase`}>{n.kind || 'info'}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-slate-900 text-sm">{n.title}</div>
                  <div className="text-xs text-slate-600 mt-0.5">{n.message}</div>
                  <div className="text-[10px] text-slate-400 mt-1">{new Date(n.createdAt).toLocaleString()}</div>
                </div>
                {!n.read && (
                  <button onClick={()=>markNotificationRead(n.id)} className="text-slate-400 hover:text-slate-600" title="Mark as read">
                    <X className="w-3.5 h-3.5"/>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
