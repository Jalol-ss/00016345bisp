import { Link } from 'react-router-dom'
import { Car, Facebook, Instagram, Twitter, Youtube, Mail, MapPin, Phone } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="mt-24 bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-6 py-14 grid md:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-xl bg-brand-500 grid place-items-center text-white"><Car className="w-5 h-5"/></div>
            <div className="font-bold text-white text-lg">RentRoad UZ</div>
          </div>
          <p className="text-sm leading-relaxed text-slate-400">
            The unified car rental marketplace of Uzbekistan. Compare cars from verified rental companies and pick up at one branch, drop off at another.
          </p>
          <div className="flex items-center gap-3 mt-5">
            <a className="w-9 h-9 grid place-items-center rounded-full bg-slate-800 hover:bg-brand-600 transition"><Facebook className="w-4 h-4"/></a>
            <a className="w-9 h-9 grid place-items-center rounded-full bg-slate-800 hover:bg-brand-600 transition"><Instagram className="w-4 h-4"/></a>
            <a className="w-9 h-9 grid place-items-center rounded-full bg-slate-800 hover:bg-brand-600 transition"><Twitter className="w-4 h-4"/></a>
            <a className="w-9 h-9 grid place-items-center rounded-full bg-slate-800 hover:bg-brand-600 transition"><Youtube className="w-4 h-4"/></a>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-3">Company</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-white">About</Link></li>
            <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
            <li><Link to="/faq" className="hover:text-white">FAQ</Link></li>
            <li><Link to="/" className="hover:text-white">Careers</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-3">Legal</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-white">Terms of Service</Link></li>
            <li><Link to="/" className="hover:text-white">Privacy Policy</Link></li>
            <li><Link to="/" className="hover:text-white">Rental Policy</Link></li>
            <li><Link to="/" className="hover:text-white">Insurance</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-3">Get in touch</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2"><MapPin className="w-4 h-4"/> Tashkent, Amir Temur Ave 15</li>
            <li className="flex items-center gap-2"><Phone className="w-4 h-4"/> +998 71 200 1010</li>
            <li className="flex items-center gap-2"><Mail className="w-4 h-4"/> hello@rentroad.uz</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-5 text-xs text-slate-500 flex flex-col md:flex-row gap-2 items-center justify-between">
          <div>© 2026 RentRoad UZ. All rights reserved. BISP coursework demo.</div>
          <div>Made with ♥ in Uzbekistan</div>
        </div>
      </div>
    </footer>
  )
}
