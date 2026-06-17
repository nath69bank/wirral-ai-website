import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import wirralW from '../assets/wirral-w.png'
import { buildWhatsAppLink, WHATSAPP_DEFAULT_MESSAGE } from '../lib/whatsapp'

const links = [
  { label: 'AI Staff', to: '/ai-staff' },
  { label: 'Automated Marketing', to: '/automated-marketing' },
  { label: 'Pricing', to: '/#pricing' },
  { label: 'FAQ', to: '/#faq' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 animate-fade-down transition-colors duration-300 ${
        scrolled ? 'bg-navy/80 backdrop-blur-xl border-b border-white/5' : 'bg-transparent'
      }`}
    >
      <div className="flex items-center justify-between px-5 sm:px-8 lg:px-10 py-3.5 sm:py-4 max-w-7xl mx-auto">
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <img src={wirralW} alt="Wirral AI" className="w-7 h-7 sm:w-8 sm:h-8 object-contain" />
          <span className="font-display font-semibold text-base sm:text-lg text-white">
            Wirral<span className="text-gradient">ai</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-7">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-[13px] text-mist hover:text-white transition-colors whitespace-nowrap"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={buildWhatsAppLink(WHATSAPP_DEFAULT_MESSAGE)}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center bg-brand-gradient text-navy text-[13px] font-semibold px-4 sm:px-5 py-2 rounded-full hover:opacity-90 transition-opacity"
          >
            Start Free Trial
          </a>
          <button
            onClick={() => setOpen((o) => !o)}
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-full text-white hover:bg-white/10"
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden absolute left-4 right-4 top-full rounded-2xl bg-navy-deep/95 backdrop-blur-xl ring-1 ring-white/10 shadow-2xl px-5 py-3 animate-fade-up">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className="block text-[15px] text-white/85 hover:text-white py-2.5 border-b border-white/10 last:border-b-0"
            >
              {link.label}
            </Link>
          ))}
          <a
            href={buildWhatsAppLink(WHATSAPP_DEFAULT_MESSAGE)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="mt-3 block text-center bg-brand-gradient text-navy text-sm font-semibold px-5 py-2.5 rounded-full"
          >
            Start Free Trial
          </a>
        </div>
      )}
    </header>
  )
}
