import { Heart, Images, Sparkles } from 'lucide-react'
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import { GalleryPage } from './pages/GalleryPage'
import { StudioPage } from './pages/StudioPage'

function AppHeader() {
  return <header className="site-header"><Link to="/" className="brand"><span className="brand-mark"><Sparkles size={16} /></span><span>MewMew <em>for Linh</em></span></Link><nav aria-label="Main navigation"><Link to="/gallery"><Images size={17} /> <span className="hidden sm:inline">Little gallery</span></Link></nav></header>
}

function App() {
  return <BrowserRouter><div className="site-frame"><AppHeader /><Routes><Route path="/" element={<StudioPage />} /><Route path="/gallery" element={<GalleryPage />} /></Routes><footer className="site-footer"><span>made with <Heart size={13} fill="currentColor" /> for tiny happy moments</span><span>local-first · private by default</span></footer></div></BrowserRouter>
}

export default App
