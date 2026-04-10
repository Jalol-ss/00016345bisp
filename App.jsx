# RentRoad UZ — BISP Car Rental Marketplace

A modern, responsive, **multi-tenant** car rental marketplace built for BISP coursework.
RentRoad UZ unifies every rental company in Uzbekistan into a single national platform — users can compare cars across all companies, pick up at one branch, and drop off at another, while every rental company logs into its own scoped dashboard.

Built with **React + Vite + TailwindCSS + React Router + Recharts + Leaflet + Lucide Icons**.

---

## 🔑 Demo login credentials

The login page includes one-click demo buttons for every account. You can also type them manually.

### Platform accounts

| Role  | Email                | Password    | Redirects to         |
|-------|----------------------|-------------|----------------------|
| User  | user@bispdemo.com    | User123!    | `/` (home)           |
| Admin | admin@bispdemo.com   | Admin123!   | `/admin/dashboard`   |

### Rental company accounts (each one sees only its own data)

| Company              | Email                       | Password         | City      |
|----------------------|-----------------------------|------------------|-----------|
| Silk Road Rentals    | tashkentrent@gmail.com      | Tashkent123!     | Tashkent  |
| Tashkent Auto Hire   | andijanrent@gmail.com       | Andijan123!      | Andijan   |
| Samarkand Wheels     | samarkandrent@gmail.com     | Samarkand123!    | Samarkand |
| Bukhara Drive        | bukhararent@gmail.com       | Bukhara123!      | Bukhara   |
| Fergana Valley Cars  | ferganarent@gmail.com       | Fergana123!      | Fergana   |

All five company accounts redirect to `/company/dashboard` and only see their own branches, fleet, bookings, customers, maintenance and revenue.

### Registering a new user

The Register form creates a **real new account** stored in `localStorage` (not a demo profile). New users:

- Start with **zero bookings**, **zero saved cards**, **no verification**, and an **empty favourites list**.
- Get logged in automatically and routed to home.
- Can re-login later with the same email/password.
- Cannot register with an email that already exists in the demo accounts or in the registry.

---

## ✨ Features

### 🚗 User side
- Hero search with cross-branch (one-way) rentals
- Featured cars, partner companies, testimonials
- **Find Cars** page with filters (price, type, fuel, transmission, seats, **company with rating**, branch, AC, rating) and sorting. The company dropdown supports `?company=ID` URL parameters so other pages can deep-link a filtered view.
- **Car details** page with full specs, reviews, and a live booking sidebar
- **Real Leaflet map view** with OpenStreetMap tiles, geolocation, fly-to animations, branch popups and a "View {company} cars →" link that filters the Find Cars page to that company only
- **Multi-step booking flow** (`/book/:id`) — Details → Verification → Payment → Review → Confirmation
- **Identity verification** required before final booking (skipped automatically once approved)
- **My Bookings** with tabs (Upcoming / Active / Completed / Cancelled) — fully scoped to the logged-in user
- **Profile dashboard** with eight working tabs:
  - Overview, Verification (showing all saved fields + Update documents button), **Payments** (add/remove/default cards with empty state), Favorites, Notifications, **Settings** (light/dark theme, English/Russian/Uzbek language, UZS/USD/RUB currency), **Security** (account ID, change password, change email, privacy policy), **Help & Support** (24/7 phone, email, contact form)

### 🏢 Company dashboard (`/company`)
Every company sees only its own data:
- **Overview** dynamically calculated from the company's own cars, bookings, branches, and revenue (greeting and stats are personalised to the logged-in company)
- **Fleet** management scoped to that company's vehicles
- **Branches** management scoped to that company's locations
- **Bookings** scoped to that company's reservations
- **Customers** showing only users who have actually rented from this company, with their total spend
- **Maintenance** queue showing only this company's vehicles
- **Reports** with monthly revenue, revenue by model, cancellation trend — all from this company's data
- **Settings** auto-loaded from the company's record (name, headquarters, founded year, etc.)

### 🛡️ Admin dashboard (`/admin`)
- Global platform overview, companies/users/bookings/verifications management, fleet oversight, reports, support, and platform settings.

### 🎯 Business rules implemented
- Users must log in before booking — booking destination is preserved across login
- Users must verify identity before confirming a booking — verification is skipped if already approved
- Users must add a payment card before payment — handled inside the booking flow
- **Users** see only their own bookings, cards, verification, favourites and notifications
- **Companies** see only their own branches, cars, bookings, customers, maintenance and revenue
- **Admin** sees the entire platform
- Cross-branch (one-way) rentals fully supported

---

## 💳 Booking flow

The booking wizard at `/book/:id` has 5 steps:

1. **Details** — pickup/return dates, branches, add-ons, insurance, promo code, price summary
2. **Verification** — only shown if the user hasn't verified yet; saves to their profile
3. **Payment** — pick an existing card or add a new one; cards are stored on the user profile
4. **Review** — final summary
5. **Confirmation** — booking is added to the user's bookings list (also visible to the company)

The flow gracefully skips Verification if the user is already verified.

---

## 💱 Currency

Prices are stored as base USD (e.g. `45`) and rendered through `formatPrice(usd)` from `AppContext`.
Default currency is **UZS (so'm)**. Users can switch to **USD ($)** or **RUB (₽)** from `Profile → Settings → Currency`. The selection is saved to their profile and applied app-wide.

Approximate rates used for the demo: `1 USD ≈ 12,500 UZS ≈ 90 RUB`.

---

## 🌗 Theme & language

`Profile → Settings` lets each user choose:
- **Theme**: Light or Dark (toggles a `dark` class on `<html>`)
- **Language**: English / Русский / O'zbek
- **Currency**: UZS / USD / RUB

Settings are stored per-user in `localStorage`.

---

## 🏢 How company separation works

1. `companies.js` defines six rental companies. Five of them (`c1`–`c5`) are linked to the five demo company accounts in `DEMO_ACCOUNTS`.
2. When a company logs in, `currentUser` gets `{ role: 'company', companyId: 'c?' }`.
3. Every company page derives its data from `currentUser.companyId`:
   - `Fleet` filters `cars` by `companyId`
   - `Branches` filters `branches` by `companyId`
   - `CompanyBookings` and `Reports` filter `bookings` by `companyId`
   - `Customers` filters `users` to those who have at least one booking with this company
   - `Dashboard` calculates revenue, utilization, fleet mix and active rentals from this company's data only
   - `CompanySettings` loads the company name, headquarters, and founded year from the company record
4. `CompanyShell` enforces a hard auth gate: anyone who isn't a logged-in company is shown the `<AuthRequired>` screen.

A company logged in as Silk Road Rentals will never see Samarkand Wheels' fleet, bookings, customers or revenue — and vice versa.

---

## 🔐 Authentication logic

1. `AppContext` exports `DEMO_ACCOUNTS` containing the admin, demo user and five company accounts.
2. `login(email, password)` first checks `DEMO_ACCOUNTS`, then the registry of newly registered users in `localStorage`. On success it sets `currentUser` (persisted to `sessionStorage`) and returns `{ ok, redirect }`.
3. `register(name, email, password)` validates uniqueness, creates a fresh user id `u_xxx`, attaches a `blankProfile()` (no cards, no verification, no bookings), and logs the new user in.
4. `logout()` clears `currentUser` and the sessionStorage key.
5. Protected pages render `<AuthRequired>` if the role doesn't match.
6. `myBookings` is derived from `bookings.filter(b => b.userId === currentUser.userId)` — a fresh user always sees zero bookings.

---

## 🗺️ Map logic

Real interactive Leaflet map with OpenStreetMap tiles (no API keys needed):

- Browser geolocation with graceful fallback to Tashkent
- Smooth `flyTo` animations on city/branch selection
- Custom branded SVG branch pins via `L.divIcon`
- Branch popups link to `/find-cars?company={companyId}` so the user lands on a Find Cars page already filtered to that single company
- Sidebar sorts branches by Haversine distance to the anchor

---

## 📁 Folder structure

```
bisp-car-rental/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── README.md
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    ├── context/
    │   └── AppContext.jsx       # Global state, DEMO_ACCOUNTS, login/register/logout, profiles, currency
    ├── data/
    │   ├── companies.js         # 6 rental companies
    │   ├── branches.js          # branches across UZ cities
    │   ├── cars.js              # demo vehicles
    │   ├── bookings.js          # seed bookings
    │   └── users.js             # demo users + reviews
    ├── components/
    │   ├── Navbar.jsx
    │   ├── Footer.jsx
    │   ├── UserLayout.jsx
    │   ├── DashboardLayout.jsx
    │   ├── SearchForm.jsx
    │   ├── CarCard.jsx
    │   ├── StatCard.jsx
    │   ├── Badge.jsx
    │   ├── Modal.jsx
    │   ├── AuthRequired.jsx
    │   └── SupportWidget.jsx
    └── pages/
        ├── user/                # Home, FindCars, CarDetails, MapView, MyBookings, Verification, Profile, Auth, BookingFlow, FAQ, Contact
        ├── company/             # CompanyShell + Dashboard, Fleet, Branches, CompanyBookings, Customers, Maintenance, Reports, CompanySettings
        └── admin/               # AdminShell + admin pages
```

---

## 🚀 Getting started

```bash
cd bisp-car-rental
npm install
npm run dev
```

The app opens at **http://localhost:5173**. Production build: `npm run build && npm run preview`. Requires Node 18+.

---

## 📝 Assumptions & limitations

- Authentication is mocked but behaves as a real role-based system via `sessionStorage` (auth) and `localStorage` (registry, profiles, bookings).
- All domain data lives in JS modules — no real database. Newly registered users, their cards, verification and bookings are persisted to the browser's `localStorage` and survive page reloads but not browser-data clears.
- Currency conversion uses static demo rates; in production these would come from a live FX API.
- The map uses free OpenStreetMap tiles — no Google Maps or Mapbox API keys are required.
- Geolocation uses the browser API and needs HTTPS or `localhost`.
- Email/password reset, change-email and contact-form submissions are simulated client-side (they show a success state but do not actually send email).
- File upload in the verification form accepts any file but does not actually upload it anywhere.
- Card numbers are masked but **not** validated against real payment networks — this is a UI demo, not a payment processor.

---

## 🎓 BISP coursework notes

The project demonstrates component-based architecture, centralised state management via React Context, real role-based interfaces on a single SPA, multi-tenant data scoping (per-company dashboards), genuine business logic (login + verification + payment gates that preserve booking state), and realistic data modelling for a national car rental marketplace.

Made with ♥ for the BISP coursework demo.
