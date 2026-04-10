import { useEffect, useMemo, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import AuthRequired from '../../components/AuthRequired'
import {
  Check, ChevronLeft, CalendarDays, MapPin, Building2, ShieldCheck, CreditCard,
  ClipboardCheck, PartyPopper, Car as CarIcon, Plus, Trash2, AlertCircle, Lock
} from 'lucide-react'

const STEPS = [
  { id: 1, label: 'Details',      icon: CalendarDays },
  { id: 2, label: 'Verification', icon: ShieldCheck },
  { id: 3, label: 'Payment',      icon: CreditCard },
  { id: 4, label: 'Review',       icon: ClipboardCheck },
  { id: 5, label: 'Confirmed',    icon: PartyPopper }
]

export default function BookingFlow() {
  const { id } = useParams()
  const navigate = useNavigate()
  const {
    cars, companies, branches,
    isLoggedIn, currentUser, isVerified,
    cards, addCard, verification, saveVerification,
    addBooking, formatPrice, searchQuery, setPendingBooking
  } = useApp()

  const car = cars.find(c => c.id === id)
  const company = car && companies.find(c => c.id === car.companyId)
  const branchesForCompany = useMemo(
    () => car ? branches.filter(b => b.companyId === car.companyId) : [],
    [branches, car]
  )

  const [step, setStep] = useState(1)
  const [confirmedId, setConfirmedId] = useState(null)

  // ----- Booking details (step 1) -------------------------------------------
  const [details, setDetails] = useState({
    pickupBranchId: car?.branchId || '',
    dropoffBranchId: car?.branchId || '',
    pickupDate: searchQuery.pickupDate,
    returnDate: searchQuery.returnDate,
    addons: { gps: false, child: false, driver: false },
    insurance: 'Basic',
    promo: ''
  })

  // ----- Verification (step 2) ----------------------------------------------
  const [vForm, setVForm] = useState({
    name: currentUser?.name || '',
    dob: '',
    phone: currentUser?.phone || '',
    email: currentUser?.email || '',
    docType: 'Driver License',
    docNumber: ''
  })
  useEffect(() => {
    if (verification) setVForm(f => ({ ...f, ...verification }))
  }, [verification])

  // ----- Payment (step 3) ---------------------------------------------------
  const [selectedCardId, setSelectedCardId] = useState('')
  const [showAddCard, setShowAddCard] = useState(false)
  const [newCard, setNewCard] = useState({ name: '', number: '', exp: '', cvv: '' })
  useEffect(() => {
    if (cards.length && !selectedCardId) {
      const def = cards.find(c => c.isDefault) || cards[0]
      setSelectedCardId(def.id)
    }
  }, [cards, selectedCardId])

  // ---- Auth gate -----------------------------------------------------------
  if (!isLoggedIn || currentUser?.role !== 'user') {
    // Save the pending intent and bounce to login
    setTimeout(() => {
      setPendingBooking({ booking: null, returnTo: `/book/${id}` })
    }, 0)
    return (
      <AuthRequired
        icon={Lock}
        title="Sign in to book this car"
        message="You need an account to complete a booking. Sign in or create an account to continue."
      />
    )
  }

  if (!car) return <div className="max-w-4xl mx-auto p-10 text-center">Car not found.</div>

  // ---- Pricing -------------------------------------------------------------
  const days = Math.max(
    1,
    Math.ceil((new Date(details.returnDate) - new Date(details.pickupDate)) / 86400000)
  )
  const addonCost = (details.addons.gps?5:0) + (details.addons.child?7:0) + (details.addons.driver?10:0)
  const insurancePerDay = details.insurance === 'Full' ? 18 : details.insurance === 'Basic' ? 8 : 0
  const crossBranchFee = details.pickupBranchId !== details.dropoffBranchId ? 25 : 0
  const subtotal = car.price * days
  const discount = details.promo.toUpperCase() === 'WELCOME' ? subtotal * 0.1 : 0
  const totalUSD = subtotal + (addonCost*days) + (insurancePerDay*days) + crossBranchFee - discount

  // ---- Step transitions ----------------------------------------------------
  const goNext = () => {
    if (step === 1) {
      // Decide whether to skip verification
      if (isVerified || verification?.status === 'Approved') setStep(3)
      else setStep(2)
    } else if (step === 2) {
      // Save verification then move on
      saveVerification(vForm)
      setStep(3)
    } else if (step === 3) {
      if (!cards.length && !showAddCard) { setShowAddCard(true); return }
      if (showAddCard) {
        if (!newCard.name || !newCard.number || !newCard.exp || !newCard.cvv) return
        addCard({
          brand: detectBrand(newCard.number),
          last4: newCard.number.replace(/\s/g,'').slice(-4),
          name: newCard.name,
          exp: newCard.exp
        })
        setShowAddCard(false)
        setNewCard({ name:'', number:'', exp:'', cvv:'' })
      }
      setStep(4)
    } else if (step === 4) {
      // Confirm booking
      const booking = {
        carId: car.id,
        companyId: car.companyId,
        pickupBranchId: details.pickupBranchId,
        dropoffBranchId: details.dropoffBranchId,
        pickupDate: details.pickupDate,
        returnDate: details.returnDate,
        status: 'Upcoming',
        total: Math.round(totalUSD),
        addons: Object.entries(details.addons).filter(([,v])=>v).map(([k])=>k),
        promo: details.promo,
        insurance: details.insurance,
        paymentCardId: selectedCardId
      }
      const newId = addBooking(booking)
      setConfirmedId(newId)
      setStep(5)
    }
  }

  const goBack = () => {
    if (step === 1) navigate(-1)
    else if (step === 3 && (isVerified || verification?.status === 'Approved')) setStep(1)
    else setStep(s => s - 1)
  }

  // ---- Render --------------------------------------------------------------
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <button onClick={() => navigate(`/car/${car.id}`)} className="inline-flex items-center gap-1 text-sm text-slate-500 mb-4 hover:text-slate-700">
        <ChevronLeft className="w-4 h-4"/>Back to car
      </button>

      {/* Stepper */}
      <ol className="flex items-center justify-between gap-2 mb-8">
        {STEPS.map((s, i) => {
          const active = step === s.id
          const done = step > s.id
          return (
            <li key={s.id} className="flex-1 flex items-center gap-2">
              <div className={`w-9 h-9 rounded-xl grid place-items-center text-xs font-bold shrink-0 ${
                done ? 'bg-emerald-500 text-white' :
                active ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-400'
              }`}>
                {done ? <Check className="w-4 h-4"/> : <s.icon className="w-4 h-4"/>}
              </div>
              <div className="hidden sm:block">
                <div className={`text-[10px] uppercase tracking-wider font-bold ${active||done?'text-slate-900':'text-slate-400'}`}>Step {s.id}</div>
                <div className={`text-xs font-semibold ${active||done?'text-slate-900':'text-slate-400'}`}>{s.label}</div>
              </div>
              {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 ${done?'bg-emerald-500':'bg-slate-200'}`}/>}
            </li>
          )
        })}
      </ol>

      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        <div className="space-y-4">
          {step === 1 && (
            <DetailsStep car={car} company={company} branches={branchesForCompany}
              details={details} setDetails={setDetails}/>
          )}
          {step === 2 && (
            <VerifyStep vForm={vForm} setVForm={setVForm} preloaded={!!verification}/>
          )}
          {step === 3 && (
            <PaymentStep
              cards={cards}
              selectedCardId={selectedCardId} setSelectedCardId={setSelectedCardId}
              showAddCard={showAddCard} setShowAddCard={setShowAddCard}
              newCard={newCard} setNewCard={setNewCard}
            />
          )}
          {step === 4 && (
            <ReviewStep
              car={car} company={company} branches={branches}
              details={details} days={days} totalUSD={totalUSD}
              vForm={vForm} cards={cards} selectedCardId={selectedCardId}
              formatPrice={formatPrice}
            />
          )}
          {step === 5 && (
            <SuccessStep id={confirmedId} car={car} navigate={navigate}/>
          )}

          {step < 5 && (
            <div className="flex items-center justify-between gap-3 pt-3">
              <button onClick={goBack} className="btn-secondary text-sm">
                <ChevronLeft className="w-4 h-4"/>Back
              </button>
              <button onClick={goNext} className="btn-primary text-sm">
                {step === 4 ? 'Confirm and pay' : 'Continue →'}
              </button>
            </div>
          )}
        </div>

        {/* Sidebar — sticky summary */}
        <aside className="lg:sticky lg:top-20 self-start">
          <div className="card overflow-hidden">
            <img src={car.image} alt={car.name} className="w-full h-32 object-cover"/>
            <div className="p-4">
              <div className="text-xs text-slate-500 flex items-center gap-1"><Building2 className="w-3 h-3"/>{company?.name}</div>
              <div className="font-bold text-slate-900">{car.name}</div>
              <div className="text-xs text-slate-500 flex items-center gap-1 mt-1"><MapPin className="w-3 h-3"/>{branches.find(b=>b.id===details.pickupBranchId)?.city}</div>

              <div className="mt-4 pt-4 border-t border-slate-100 space-y-1.5 text-xs">
                <Row label={`Car (${days}d)`} val={formatPrice(car.price * days)}/>
                <Row label="Add-ons" val={formatPrice(addonCost*days)}/>
                <Row label="Insurance" val={formatPrice(insurancePerDay*days)}/>
                {crossBranchFee>0 && <Row label="Cross-branch" val={formatPrice(crossBranchFee)}/>}
                {discount>0 && <Row label="Promo" val={`-${formatPrice(discount)}`} green/>}
                <div className="flex items-center justify-between font-bold text-slate-900 pt-2 border-t border-slate-100 text-sm">
                  <span>Total</span><span>{formatPrice(totalUSD)}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="text-[11px] text-slate-400 text-center mt-3">
            Free cancellation up to 24h before pickup.
          </div>
        </aside>
      </div>
    </div>
  )
}

// =============================================================================
// STEP 1 — DETAILS
// =============================================================================
function DetailsStep({ car, company, branches, details, setDetails }) {
  return (
    <div className="card p-6 space-y-5">
      <div>
        <h2 className="text-xl font-extrabold text-slate-900">Booking details</h2>
        <p className="text-sm text-slate-500">Choose your pickup, drop-off and add-ons.</p>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="Pickup branch">
          <select className="input" value={details.pickupBranchId} onChange={e=>setDetails({...details, pickupBranchId: e.target.value})}>
            {branches.map(b => <option key={b.id} value={b.id}>{b.name} — {b.city}</option>)}
          </select>
        </Field>
        <Field label="Drop-off branch">
          <select className="input" value={details.dropoffBranchId} onChange={e=>setDetails({...details, dropoffBranchId: e.target.value})}>
            {branches.map(b => <option key={b.id} value={b.id}>{b.name} — {b.city}</option>)}
          </select>
        </Field>
        <Field label="Pickup date">
          <input type="date" className="input" value={details.pickupDate} onChange={e=>setDetails({...details, pickupDate: e.target.value})}/>
        </Field>
        <Field label="Return date">
          <input type="date" className="input" value={details.returnDate} onChange={e=>setDetails({...details, returnDate: e.target.value})}/>
        </Field>
      </div>

      <div>
        <div className="text-xs font-semibold text-slate-700 mb-2">Add-ons</div>
        {[
          { k:'gps', label:'GPS Navigation' },
          { k:'child', label:'Child Seat' },
          { k:'driver', label:'Extra Driver' }
        ].map(a => (
          <label key={a.k} className="flex items-center justify-between text-sm py-1.5">
            <span className="flex items-center gap-2">
              <input type="checkbox" checked={details.addons[a.k]} onChange={e=>setDetails({...details, addons: {...details.addons, [a.k]: e.target.checked}})} className="accent-brand-600"/>
              {a.label}
            </span>
          </label>
        ))}
      </div>

      <div>
        <div className="text-xs font-semibold text-slate-700 mb-2">Insurance</div>
        <div className="grid grid-cols-3 gap-2">
          {['None','Basic','Full'].map(i => (
            <button key={i} onClick={()=>setDetails({...details, insurance: i})} className={`text-xs py-2 rounded-lg border transition ${details.insurance===i?'bg-brand-600 text-white border-brand-600':'border-slate-200 text-slate-600 hover:border-brand-400'}`}>{i}</button>
          ))}
        </div>
      </div>

      <Field label="Promo code (try WELCOME)">
        <input value={details.promo} onChange={e=>setDetails({...details, promo: e.target.value.toUpperCase()})} className="input"/>
      </Field>
    </div>
  )
}

// =============================================================================
// STEP 2 — VERIFICATION
// =============================================================================
function VerifyStep({ vForm, setVForm, preloaded }) {
  const upd = (k,v) => setVForm({ ...vForm, [k]: v })
  return (
    <div className="card p-6 space-y-5">
      <div>
        <h2 className="text-xl font-extrabold text-slate-900">Identity verification</h2>
        <p className="text-sm text-slate-500">{preloaded ? 'We loaded your saved info — review and continue.' : 'Verify your identity before completing your booking.'}</p>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="Full name"><input required className="input" value={vForm.name} onChange={e=>upd('name', e.target.value)}/></Field>
        <Field label="Date of birth"><input required type="date" className="input" value={vForm.dob} onChange={e=>upd('dob', e.target.value)}/></Field>
        <Field label="Phone"><input required className="input" value={vForm.phone} onChange={e=>upd('phone', e.target.value)} placeholder="+998"/></Field>
        <Field label="Email"><input required type="email" className="input" value={vForm.email} onChange={e=>upd('email', e.target.value)}/></Field>
        <Field label="Document type">
          <select className="input" value={vForm.docType} onChange={e=>upd('docType', e.target.value)}>
            <option>Driver License</option><option>Passport</option><option>ID Card</option>
          </select>
        </Field>
        <Field label="Document number"><input required className="input" value={vForm.docNumber} onChange={e=>upd('docNumber', e.target.value)}/></Field>
      </div>
      <Field label="Upload document photo">
        <label className="block border-2 border-dashed border-slate-200 rounded-xl p-5 text-center cursor-pointer hover:border-brand-400 transition">
          <div className="text-sm text-slate-600 font-semibold">Click to upload</div>
          <div className="text-xs text-slate-400">PNG, JPG up to 10MB</div>
          <input type="file" className="hidden"/>
        </label>
      </Field>
    </div>
  )
}

// =============================================================================
// STEP 3 — PAYMENT
// =============================================================================
function PaymentStep({ cards, selectedCardId, setSelectedCardId, showAddCard, setShowAddCard, newCard, setNewCard }) {
  return (
    <div className="card p-6 space-y-5">
      <div>
        <h2 className="text-xl font-extrabold text-slate-900">Payment method</h2>
        <p className="text-sm text-slate-500">Select a saved card or add a new one. Your card is only charged when you confirm.</p>
      </div>

      {cards.length > 0 && !showAddCard && (
        <div className="space-y-2">
          {cards.map(c => (
            <label key={c.id} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition ${
              selectedCardId === c.id ? 'border-brand-500 bg-brand-50' : 'border-slate-200 hover:border-brand-300'
            }`}>
              <input type="radio" name="card" checked={selectedCardId===c.id} onChange={()=>setSelectedCardId(c.id)} className="accent-brand-600"/>
              <div className="w-10 h-10 rounded-lg bg-slate-900 text-white grid place-items-center text-[10px] font-bold">{c.brand}</div>
              <div className="flex-1">
                <div className="font-semibold text-slate-900 text-sm">•••• {c.last4}</div>
                <div className="text-xs text-slate-500">{c.name} · exp {c.exp}</div>
              </div>
              {c.isDefault && <span className="badge bg-emerald-100 text-emerald-700">Default</span>}
            </label>
          ))}
          <button type="button" onClick={()=>setShowAddCard(true)} className="btn-secondary text-xs"><Plus className="w-3.5 h-3.5"/>Add another card</button>
        </div>
      )}

      {(cards.length === 0 || showAddCard) && (
        <div className="space-y-3 border-t border-slate-100 pt-4">
          {cards.length === 0 && (
            <div className="text-xs rounded-lg bg-amber-50 text-amber-800 border border-amber-100 p-3 flex items-start gap-2">
              <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0"/>
              You don't have any saved cards yet. Add one below to continue.
            </div>
          )}
          <div className="grid sm:grid-cols-2 gap-3">
            <Field label="Cardholder name">
              <input required className="input" value={newCard.name} onChange={e=>setNewCard({...newCard, name: e.target.value})}/>
            </Field>
            <Field label="Card number">
              <input required className="input" value={newCard.number} onChange={e=>setNewCard({...newCard, number: e.target.value})} placeholder="4242 4242 4242 4242"/>
            </Field>
            <Field label="Expiry">
              <input required className="input" value={newCard.exp} onChange={e=>setNewCard({...newCard, exp: e.target.value})} placeholder="MM/YY"/>
            </Field>
            <Field label="CVV">
              <input required className="input" value={newCard.cvv} onChange={e=>setNewCard({...newCard, cvv: e.target.value})} placeholder="123"/>
            </Field>
          </div>
          {cards.length > 0 && (
            <button type="button" onClick={()=>setShowAddCard(false)} className="text-xs text-slate-500">Cancel adding card</button>
          )}
        </div>
      )}
    </div>
  )
}

// =============================================================================
// STEP 4 — REVIEW
// =============================================================================
function ReviewStep({ car, company, branches, details, days, totalUSD, vForm, cards, selectedCardId, formatPrice }) {
  const pickup = branches.find(b => b.id === details.pickupBranchId)
  const dropoff = branches.find(b => b.id === details.dropoffBranchId)
  const card = cards.find(c => c.id === selectedCardId) || cards[cards.length - 1]
  return (
    <div className="card p-6 space-y-5">
      <div>
        <h2 className="text-xl font-extrabold text-slate-900">Review and confirm</h2>
        <p className="text-sm text-slate-500">Please double-check your details before confirming.</p>
      </div>

      <Section title="Car">
        <div className="text-sm">{company?.name} — <span className="font-semibold">{car.name}</span></div>
      </Section>

      <Section title="Schedule">
        <div className="grid sm:grid-cols-2 gap-2 text-sm">
          <div><span className="text-slate-500">Pickup:</span> {pickup?.name}, {pickup?.city}</div>
          <div><span className="text-slate-500">Drop-off:</span> {dropoff?.name}, {dropoff?.city}</div>
          <div><span className="text-slate-500">Dates:</span> {details.pickupDate} → {details.returnDate}</div>
          <div><span className="text-slate-500">Duration:</span> {days} day(s)</div>
        </div>
      </Section>

      <Section title="Driver">
        <div className="text-sm">{vForm.name} · {vForm.docType} #{vForm.docNumber}</div>
        <div className="text-xs text-slate-500">{vForm.email} · {vForm.phone}</div>
      </Section>

      <Section title="Payment">
        {card ? (
          <div className="text-sm">{card.brand} •••• {card.last4} · {card.name}</div>
        ) : <div className="text-sm text-amber-600">No card selected</div>}
      </Section>

      <Section title="Total">
        <div className="text-2xl font-extrabold text-slate-900">{formatPrice(totalUSD)}</div>
      </Section>
    </div>
  )
}

// =============================================================================
// STEP 5 — SUCCESS
// =============================================================================
function SuccessStep({ id, car, navigate }) {
  return (
    <div className="card p-10 text-center">
      <div className="w-20 h-20 mx-auto rounded-full bg-emerald-100 grid place-items-center"><Check className="w-10 h-10 text-emerald-600"/></div>
      <h2 className="text-2xl font-extrabold text-slate-900 mt-5">Booking confirmed!</h2>
      <p className="text-slate-500 mt-2">Your {car.name} is reserved. Booking reference <span className="font-mono font-bold text-slate-900">{id}</span>.</p>
      <div className="flex items-center justify-center gap-2 mt-6">
        <Link to="/bookings" className="btn-primary"><CarIcon className="w-4 h-4"/>View my bookings</Link>
        <Link to="/find-cars" className="btn-secondary">Browse more cars</Link>
      </div>
    </div>
  )
}

// =============================================================================
// helpers
// =============================================================================
function Field({ label, children }) {
  return (
    <div>
      <div className="label">{label}</div>
      {children}
    </div>
  )
}
function Section({ title, children }) {
  return (
    <div className="rounded-xl border border-slate-100 p-4">
      <div className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-2">{title}</div>
      {children}
    </div>
  )
}
function Row({ label, val, green }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-slate-500">{label}</span>
      <span className={green ? 'text-emerald-600 font-semibold' : 'text-slate-700 font-semibold'}>{val}</span>
    </div>
  )
}
function detectBrand(num) {
  const n = num.replace(/\s/g,'')
  if (n.startsWith('4')) return 'VISA'
  if (/^5[1-5]/.test(n)) return 'MC'
  if (/^3[47]/.test(n)) return 'AMEX'
  if (/^9860/.test(n)) return 'UZ'
  return 'CARD'
}
