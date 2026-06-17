import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * On every route change: scroll to top by default, or to the element matching
 * the URL hash if one is present (e.g. navigating to "/#pricing" from another page).
 */
export default function ScrollManager() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      // Wait a tick for the new page's content to mount before measuring it
      const id = hash.replace('#', '')
      requestAnimationFrame(() => {
        const el = document.getElementById(id)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' })
          return
        }
        window.scrollTo(0, 0)
      })
    } else {
      window.scrollTo(0, 0)
    }
  }, [pathname, hash])

  return null
}
