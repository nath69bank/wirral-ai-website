import { useEffect } from 'react'

// /ai-staff now redirects to the Masterclass where all AI services live
export default function AIStaffPage() {
  useEffect(() => {
    window.location.replace('https://masterclass.wirral.ai')
  }, [])
  return null
}
