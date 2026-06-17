import { Link } from 'react-router-dom'
import wirralW from '../assets/wirral-w.png'
import { buildWhatsAppLink, WHATSAPP_DEFAULT_MESSAGE } from '../lib/whatsapp'

const serviceAreas = ['Wirral', 'Liverpool', 'Manchester', 'Chester']
const footerLinks = [
  { label: 'AI Staff', to: '/ai-staff' },
  { label: 'Automated Marketing', to: '/automated-marketing' },
  { label: 'Pricing', to: '/#pricing' },
  { label: 'FAQ', to: '/#faq' },
]

export default function Footer() {
  return (
    <footer className="relative bg-navy-deep border-t border-white/5 px-5 sm:px-8 py-12 sm:py-14">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-10">
          <div className="max-w-sm">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <img src={wirralW} alt="Wirral AI" className="w-7 h-7 object-contain" />
              <span className="font-display font-semibold text-lg text-white">
                Wirral<span className="text-gradient">ai</span>
              </span>
            </Link>
            <p className="text-mist text-sm leading-relaxed">
              AI staff and automated marketing for trades, healthcare, hospitality and professional
              services across the North West.
            </p>
            <p className="text-mist/60 text-xs mt-4">
              Serving {serviceAreas.join(', ')}.
            </p>
          </div>

          <div className="flex gap-12 sm:gap-16">
            <div>
              <p className="text-white text-sm font-medium mb-3">Explore</p>
              <ul className="space-y-2">
                {footerLinks.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} className="text-mist text-sm hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-white text-sm font-medium mb-3">Get started</p>
              <a
                href={buildWhatsAppLink(WHATSAPP_DEFAULT_MESSAGE)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-mist text-sm hover:text-white transition-colors"
              >
                Message us on WhatsApp
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <p className="text-mist/50 text-xs">&copy; {new Date().getFullYear()} Wirral AI. All rights reserved.</p>
          <p className="text-mist/50 text-xs">UK-based team. No outsourcing. No contracts.</p>
        </div>
      </div>
    </footer>
  )
}
