import { Link } from 'react-router-dom'
import wirralW from '../assets/wirral-w.webp'
import { useChat } from '../lib/chatContext'

const footerLinks = [
  { label: 'Services', to: '/#services' },
  { label: 'Our Work', to: '/#portfolio' },
  { label: 'Pricing', to: '/#pricing' },
  { label: 'FAQ', to: '/#faq' },
]

const nicheLinks = [
  { label: 'Restaurants & Cafes', to: '/restaurants' },
  { label: 'Trades & Home Services', to: '/trades' },
  { label: 'Clinics & Salons', to: '/clinics-salons' },
]

const areas = ['Wirral', 'Liverpool', 'Manchester', 'Chester']

export default function Footer() {
  const { openChat } = useChat()

  return (
    <footer className="relative bg-navy-deep border-t border-white/5 px-5 sm:px-8 py-14 sm:py-16">
      <div className="max-w-6xl mx-auto">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <img src={wirralW} alt="Wirral AI" className="w-7 h-7 object-contain" />
              <span className="font-display font-semibold text-lg text-white">
                Wirral<span className="text-gradient">ai</span>
              </span>
            </Link>
            <p className="text-mist text-sm leading-relaxed mb-4">
              Professional websites for UK businesses that generate enquiries and get results.
              Based across the North West.
            </p>
            <p className="text-mist/60 text-xs">Serving {areas.join(', ')} and surrounding areas.</p>
          </div>

          {/* Site links */}
          <div>
            <p className="text-white text-sm font-medium mb-4">Website</p>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-mist text-sm hover:text-white transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Industries */}
          <div>
            <p className="text-white text-sm font-medium mb-4">Industries</p>
            <ul className="space-y-2">
              {nicheLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-mist text-sm hover:text-white transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <div>
            <p className="text-white text-sm font-medium mb-4">Get started</p>
            <p className="text-mist text-sm mb-4">Free 20-minute discovery call. No commitment, no sales pressure.</p>
            <button
              onClick={() => openChat('starter')}
              className="block w-full text-center bg-brand-gradient text-navy text-sm font-semibold px-5 py-2.5 rounded-full hover:opacity-90 transition-opacity mb-3"
            >
              Book a free call
            </button>
            <a
              href="https://masterclass.wirral.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center text-sm text-green border border-green/30 rounded-full px-5 py-2.5 hover:bg-green/5 transition-colors"
            >
              AI Masterclass →
            </a>
          </div>
        </div>

        <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <p className="text-mist/50 text-xs">&copy; {new Date().getFullYear()} Wirral AI. All rights reserved.</p>
          <p className="text-mist/50 text-xs">Web Design Wirral · Website Design Liverpool · Business Websites North West</p>
        </div>
      </div>
    </footer>
  )
}
