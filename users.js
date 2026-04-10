import { createContext, useContext, useState, useMemo, useEffect, useCallback } from 'react'
import { cars as initialCars } from '../data/cars'
import { bookings as initialBookings, verifications as initialVerifications } from '../data/bookings'
import { users as initialUsers } from '../data/users'
import { companies as initialCompanies } from '../data/companies'
import { branches } from '../data/branches'
import { translations } from '../i18n/translations'

const AppContext = createContext(null)

// ---------------------------------------------------------------------------
// DEMO ACCOUNTS
// ---------------------------------------------------------------------------
export const DEMO_ACCOUNTS = [
  { email: 'admin@bispdemo.com',     password: 'Admin123!',     role: 'admin',  name: 'Platform Admin',       redirect: '/admin/dashboard' },
  { email: 'user@bispdemo.com',      password: 'User123!',      role: 'user',   userId: 'u1', name: 'Sarvar Tursunov',       redirect: '/' },
  { email: 'tashkentrent@gmail.com', password: 'Tashkent123!',  role: 'company', companyId: 'c1', name: 'Silk Road Rentals',    redirect: '/company/dashboard' },
  { email: 'samarkandrent@gmail.com',password: 'Samarkand123!', role: 'company', companyId: 'c3', name: 'Samarkand Wheels',     redirect: '/company/dashboard' },
  { email: 'bukhararent@gmail.com',  password: 'Bukhara123!',   role: 'company', companyId: 'c4', name: 'Bukhara Drive',        redirect: '/company/dashboard' },
  { email: 'ferganarent@gmail.com',  password: 'Fergana123!',   role: 'company', companyId: 'c5', name: 'Fergana Valley Cars',  redirect: '/company/dashboard' },
  { email: 'andijanrent@gmail.com',  password: 'Andijan123!',   role: 'company', companyId: 'c2', name: 'Tashkent Auto Hire',   redirect: '/company/dashboard' }
]

// ---------------------------------------------------------------------------
// STORAGE KEYS (shared "backend" lives in localStorage, single source of truth)
// ---------------------------------------------------------------------------
const STORAGE_KEY       = 'bisp-car-rental-auth'
const REGISTRY_KEY      = 'bisp-car-rental-registry'
const PROFILES_KEY      = 'bisp-car-rental-profiles'
const BOOKINGS_KEY      = 'bisp-car-rental-bookings'
const CARS_KEY          = 'bisp-car-rental-cars'
const COMPANIES_KEY     = 'bisp-car-rental-companies'
const VERIFICATIONS_KEY = 'bisp-car-rental-verifications'
const NOTIFICATIONS_KEY = 'bisp-car-rental-notifications'
const MAINT_KEY         = 'bisp-car-rental-maintenance'
const ROLE_SETTINGS_KEY = 'bisp-car-rental-role-settings'

// Currency rates relative to USD
const CURRENCY_RATES  = { UZS: 12500, USD: 1, RUB: 90 }
const CURRENCY_SYMBOL = { UZS: "so'm", USD: '$', RUB: '₽' }

const blankProfile = (overrides = {}) => ({
  cards: [],
  favorites: [],
  verification: null,
  ...overrides
})

const blankSettings = () => ({ theme: 'light', language: 'en', currency: 'UZS' })

// ---------------------------------------------------------------------------
// Safe localStorage read helpers
// ---------------------------------------------------------------------------
const read = (key, fallback) => {
  try {
    const s = localStorage.getItem(key)
    return s ? JSON.parse(s) : fallback
  } catch { return fallback }
}

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------
export function AppProvider({ children }) {
  // ---- AUTH ---------------------------------------------------------------
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : null
    } catch { return null }
  })

  // Registry of newly registered users
  const [registry, setRegistry] = useState(() => read(REGISTRY_KEY, []))

  // Per-user profile data (cards, favorites, verification)
  const [profiles, setProfiles] = useState(() => {
    const parsed = read(PROFILES_KEY, {})
    if (!parsed.u1) {
      parsed.u1 = blankProfile({
        favorites: ['car4', 'car6'],
        verification: {
          name: 'Sarvar Tursunov',
          dob: '1998-04-12',
          phone: '+998 90 111 2233',
          email: 'sarvar@example.com',
          docType: 'Driver License',
          docNumber: 'AA1234567',
          status: 'Approved',
          submittedAt: '2025-09-15'
        },
        cards: [
          { id: 'card1', brand: 'Visa', last4: '4242', name: 'Sarvar Tursunov', exp: '08/28', isDefault: true }
        ]
      })
    }
    return parsed
  })

  // Bookings, cars, companies, verifications (persisted shared store)
  const [bookings, setBookings] = useState(() => read(BOOKINGS_KEY, initialBookings))
  const [cars, setCars]         = useState(() => read(CARS_KEY, initialCars))
  const [companies, setCompanies] = useState(() => read(COMPANIES_KEY, initialCompanies).map(c => ({
    // ensure new status field is present
    status: 'active',
    ...c
  })))
  const [verifications, setVerifications] = useState(() => read(VERIFICATIONS_KEY, initialVerifications))
  const [notifications, setNotifications] = useState(() => read(NOTIFICATIONS_KEY, []))
  const [maintenanceRecords, setMaintenanceRecords] = useState(() => read(MAINT_KEY, []))
  // Role-scoped settings: keys are 'user_<id>', 'company_<id>', 'admin'
  const [roleSettings, setRoleSettings] = useState(() => {
    const parsed = read(ROLE_SETTINGS_KEY, {})
    if (!parsed.user_u1) parsed.user_u1 = blankSettings()
    if (!parsed.admin)   parsed.admin   = blankSettings()
    return parsed
  })

  const [pendingBooking, setPendingBooking] = useState(null)
  const [searchQuery, setSearchQuery] = useState({
    pickupCity: 'Tashkent',
    dropoffCity: 'Tashkent',
    pickupDate: '2026-04-12',
    returnDate: '2026-04-16',
    differentDropoff: false
  })

  // ---- PERSISTENCE --------------------------------------------------------
  useEffect(() => {
    try {
      if (currentUser) sessionStorage.setItem(STORAGE_KEY, JSON.stringify(currentUser))
      else sessionStorage.removeItem(STORAGE_KEY)
    } catch {}
  }, [currentUser])

  useEffect(() => { try { localStorage.setItem(REGISTRY_KEY, JSON.stringify(registry)) } catch {} }, [registry])
  useEffect(() => { try { localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles)) } catch {} }, [profiles])
  useEffect(() => { try { localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings)) } catch {} }, [bookings])
  useEffect(() => { try { localStorage.setItem(CARS_KEY, JSON.stringify(cars)) } catch {} }, [cars])
  useEffect(() => { try { localStorage.setItem(COMPANIES_KEY, JSON.stringify(companies)) } catch {} }, [companies])
  useEffect(() => { try { localStorage.setItem(VERIFICATIONS_KEY, JSON.stringify(verifications)) } catch {} }, [verifications])
  useEffect(() => { try { localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications)) } catch {} }, [notifications])
  useEffect(() => { try { localStorage.setItem(MAINT_KEY, JSON.stringify(maintenanceRecords)) } catch {} }, [maintenanceRecords])
  useEffect(() => { try { localStorage.setItem(ROLE_SETTINGS_KEY, JSON.stringify(roleSettings)) } catch {} }, [roleSettings])

  // ---- SHARED USERS (demo + registered) merged for admin/company reads ---
  const allUsers = useMemo(() => {
    const extra = registry.map(r => ({
      id: r.id,
      name: r.name,
      email: r.email,
      phone: profiles[r.id]?.verification?.phone || '',
      city: profiles[r.id]?.verification?.city || '—',
      verified: profiles[r.id]?.verification?.status === 'Approved',
      joined: (r.createdAt || '').slice(0, 10),
      loyalty: 0
    }))
    return [...initialUsers, ...extra]
  }, [registry, profiles])

  // ---- SETTINGS (resolved for the current role) --------------------------
  const settingsKey = currentUser
    ? (currentUser.role === 'user'   ? `user_${currentUser.userId}`
      : currentUser.role === 'company' ? `company_${currentUser.companyId}`
      : 'admin')
    : null
  const settings = (settingsKey && roleSettings[settingsKey]) || blankSettings()

  useEffect(() => {
    const root = document.documentElement
    if (settings.theme === 'dark') root.classList.add('dark')
    else root.classList.remove('dark')
  }, [settings.theme])

  const updateSettings = useCallback((patch) => {
    if (!settingsKey) return
    setRoleSettings(s => ({
      ...s,
      [settingsKey]: { ...blankSettings(), ...(s[settingsKey] || {}), ...patch }
    }))
  }, [settingsKey])

  // i18n
  const t = useCallback((key) => {
    const lang = settings.language || 'en'
    return (translations[lang] && translations[lang][key]) || translations.en[key] || key
  }, [settings.language])

  // ---- CURRENCY -----------------------------------------------------------
  const formatPrice = useCallback((usdValue, opts = {}) => {
    const cur  = settings.currency || 'UZS'
    const rate = CURRENCY_RATES[cur] || 1
    const sym  = CURRENCY_SYMBOL[cur] || ''
    const value = Math.round((usdValue || 0) * rate)
    const formatted = value.toLocaleString('en-US')
    if (opts.compact && cur === 'UZS' && value >= 1_000_000) {
      return `${(value / 1_000_000).toFixed(1)}M ${sym}`
    }
    return cur === 'USD' ? `${sym}${formatted}` : `${formatted} ${sym}`
  }, [settings.currency])

  const convertPrice = useCallback((usdValue) => {
    const cur = settings.currency || 'UZS'
    return Math.round((usdValue || 0) * (CURRENCY_RATES[cur] || 1))
  }, [settings.currency])

  // ---- AUTH HELPERS ------------------------------------------------------
  const login = useCallback((email, password) => {
    const normalized = email.trim().toLowerCase()
    const demo = DEMO_ACCOUNTS.find(a => a.email.toLowerCase() === normalized && a.password === password)
    if (demo) {
      // Block suspended companies
      if (demo.role === 'company') {
        const co = companies.find(c => c.id === demo.companyId)
        if (co?.status === 'suspended') {
          // Still log them in so they can see the notice
        }
      }
      const u = initialUsers.find(x => x.id === demo.userId)
      const newUser = {
        email: demo.email,
        name:  demo.name,
        role:  demo.role,
        userId: demo.userId || null,
        companyId: demo.companyId || null,
        verified: demo.role === 'user' ? (profiles[demo.userId]?.verification?.status === 'Approved') : undefined,
        loyalty: u?.loyalty ?? 0,
        phone: u?.phone,
        city:  u?.city
      }
      // Seed role settings if missing
      const key = demo.role === 'user' ? `user_${demo.userId}`
                : demo.role === 'company' ? `company_${demo.companyId}`
                : 'admin'
      if (!roleSettings[key]) setRoleSettings(s => ({ ...s, [key]: blankSettings() }))
      setCurrentUser(newUser)
      return { ok: true, redirect: demo.redirect }
    }
    const reg = registry.find(r => r.email.toLowerCase() === normalized && r.password === password)
    if (reg) {
      const newUser = {
        email: reg.email,
        name: reg.name,
        role: 'user',
        userId: reg.id,
        companyId: null,
        verified: profiles[reg.id]?.verification?.status === 'Approved',
        loyalty: 0,
        phone: profiles[reg.id]?.verification?.phone || '',
        city: ''
      }
      const key = `user_${reg.id}`
      if (!roleSettings[key]) setRoleSettings(s => ({ ...s, [key]: blankSettings() }))
      setCurrentUser(newUser)
      return { ok: true, redirect: '/' }
    }
    return { ok: false, error: 'Invalid email or password' }
  }, [registry, profiles, companies, roleSettings])

  const register = useCallback((name, email, password) => {
    const normalized = email.trim().toLowerCase()
    if (DEMO_ACCOUNTS.some(a => a.email.toLowerCase() === normalized))
      return { ok: false, error: 'This email is reserved for a demo account' }
    if (registry.some(r => r.email.toLowerCase() === normalized))
      return { ok: false, error: 'An account with this email already exists' }
    if (!name?.trim() || !email?.trim() || !password)
      return { ok: false, error: 'Please fill in all fields' }
    if (password.length < 6)
      return { ok: false, error: 'Password must be at least 6 characters' }

    const id = 'u_' + Math.random().toString(36).slice(2, 9)
    const newReg = { id, name: name.trim(), email: normalized, password, createdAt: new Date().toISOString() }
    setRegistry(r => [...r, newReg])
    setProfiles(p => ({ ...p, [id]: blankProfile() }))
    setRoleSettings(s => ({ ...s, [`user_${id}`]: blankSettings() }))
    setCurrentUser({
      email: normalized,
      name: name.trim(),
      role: 'user',
      userId: id,
      companyId: null,
      verified: false,
      loyalty: 0
    })
    return { ok: true, redirect: '/' }
  }, [registry])

  const logout = useCallback(() => {
    setCurrentUser(null)
    setPendingBooking(null)
  }, [])

  const isLoggedIn = !!currentUser
  const isVerified = currentUser?.verified === true

  // ---- NOTIFICATIONS ----------------------------------------------------
  // Shape: { id, audience: 'user'|'company'|'admin', userId?, companyId?, title, message, kind, read, createdAt, meta? }
  const addNotification = useCallback((n) => {
    const id = 'n_' + Math.random().toString(36).slice(2, 9)
    setNotifications(arr => [{ id, read: false, createdAt: new Date().toISOString(), ...n }, ...arr])
    return id
  }, [])

  const markNotificationRead = useCallback((id) => {
    setNotifications(arr => arr.map(n => n.id === id ? { ...n, read: true } : n))
  }, [])

  const markAllNotificationsRead = useCallback(() => {
    if (!currentUser) return
    setNotifications(arr => arr.map(n => {
      const match = (currentUser.role === 'user' && n.audience === 'user' && n.userId === currentUser.userId)
                 || (currentUser.role === 'company' && n.audience === 'company' && n.companyId === currentUser.companyId)
                 || (currentUser.role === 'admin' && n.audience === 'admin')
      return match ? { ...n, read: true } : n
    }))
  }, [currentUser])

  const myNotifications = useMemo(() => {
    if (!currentUser) return []
    return notifications.filter(n => {
      if (currentUser.role === 'user')    return n.audience === 'user' && n.userId === currentUser.userId
      if (currentUser.role === 'company') return n.audience === 'company' && n.companyId === currentUser.companyId
      if (currentUser.role === 'admin')   return n.audience === 'admin'
      return false
    })
  }, [notifications, currentUser])

  // ---- PROFILE MUTATORS --------------------------------------------------
  const updateProfile = useCallback((patch) => {
    if (!currentUser?.userId) return
    setProfiles(p => ({
      ...p,
      [currentUser.userId]: { ...(p[currentUser.userId] || blankProfile()), ...patch }
    }))
  }, [currentUser])

  const saveVerification = useCallback((data) => {
    if (!currentUser?.userId) return
    const record = {
      ...data,
      status: 'Pending',
      submittedAt: new Date().toISOString().slice(0, 10)
    }
    setProfiles(p => {
      const cur = p[currentUser.userId] || blankProfile()
      return { ...p, [currentUser.userId]: { ...cur, verification: record } }
    })
    // Write or update the shared verifications list so admin sees it
    setVerifications(vs => {
      const existing = vs.find(v => v.userId === currentUser.userId)
      const shared = {
        id: existing?.id || ('V' + Math.random().toString(36).slice(2, 7).toUpperCase()),
        userId: currentUser.userId,
        name: data.name || currentUser.name,
        docType: data.docType,
        docNumber: data.docNumber,
        status: 'Pending',
        submitted: new Date().toISOString().slice(0, 10),
        phone: data.phone,
        email: data.email,
        dob: data.dob
      }
      return existing ? vs.map(v => v.id === existing.id ? shared : v) : [shared, ...vs]
    })
    // Don't auto-approve anymore — admin must act. But for demo continuity we mark the
    // booking flow as "allowed to proceed" once the user has at least submitted.
    setCurrentUser(u => ({ ...u, verified: true }))
    addNotification({
      audience: 'admin',
      title: 'New verification submitted',
      message: `${data.name || currentUser.name} submitted a ${data.docType} for review.`,
      kind: 'verification'
    })
  }, [currentUser, addNotification])

  const addCard = useCallback((card) => {
    if (!currentUser?.userId) return
    setProfiles(p => {
      const cur = p[currentUser.userId] || blankProfile()
      const id = 'card_' + Math.random().toString(36).slice(2, 8)
      const newCards = [...cur.cards, { ...card, id, isDefault: cur.cards.length === 0 }]
      return { ...p, [currentUser.userId]: { ...cur, cards: newCards } }
    })
  }, [currentUser])

  const removeCard = useCallback((id) => {
    if (!currentUser?.userId) return
    setProfiles(p => {
      const cur = p[currentUser.userId] || blankProfile()
      const filtered = cur.cards.filter(c => c.id !== id)
      if (filtered.length && !filtered.some(c => c.isDefault)) filtered[0].isDefault = true
      return { ...p, [currentUser.userId]: { ...cur, cards: filtered } }
    })
  }, [currentUser])

  const setDefaultCard = useCallback((id) => {
    if (!currentUser?.userId) return
    setProfiles(p => {
      const cur = p[currentUser.userId] || blankProfile()
      return {
        ...p,
        [currentUser.userId]: {
          ...cur,
          cards: cur.cards.map(c => ({ ...c, isDefault: c.id === id }))
        }
      }
    })
  }, [currentUser])

  const toggleFavorite = useCallback((id) => {
    if (!currentUser?.userId) return
    setProfiles(p => {
      const cur = p[currentUser.userId] || blankProfile()
      const has = cur.favorites.includes(id)
      return {
        ...p,
        [currentUser.userId]: {
          ...cur,
          favorites: has ? cur.favorites.filter(x => x !== id) : [...cur.favorites, id]
        }
      }
    })
  }, [currentUser])

  // ---- BOOKINGS ----------------------------------------------------------
  const addBooking = useCallback((booking) => {
    const id = 'BK' + Math.floor(10000 + Math.random() * 90000)
    const userId = currentUser?.userId
    if (!userId) return null
    const record = { ...booking, id, userId, userName: currentUser.name, createdAt: new Date().toISOString() }
    setBookings(b => [record, ...b])
    // Notify the owning company
    addNotification({
      audience: 'company',
      companyId: booking.companyId,
      title: 'New booking received',
      message: `${currentUser.name} booked booking #${id} — ${booking.pickupDate} → ${booking.returnDate}.`,
      kind: 'booking',
      meta: { bookingId: id }
    })
    return id
  }, [currentUser, addNotification])

  const updateBooking = useCallback((id, patch) => {
    setBookings(bs => bs.map(b => b.id === id ? { ...b, ...patch } : b))
  }, [])

  // User modifies their own booking
  const modifyMyBooking = useCallback((id, patch) => {
    const b = bookings.find(x => x.id === id)
    if (!b) return
    updateBooking(id, patch)
    // Notify company
    addNotification({
      audience: 'company',
      companyId: b.companyId,
      title: 'Booking modified by customer',
      message: `Booking #${id} was updated by the customer.`,
      kind: 'booking',
      meta: { bookingId: id }
    })
  }, [bookings, updateBooking, addNotification])

  // Company modifies a booking
  const companyModifyBooking = useCallback((id, patch, note) => {
    const b = bookings.find(x => x.id === id)
    if (!b) return
    updateBooking(id, patch)
    addNotification({
      audience: 'user',
      userId: b.userId,
      title: 'Your booking was updated',
      message: note || `The rental company has updated booking #${id}.`,
      kind: 'booking',
      meta: { bookingId: id }
    })
  }, [bookings, updateBooking, addNotification])

  // Company sends an alternative offer
  const sendAlternativeOffer = useCallback((bookingId, offer) => {
    const b = bookings.find(x => x.id === bookingId)
    if (!b) return
    updateBooking(bookingId, { alternativeOffer: offer, status: 'Offer pending' })
    addNotification({
      audience: 'user',
      userId: b.userId,
      title: 'Alternative offer available',
      message: offer.reason ? `Regarding booking #${bookingId}: ${offer.reason}` : `You have a new offer on booking #${bookingId}.`,
      kind: 'offer',
      meta: { bookingId, offer }
    })
  }, [bookings, updateBooking, addNotification])

  // ---- CARS / FLEET ------------------------------------------------------
  const updateCarStatus = useCallback((id, status) => {
    setCars(cs => cs.map(c => c.id === id ? { ...c, status } : c))
  }, [])

  const updateCar = useCallback((id, patch) => {
    setCars(cs => cs.map(c => c.id === id ? { ...c, ...patch } : c))
  }, [])

  const addMaintenanceRecord = useCallback((record) => {
    const id = 'M' + Math.random().toString(36).slice(2, 8).toUpperCase()
    setMaintenanceRecords(arr => [{ id, createdAt: new Date().toISOString(), ...record }, ...arr])
    return id
  }, [])

  const closeMaintenanceRecord = useCallback((carId, closeData) => {
    setMaintenanceRecords(arr => arr.map(r =>
      r.carId === carId && !r.closedAt
        ? { ...r, ...closeData, closedAt: new Date().toISOString() }
        : r
    ))
  }, [])

  // ---- COMPANIES (suspension) -------------------------------------------
  const suspendCompany = useCallback((companyId, reason) => {
    setCompanies(cs => cs.map(c => c.id === companyId ? { ...c, status: 'suspended', suspensionReason: reason, suspendedAt: new Date().toISOString() } : c))
    addNotification({
      audience: 'company',
      companyId,
      title: 'Account suspended',
      message: `Your account has been suspended. Reason: ${reason}. You have a 2-week notice to collect any cars from cross-branch operations or related issues before the suspension is enforced.`,
      kind: 'suspension'
    })
  }, [addNotification])

  const unsuspendCompany = useCallback((companyId) => {
    setCompanies(cs => cs.map(c => c.id === companyId ? { ...c, status: 'active', suspensionReason: undefined, suspendedAt: undefined } : c))
  }, [])

  // ---- VERIFICATIONS (admin actions) -----------------------------------
  const reviewVerification = useCallback((verificationId, action, reason) => {
    const v = verifications.find(x => x.id === verificationId)
    if (!v) return
    const status = action === 'approve' ? 'Approved' : action === 'reject' ? 'Rejected' : 'Resubmit requested'
    setVerifications(vs => vs.map(x => x.id === verificationId ? { ...x, status, reason, reviewedAt: new Date().toISOString() } : x))
    // Sync to the user profile if it's a real user
    setProfiles(p => {
      const cur = p[v.userId]
      if (!cur) return p
      return { ...p, [v.userId]: { ...cur, verification: { ...(cur.verification || {}), status, rejectionReason: reason } } }
    })
    const titleMap = {
      approve:  'Verification approved',
      reject:   'Verification rejected',
      resubmit: 'Please resubmit documents'
    }
    const messageMap = {
      approve:  'Your identity verification has been approved. You can now book cars without restrictions.',
      reject:   `Your verification was rejected. Reason: ${reason || 'No reason provided.'}`,
      resubmit: `Please resubmit your documents. ${reason ? 'Requirements: ' + reason : ''}`
    }
    addNotification({
      audience: 'user',
      userId: v.userId,
      title: titleMap[action],
      message: messageMap[action],
      kind: 'verification'
    })
  }, [verifications, addNotification])

  // ---- DERIVED -----------------------------------------------------------
  const userProfile = currentUser?.userId ? profiles[currentUser.userId] : null
  const favorites     = userProfile?.favorites || []
  const cards         = userProfile?.cards || []
  const verification  = userProfile?.verification || null

  const myBookings = currentUser?.role === 'user'
    ? bookings.filter(b => b.userId === currentUser.userId)
    : []

  const companyBookings = currentUser?.role === 'company'
    ? bookings.filter(b => b.companyId === currentUser.companyId)
    : []

  const value = useMemo(() => ({
    // auth
    currentUser, isLoggedIn, isVerified,
    login, register, logout,
    // profile
    updateProfile, saveVerification, addCard, removeCard, setDefaultCard,
    favorites, toggleFavorite, cards, verification,
    // settings + i18n + currency
    settings, updateSettings, t,
    formatPrice, convertPrice, currency: settings.currency,
    // bookings
    bookings, setBookings, myBookings, companyBookings,
    addBooking, updateBooking, modifyMyBooking, companyModifyBooking, sendAlternativeOffer,
    // verifications
    verifications, setVerifications, reviewVerification,
    // catalog
    cars, setCars, updateCarStatus, updateCar,
    maintenanceRecords, addMaintenanceRecord, closeMaintenanceRecord,
    companies, setCompanies, suspendCompany, unsuspendCompany,
    branches,
    users: allUsers, allUsers,
    // notifications
    notifications, myNotifications, addNotification,
    markNotificationRead, markAllNotificationsRead,
    // booking flow
    pendingBooking, setPendingBooking,
    searchQuery, setSearchQuery
  }), [
    currentUser, isLoggedIn, isVerified,
    registry, profiles, settings, bookings, verifications,
    cars, companies, notifications, maintenanceRecords, roleSettings,
    pendingBooking, searchQuery, allUsers, myNotifications,
    login, register, logout,
    updateProfile, saveVerification, addCard, removeCard, setDefaultCard,
    toggleFavorite, addBooking, updateBooking, modifyMyBooking,
    companyModifyBooking, sendAlternativeOffer, reviewVerification,
    updateCarStatus, updateCar, addMaintenanceRecord, closeMaintenanceRecord,
    suspendCompany, unsuspendCompany, addNotification, markNotificationRead,
    markAllNotificationsRead, updateSettings, t, formatPrice, convertPrice
  ])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export const useApp = () => {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside AppProvider')
  return ctx
}
