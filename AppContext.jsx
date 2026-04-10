import { Sun, Moon, Globe } from 'lucide-react'
import { useApp } from '../context/AppContext'

/**
 * Reusable settings block — Appearance / Language / Currency.
 * Reads from and writes to the AppContext role-scoped settings store
 * so it works identically for users, companies and admins.
 */
export default function SharedSettings() {
  const { settings, updateSettings, t } = useApp()

  return (
    <div className="space-y-4">
      <div className="card p-6">
        <h3 className="font-bold text-slate-900">{t('settings.appearance')}</h3>
        <p className="text-xs text-slate-500 mb-4">{t('settings.appearance_sub')}</p>
        <div className="grid grid-cols-2 gap-3">
          <ThemeButton active={settings.theme==='light'} onClick={()=>updateSettings({theme:'light'})} icon={Sun} label={t('settings.light')}/>
          <ThemeButton active={settings.theme==='dark'}  onClick={()=>updateSettings({theme:'dark'})}  icon={Moon} label={t('settings.dark')}/>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="font-bold text-slate-900">{t('settings.language')}</h3>
        <p className="text-xs text-slate-500 mb-4">{t('settings.language_sub')}</p>
        <div className="grid sm:grid-cols-3 gap-2">
          {[
            { v:'en', label:'English' },
            { v:'ru', label:'Русский' },
            { v:'uz', label:"O'zbek" }
          ].map(l => (
            <button key={l.v} onClick={()=>updateSettings({language: l.v})} className={`text-sm py-2.5 rounded-xl border font-semibold transition ${settings.language===l.v?'bg-brand-600 text-white border-brand-600':'border-slate-200 text-slate-700 hover:border-brand-400'}`}>
              <Globe className="w-3.5 h-3.5 inline -mt-0.5 mr-1"/>{l.label}
            </button>
          ))}
        </div>
      </div>

      <div className="card p-6">
        <h3 className="font-bold text-slate-900">{t('settings.currency')}</h3>
        <p className="text-xs text-slate-500 mb-4">{t('settings.currency_sub')}</p>
        <div className="grid sm:grid-cols-3 gap-2">
          {[
            { v:'UZS', label:"Uzbek so'm",   sub:'UZS' },
            { v:'USD', label:'US Dollar',    sub:'USD' },
            { v:'RUB', label:'Russian Ruble', sub:'RUB' }
          ].map(c => (
            <button key={c.v} onClick={()=>updateSettings({currency: c.v})} className={`text-sm py-3 rounded-xl border font-semibold transition ${settings.currency===c.v?'bg-brand-600 text-white border-brand-600':'border-slate-200 text-slate-700 hover:border-brand-400'}`}>
              <div>{c.label}</div>
              <div className={`text-[10px] ${settings.currency===c.v?'text-brand-100':'text-slate-400'}`}>{c.sub}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function ThemeButton({ active, onClick, icon: Icon, label }) {
  return (
    <button onClick={onClick} className={`p-4 rounded-xl border text-left transition ${active?'border-brand-500 bg-brand-50':'border-slate-200 hover:border-brand-300'}`}>
      <Icon className={`w-5 h-5 ${active?'text-brand-600':'text-slate-500'}`}/>
      <div className={`text-sm font-bold mt-2 ${active?'text-brand-700':'text-slate-900'}`}>{label}</div>
    </button>
  )
}
