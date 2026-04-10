import SharedSettings from '../../components/SharedSettings'

export default function AdminSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Platform settings</h1>
        <p className="text-slate-500 text-sm">Configure global platform behaviour and your admin preferences.</p>
      </div>

      {/* Shared appearance / language / currency — works for every role */}
      <SharedSettings/>

      <div className="card p-6 grid md:grid-cols-2 gap-4">
        <Field label="Platform commission rate (%)" value="12"/>
        <Field label="Minimum booking duration (hours)" value="24"/>
        <Field label="Cross-branch fee ($)" value="25"/>
        <Field label="Default insurance ($)" value="8"/>
      </div>
      <div className="card p-6">
        <h3 className="font-bold text-slate-900 mb-3">Feature toggles</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {['Wishlist','Promo codes','Live chat support','Loyalty program','Reviews','Map view'].map(f => (
            <label key={f} className="flex items-center justify-between border border-slate-100 rounded-xl p-3">
              <span className="text-sm font-medium">{f}</span>
              <input type="checkbox" defaultChecked className="accent-brand-600 w-5 h-5"/>
            </label>
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
