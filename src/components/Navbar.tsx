import { X, ShoppingCart } from 'lucide-react'
import { useCart } from '../context/CartContext'
import logoImg from '../assets/logo.jpg'

interface NavMenuProps {
  isOpen: boolean
  onClose: () => void
}

export function NavMenu({ isOpen, onClose }: NavMenuProps) {
  const { cartCount, setIsCartOpen } = useCart()

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40"
          onClick={onClose}
        />
      )}

      {/* Slide-in drawer */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-black z-50 flex flex-col transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo + close button */}
        <div className="flex items-center justify-between px-6 py-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <img src={logoImg} alt="MOTIONBOYZ logo" className="w-10 h-10 rounded-full object-cover" />
            <span className="text-white text-lg font-black tracking-widest">MOTIONBOYZ</span>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-300 transition-colors cursor-pointer"
            aria-label="Close menu"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex flex-col px-6 py-8 gap-6 flex-1">
          <a
            href="#"
            onClick={onClose}
            className="text-white text-2xl font-bold tracking-wide hover:text-gray-300 transition-colors"
          >
            Home
          </a>
          <a
            href="#shop"
            onClick={onClose}
            className="text-white text-2xl font-bold tracking-wide hover:text-gray-300 transition-colors"
          >
            Shop
          </a>
          <a
            href="/admin"
            onClick={onClose}
            className="text-white text-2xl font-bold tracking-wide hover:text-gray-300 transition-colors"
          >
            Members
          </a>
        </nav>

        {/* Cart link at bottom */}
        <div className="px-6 py-6 border-t border-white/10">
          <button
            onClick={() => { setIsCartOpen(true); onClose() }}
            className="flex items-center gap-3 text-white hover:text-gray-300 transition-colors cursor-pointer w-full"
          >
            <ShoppingCart className="w-5 h-5" />
            <span className="font-semibold">Cart</span>
            {cartCount > 0 && (
              <span className="ml-auto bg-white text-black text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </aside>
    </>
  )
}
