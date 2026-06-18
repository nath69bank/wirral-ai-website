import { Link } from 'react-router-dom'
import { ArrowRight, Home } from 'lucide-react'
import Seo from '../components/Seo'
import { pillars } from '../data/pillars'

export default function NotFoundPage() {
  return (
    <>
      <Seo
        title="Page Not Found"
        description="This page doesn't exist on Wirral AI."
        path="/404"
        noindex
      />
      <section className="relative min-h-[80vh] flex flex-col items-center justify-center bg-navy px-5 sm:px-8 pt-32 pb-20 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-mist mb-4">404</p>
        <h1 className="font-display text-3xl sm:text-5xl font-semibold text-white mb-4">
          That page doesn't exist
        </h1>
        <p className="text-mist text-base sm:text-lg max-w-md mb-8">
          The link might be out of date, or the page may have moved. Here's where you probably
          meant to go instead.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-brand-gradient text-navy text-sm font-semibold px-6 py-3 rounded-full hover:opacity-90 transition-opacity"
          >
            <Home className="w-4 h-4" />
            Back to homepage
          </Link>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          {pillars.map((pillar) => (
            <Link
              key={pillar.id}
              to={pillar.path}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-mist hover:text-white transition-colors"
            >
              {pillar.name}
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}
