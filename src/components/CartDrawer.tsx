import { X, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react'
import { useCart } from '../context/CartContext'
import CheckoutButton from './CheckoutButton'

export default function CartDrawer() {
  const { cartItems, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart()

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(price)

  return (
    <>
      {/* Backdrop */}
      {isCartOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 transition-opacity"
          onClick={() => setIsCartOpen(false)}
        />
      )}

      {/* Drawer */}
      <aside
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white z-50 shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-black" />
            <h2 className="text-lg font-bold text-gray-900">Your Cart</h2>
            {cartCount > 0 && (
              <span className="bg-black text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {cartCount}
              </span>
            )}
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label="Close cart"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-4 py-20">
              <ShoppingBag className="w-16 h-16 text-gray-200" />
              <p className="text-gray-400 font-medium">Your cart is empty</p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="text-sm text-black hover:underline cursor-pointer"
              >
                Continue shopping →
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="flex gap-4 p-3 rounded-xl bg-gray-50 border border-gray-100">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-20 object-cover rounded-lg flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 text-sm truncate">{item.name}</h4>
                  <p className="text-xs text-gray-400 mb-2">{item.category}</p>
                  <p className="text-black font-bold text-sm">{formatPrice(item.price)}</p>

                  {/* Quantity controls */}
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center hover:border-black transition-colors cursor-pointer"
                    >
                      <Minus className="w-3 h-3 text-gray-600" />
                    </button>
                    <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center hover:border-black transition-colors cursor-pointer"
                    >
                      <Plus className="w-3 h-3 text-gray-600" />
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => removeFromCart(item.id)}
                  className="self-start p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                  aria-label="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="border-t border-gray-100 px-6 py-5 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-500 text-sm">Subtotal</span>
              <span className="font-bold text-gray-900 text-lg">{formatPrice(cartTotal)}</span>
            </div>
            <p className="text-xs text-gray-400">Shipping calculated at checkout</p>
            <CheckoutButton />
          </div>
        )}
      </aside>
    </>
  )
}
