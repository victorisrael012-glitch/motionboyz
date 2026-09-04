import { useState, useRef, useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import { Menu, ShoppingCart, Volume2, VolumeX } from 'lucide-react'
import { CartProvider, useCart } from './context/CartContext'
import { NavMenu } from './components/Navbar'
import ProductGrid from './components/ProductGrid'
import CartDrawer from './components/CartDrawer'
import heroImage from './assets/hero.jpeg'
import migosSong from './assets/migos.wav'

const SPOTIFY_URL = 'https://open.spotify.com/artist/76irK3Smknj0BHypJS65Ux?si=Ei4fBHmoSPeSYBjc7sG5xA&utm_source=copy-link'

// Spotify SVG icon (official brand mark)
function SpotifyIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="w-5 h-5 fill-[#1DB954] shrink-0"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  )
}

// Global audio player — persists across the whole app
function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.volume = 0.4
    audio.loop = true
  }, [])

  const toggle = () => {
    const audio = audioRef.current
    if (!audio) return
    if (playing) {
      audio.pause()
      setPlaying(false)
    } else {
      audio.play()
      setPlaying(true)
    }
  }

  return (
    <>
      <audio ref={audioRef} src={migosSong} preload="auto" />
      <button
        onClick={toggle}
        className="fixed bottom-6 left-6 z-50 w-11 h-11 bg-black text-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-800 transition-colors cursor-pointer"
        aria-label={playing ? 'Mute music' : 'Play music'}
        title={playing ? 'Mute music' : 'Play music'}
      >
        {playing ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
      </button>
    </>
  )
}

// Hamburger + cart overlay always visible on hero
function HeroControls({ onMenuOpen }: { onMenuOpen: () => void }) {
  const { cartCount, setIsCartOpen } = useCart()

  return (
    <div className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-5 pt-5 pointer-events-none">
      {/* Hamburger — left */}
      <button
        onClick={onMenuOpen}
        className="pointer-events-auto w-11 h-11 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors cursor-pointer"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5 text-black" />
      </button>

      {/* Cart — right */}
      <button
        onClick={() => setIsCartOpen(true)}
        className="pointer-events-auto relative w-11 h-11 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors cursor-pointer"
        aria-label="Open cart"
      >
        <ShoppingCart className="w-5 h-5 text-black" />
        {cartCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-black text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
            {cartCount > 9 ? '9+' : cartCount}
          </span>
        )}
      </button>
    </div>
  )
}

// Full-viewport hero image
function HeroSection({ onMenuOpen }: { onMenuOpen: () => void }) {
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ height: '100dvh' }}
    >
      <HeroControls onMenuOpen={onMenuOpen} />

      <img
        src={heroImage}
        alt="MOTIONBOYZ hero"
        className="absolute inset-0 w-full h-full"
        style={{
          objectFit: 'cover',
          objectPosition: 'center 60%',
        }}
      />
    </section>
  )
}

// Brand statement section below hero
function BrandSection() {
  return (
    <section className="bg-white w-full py-20 px-4 flex flex-col items-center justify-center text-center">
      <h1
        className="text-black font-black uppercase tracking-tighter leading-none"
        style={{ fontSize: 'clamp(3rem, 12vw, 9rem)' }}
      >
        MOTIONBOYZ
      </h1>

      <p className="mt-4 text-gray-500 text-lg sm:text-xl font-medium tracking-wide">
        MB swag — are you down like that?
      </p>

      {/* Spotify link */}
      <a
        href={SPOTIFY_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 flex items-center gap-2 hover:opacity-70 transition-opacity"
        aria-label="Listen on Spotify"
      >
        <SpotifyIcon />
        <span className="text-sm font-semibold text-gray-700 tracking-widest uppercase">
          Migos — Out Now
        </span>
      </a>
    </section>
  )
}

function AppContent() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Full-viewport hero */}
      <HeroSection onMenuOpen={() => setMenuOpen(true)} />

      {/* Slide-in nav menu */}
      <NavMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

      <main className="flex-1">
        {/* Brand statement */}
        <BrandSection />

        {/* Divider */}
        <div className="w-full h-px bg-gray-100" />

        {/* Product grid */}
        <ProductGrid />
      </main>

      {/* No footer */}

      <CartDrawer />

      {/* Global audio player — bottom left, all pages */}
      <AudioPlayer />

      <Toaster
        position="bottom-right"
        toastOptions={{
          style: { borderRadius: '12px', fontWeight: 500, fontSize: '14px' },
        }}
      />
    </div>
  )
}

export default function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  )
}
