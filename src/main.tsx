import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

// Self-hosted fonts (no external Google Fonts request, faster + no third-party dependency)
// Latin-only subsets, since this is a UK-only site with no need for cyrillic/greek/vietnamese glyphs
import '@fontsource/space-grotesk/latin-500.css'
import '@fontsource/space-grotesk/latin-600.css'
import '@fontsource/ibm-plex-sans/latin-400.css'
import '@fontsource/ibm-plex-sans/latin-500.css'
import '@fontsource/ibm-plex-sans/latin-600.css'
import '@fontsource/ibm-plex-mono/latin-400.css'
import '@fontsource/ibm-plex-mono/latin-500.css'

import './index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
