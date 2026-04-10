import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import SupportWidget from './SupportWidget'

export default function UserLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar/>
      <main className="flex-1"><Outlet/></main>
      <Footer/>
      <SupportWidget/>
    </div>
  )
}
