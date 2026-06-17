import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import WhatsAppButton from './components/WhatsAppButton'
import ScrollManager from './components/ScrollManager'
import Home from './pages/Home'
import AIStaffPage from './pages/AIStaffPage'
import AutomatedMarketingPage from './pages/AutomatedMarketingPage'

export default function App() {
  return (
    <BrowserRouter>
      <ScrollManager />
      <div className="min-h-screen bg-navy">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/ai-staff" element={<AIStaffPage />} />
            <Route path="/automated-marketing" element={<AutomatedMarketingPage />} />
          </Routes>
        </main>
        <Footer />
        <WhatsAppButton />
      </div>
    </BrowserRouter>
  )
}
