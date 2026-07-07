import { useEffect } from 'react'

// /automated-marketing now redirects to the Masterclass where all AI services live
export default function AutomatedMarketingPage() {
  useEffect(() => {
    window.location.replace('https://masterclass.wirral.ai')
  }, [])
  return null
}
