import { Link } from 'react-router-dom'
import wirralW from '../assets/wirral-w.webp'
import { useChat } from '../lib/chatContext'
import { niches } from '../data/niches'

const serviceAreas = ['Wirral', 'Liverpool', 'Manchester', 'Chester']
const footerLinks = [
  { label: 'AI Staff', to: '/ai-staff' },
  { label: 'Automated Marketing', to: '/automated-marketing' },
  { label: 'Pricing', to: '/#pricing' },
  { label: 'FAQ', to: '/#faq' },
]

export default function Footer() {
  const { openChat } = useChat()

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
            <p className="text-mist text-xs mt-4">
              Serving {serviceAreas.join(', ')}.
            </p>
          </div>

          <div className="flex flex-wrap gap-x-10 gap-y-8">
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
              <p className="text-white text-sm font-medium mb-3">Industries</p>
              <ul className="space-y-2">
                {niches.map((niche) => (
                  <li key={niche.slug}>
                    <Link to={`/${niche.slug}`} className="text-mist text-sm hover:text-white transition-colors">
                      {niche.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-white text-sm font-medium mb-3">Get started</p>
              <button
                onClick={() => openChat('general')}
                className="text-mist text-sm hover:text-white transition-colors"
              >
                Chat with us
              </button>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <p className="text-mist text-xs">&copy; {new Date().getFullYear()} Wirral AI. All rights reserved.</p>
          <p className="text-mist text-xs">UK-based team. No outsourcing. No contracts.</p>
        </div>
      </div>
    </footer>
  )
}
