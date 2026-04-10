import { useApp } from '../../context/AppContext'
import SharedSettings from '../../components/SharedSettings'

export default function CompanySettings() {
  const { companies, currentUser } = useApp()
  const myCompanyId = currentUser?.companyId || 'c1'
  const company = companies.find(c => c.id === myCompanyId)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Company settings</h1>
        <p className="text-slate-500 text-sm">Manage your company profile, pricing rules and policies.</p>
      </div>

      {/* Shared appearance / language / currency — works for every role */}
      <SharedSettings/>

      <div className="card p-6 grid md:grid-cols-2 gap-4">
        <Field label="Company name" value={company?.name || ''}/>
        <Field label="Headquarters" value={company?.headquarters || ''}/>
        <Field label="Email" value={currentUser?.email || ''}/>
        <Field label="Phone" value="+998 71 200 0000"/>
        <Field label="Tax ID" value={`UZ-2000${(company?.id || 'c1').slice(1)}0123`}/>
        <Field label="Established" value={String(company?.founded || 2018)}/>
      </div>

      <div className="card p-6">
        <h3 className="font-bold text-slate-900 mb-3">Pricing rules</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <Field label="Cross-branch fee" value="$25"/>
          <Field label="Late return fee" value="$15/hour"/>
          <Field label="Mileage limit" value="250 km/day"/>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="font-bold text-slate-900 mb-3">Promotions</h3>
        <div className="grid md:grid-cols-2 gap-3">
          {[
            { code:'WELCOME', desc:'10% off first booking', uses: 184 },
            { code:'SUMMER25', desc:'25% off luxury cars in summer', uses: 92 },
            { code:'WEEKEND', desc:'Free GPS on weekend rentals', uses: 41 }
          ].map(p => (
            <div key={p.code} className="border border-slate-100 rounded-xl p-4 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-900">{p.code}</div>
                <div className="text-xs text-slate-500">{p.desc}</div>
              </div>
              <div className="text-xs text-slate-500">{p.uses} uses</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function Field({ label, value }) {
  return (
    <div>
      <div className="label">{label}</div>
      <input className="input" defaultValue={value}/>
    </div>
  )
}
