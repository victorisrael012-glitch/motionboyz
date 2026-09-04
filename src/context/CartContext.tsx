import { createContext, useContext, useState, ReactNode } from 'react'

export interface Product {
  id: number
  name: string
  price: number
  originalPrice?: number
  category: string
  image: string
  backImage?: string
  description: string
}

export interface CartItem extends Product {
  quantity: number
}

export interface Order {
  id: string
  reference: string
  items: CartItem[]
  total: number
  date: string
  status: 'paid'
}

interface CartContextType {
  cartItems: CartItem[]
  addToCart: (product: Product) => void
  removeFromCart: (id: number) => void
  updateQuantity: (id: number, quantity: number) => void
  clearCart: () => void
  saveOrder: (reference: string) => void
  cartTotal: number
  cartCount: number
  isCartOpen: boolean
  setIsCartOpen: (open: boolean) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)

  const addToCart = (product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id)
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [...prev, { ...product, quantity: 1 }]
    })
    setIsCartOpen(true)
  }

  const removeFromCart = (id: number) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id))
  }

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id)
      return
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    )
  }

  const saveOrder = (reference: string) => {
    const order: Order = {
      id: `order_${Date.now()}`,
      reference,
      items: [...cartItems],
      total: cartTotal,
      date: new Date().toISOString(),
      status: 'paid',
    }
    const existing: Order[] = JSON.parse(localStorage.getItem('mb_orders') || '[]')
    localStorage.setItem('mb_orders', JSON.stringify([order, ...existing]))
  }

  const clearCart = () => setCartItems([])

  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        saveOrder,
        cartTotal,
        cartCount,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used inside CartProvider')
  return context
}
