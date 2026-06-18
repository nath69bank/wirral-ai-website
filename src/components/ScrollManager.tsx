import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * On every route change: scroll to top by default, or to the element matching
 * the URL hash if one is present (e.g. navigating to "/#pricing" from another
 * page). Polls briefly for the target element since a freshly-mounted page's
 * content may not exist in the DOM yet on the very next frame.
 */
export default function ScrollManager() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0)
      return
    }

    const id = hash.replace('#', '')
    let attempts = 0
    const maxAttempts = 40 // ~2s ceiling, plenty for a route to mount
    let timeoutId: number

    const tryScroll = () => {
      const el = document.getElementById(id)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        return
      }
      attempts += 1
      if (attempts < maxAttempts) {
        timeoutId = window.setTimeout(tryScroll, 50)
      }
    }

    tryScroll()
    return () => window.clearTimeout(timeoutId)
  }, [pathname, hash])

  return null
}
