import { useEffect } from 'react'

interface SeoProps {
  title: string
  description: string
  path: string
  jsonLd?: Record<string, unknown>
}

const SITE_NAME = 'Wirral AI'
const SITE_URL = 'https://wirral.ai'
const JSON_LD_ID = 'page-json-ld'

function setMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function setCanonical(href: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', 'canonical')
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

function setJsonLd(data?: Record<string, unknown>) {
  const existing = document.getElementById(JSON_LD_ID)
  if (!data) {
    existing?.remove()
    return
  }
  let el = existing as HTMLScriptElement | null
  if (!el) {
    el = document.createElement('script')
    el.id = JSON_LD_ID
    el.type = 'application/ld+json'
    document.head.appendChild(el)
  }
  el.textContent = JSON.stringify(data)
}

/**
 * Sets per-page title, meta description, canonical URL, Open Graph tags and
 * optional JSON-LD structured data. Rendered once near the top of each page
 * component. Also captured by the build-time prerender script so crawlers
 * get the correct tags in the static HTML, not just after JS executes.
 */
export default function Seo({ title, description, path, jsonLd }: SeoProps) {
  useEffect(() => {
    const fullTitle = `${title} | ${SITE_NAME}`
    const url = `${SITE_URL}${path}`

    document.title = fullTitle
    setMeta('name', 'description', description)
    setCanonical(url)

    setMeta('property', 'og:title', fullTitle)
    setMeta('property', 'og:description', description)
    setMeta('property', 'og:url', url)
    setMeta('property', 'og:type', 'website')
    setMeta('property', 'og:site_name', SITE_NAME)

    setMeta('name', 'twitter:title', fullTitle)
    setMeta('name', 'twitter:description', description)

    setJsonLd(jsonLd)
    return () => setJsonLd(undefined)
  }, [title, description, path, jsonLd])

  return null
}
