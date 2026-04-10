import { Routes, Route, Navigate } from 'react-router-dom'
import UserLayout from './components/UserLayout'

// User pages
import Home from './pages/user/Home'
import FindCars from './pages/user/FindCars'
import CarDetails from './pages/user/CarDetails'
import MapView from './pages/user/MapView'
import MyBookings from './pages/user/MyBookings'
import Verification from './pages/user/Verification'
import BookingFlow from './pages/user/BookingFlow'
import Profile from './pages/user/Profile'
import { Login, Register } from './pages/user/Auth'
import FAQ from './pages/user/FAQ'
import Contact from './pages/user/Contact'

// Company pages
import CompanyShell from './pages/company/CompanyShell'
import CompanyDashboard from './pages/company/Dashboard'
import Fleet from './pages/company/Fleet'
import Branches from './pages/company/Branches'
import CompanyBookings from './pages/company/CompanyBookings'
import Customers from './pages/company/Customers'
import Maintenance from './pages/company/Maintenance'
import Reports from './pages/company/Reports'
import CompanySettings from './pages/company/CompanySettings'

// Admin pages
import AdminShell from './pages/admin/AdminShell'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminCompanies from './pages/admin/AdminCompanies'
import AdminUsers from './pages/admin/AdminUsers'
import AdminBookings from './pages/admin/AdminBookings'
import AdminVerifications from './pages/admin/AdminVerifications'
import AdminFleet from './pages/admin/AdminFleet'
import AdminReports from './pages/admin/AdminReports'
import AdminSupport from './pages/admin/AdminSupport'
import AdminSettings from './pages/admin/AdminSettings'

export default function App() {
  return (
    <Routes>
      {/* Public auth routes (no main layout) */}
      <Route path="/login" element={<Login/>}/>
      <Route path="/register" element={<Register/>}/>

      {/* User-facing routes */}
      <Route element={<UserLayout/>}>
        <Route path="/" element={<Home/>}/>
        <Route path="/find-cars" element={<FindCars/>}/>
        <Route path="/car/:id" element={<CarDetails/>}/>
        <Route path="/book/:id" element={<BookingFlow/>}/>
        <Route path="/map-view" element={<MapView/>}/>
        <Route path="/bookings" element={<MyBookings/>}/>
        <Route path="/verification" element={<Verification/>}/>
        <Route path="/profile" element={<Profile/>}/>
        <Route path="/faq" element={<FAQ/>}/>
        <Route path="/contact" element={<Contact/>}/>
      </Route>

      {/* Company dashboard */}
      <Route path="/company" element={<CompanyShell/>}>
        <Route index element={<Navigate to="/company/dashboard" replace/>}/>
        <Route path="dashboard" element={<CompanyDashboard/>}/>
        <Route path="fleet" element={<Fleet/>}/>
        <Route path="branches" element={<Branches/>}/>
        <Route path="bookings" element={<CompanyBookings/>}/>
        <Route path="customers" element={<Customers/>}/>
        <Route path="maintenance" element={<Maintenance/>}/>
        <Route path="reports" element={<Reports/>}/>
        <Route path="settings" element={<CompanySettings/>}/>
      </Route>

      {/* Admin dashboard */}
      <Route path="/admin" element={<AdminShell/>}>
        <Route index element={<Navigate to="/admin/dashboard" replace/>}/>
        <Route path="dashboard" element={<AdminDashboard/>}/>
        <Route path="companies" element={<AdminCompanies/>}/>
        <Route path="users" element={<AdminUsers/>}/>
        <Route path="bookings" element={<AdminBookings/>}/>
        <Route path="verifications" element={<AdminVerifications/>}/>
        <Route path="fleet" element={<AdminFleet/>}/>
        <Route path="reports" element={<AdminReports/>}/>
        <Route path="support" element={<AdminSupport/>}/>
        <Route path="settings" element={<AdminSettings/>}/>
      </Route>

      <Route path="*" element={<Navigate to="/" replace/>}/>
    </Routes>
  )
}
