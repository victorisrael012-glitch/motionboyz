import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, LogOut, ShoppingBag, Package, Settings, Eye, EyeOff, ChevronRight } from 'lucide-react'
import { supabase } from '../lib/supabase'
import type { Order } from '../context/CartContext'
import { products as initialProducts } from '../data/products'

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'motionboyz2026'
const SESSION_KEY = 'mb_admin_session'

// ── Login Screen ──────────────────────────────────────────────
function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      localStorage.setItem(SESSION_KEY, 'true')
      onLogin()
    } else {
      setError('Incorrect password. Try again.')
      setPassword('')
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-white tracking-widest">MOTIONBOYZ</h1>
          <p className="text-gray-400 text-sm mt-2 tracking-wide">Members Area</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type={show ? 'text' : 'password'}
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError('') }}
              placeholder="Enter password"
              className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-500 rounded-xl px-4 py-3.5 pr-12 text-sm focus:outline-none focus:border-white/30 transition-colors"
              autoFocus
            />
            <button
              type="button"
              onClick={() => setShow(!show)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors cursor-pointer"
            >
              {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {error && <p className="text-red-400 text-xs">{error}</p>}

          <button
            type="submit"
            className="w-full bg-white text-black font-bold py-3.5 rounded-xl text-sm tracking-wide hover:bg-gray-100 active:scale-95 transition-all cursor-pointer"
          >
            <Lock className="w-4 h-4 inline mr-2" />
            Enter
          </button>
        </form>
      </div>
    </div>
  )
}

// ── Orders Tab ────────────────────────────────────────────────
function OrdersTab() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchOrders() {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('date', { ascending: false })

      if (error) {
        console.error('Failed to fetch orders:', error.message)
      } else {
        setOrders(data || [])
      }
      setLoading(false)
    }
    fetchOrders()
  }, [])

  const formatPrice = (n: number) =>
    new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(n)

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <p className="text-gray-500 text-sm">Loading orders...</p>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <ShoppingBag className="w-12 h-12 text-gray-700 mb-4" />
        <p className="text-gray-500">No orders yet. They'll appear here after successful payments.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <p className="text-gray-400 text-sm">{orders.length} order{orders.length !== 1 ? 's' : ''} total</p>
      {orders.map((order) => (
        <div key={order.id} className="bg-white/5 border border-white/10 rounded-2xl p-5">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-white font-bold text-sm">{order.reference}</p>
              <p className="text-gray-500 text-xs mt-0.5">{formatDate(order.date)}</p>
            </div>
            <span className="bg-green-500/10 text-green-400 text-xs font-bold px-3 py-1 rounded-full border border-green-500/20">
              PAID
            </span>
          </div>
          <div className="space-y-1 mb-3">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-gray-300">{item.name} × {item.quantity}</span>
                <span className="text-gray-400">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-white/10 pt-3 flex justify-between">
            <span className="text-gray-400 text-sm">Total</span>
            <span className="text-white font-bold text-sm">{formatPrice(order.total)}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Products Tab ──────────────────────────────────────────────
function ProductsTab() {
  const [productList, setProductList] = useState(
    initialProducts.map((p) => ({ ...p, outOfStock: false }))
  )

  const [editingPrice, setEditingPrice] = useState<number | null>(null)
  const [tempPrice, setTempPrice] = useState('')

  const toggleStock = (id: number) => {
    setProductList((prev) =>
      prev.map((p) => (p.id === id ? { ...p, outOfStock: !p.outOfStock } : p))
    )
  }

  const startEdit = (id: number, price: number) => {
    setEditingPrice(id)
    setTempPrice(String(price))
  }

  const savePrice = (id: number) => {
    const val = parseInt(tempPrice)
    if (!isNaN(val) && val > 0) {
      setProductList((prev) => prev.map((p) => (p.id === id ? { ...p, price: val } : p)))
    }
    setEditingPrice(null)
  }

  const formatPrice = (n: number) =>
    new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(n)

  return (
    <div className="space-y-3">
      <p className="text-gray-400 text-sm">{productList.length} products</p>
      {productList.map((product) => (
        <div key={product.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-4">
          <img
            src={product.image}
            alt={product.name}
            className="w-14 h-14 object-contain rounded-lg bg-white flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold text-sm truncate">{product.name}</p>
            <div className="flex items-center gap-2 mt-1">
              {editingPrice === product.id ? (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={tempPrice}
                    onChange={(e) => setTempPrice(e.target.value)}
                    className="bg-white/10 text-white text-xs px-2 py-1 rounded-lg w-24 focus:outline-none border border-white/20"
                    autoFocus
                  />
                  <button
                    onClick={() => savePrice(product.id)}
                    className="text-green-400 text-xs font-bold cursor-pointer hover:text-green-300"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingPrice(null)}
                    className="text-gray-500 text-xs cursor-pointer hover:text-white"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => startEdit(product.id, product.price)}
                  className="text-gray-400 text-xs hover:text-white transition-colors cursor-pointer"
                >
                  {formatPrice(product.price)} ✎
                </button>
              )}
            </div>
          </div>
          <button
            onClick={() => toggleStock(product.id)}
            className={`text-xs font-bold px-3 py-1.5 rounded-full border transition-colors cursor-pointer flex-shrink-0 ${
              product.outOfStock
                ? 'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20'
                : 'bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/20'
            }`}
          >
            {product.outOfStock ? 'Out of Stock' : 'In Stock'}
          </button>
        </div>
      ))}
    </div>
  )
}

// ── Settings Tab ──────────────────────────────────────────────
function SettingsTab() {
  const [newPassword, setNewPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [msg, setMsg] = useState('')

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword.length < 6) { setMsg('Password must be at least 6 characters.'); return }
    if (newPassword !== confirm) { setMsg('Passwords do not match.'); return }
    setMsg('Password updated. Update VITE_ADMIN_PASSWORD in your .env to make it permanent.')
    setNewPassword(''); setConfirm('')
  }

  return (
    <div className="max-w-md space-y-8">
      <div>
        <h3 className="text-white font-bold mb-4">Change Admin Password</h3>
        <form onSubmit={handleSave} className="space-y-3">
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New password"
            className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white/30"
          />
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Confirm new password"
            className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white/30"
          />
          {msg && <p className="text-yellow-400 text-xs">{msg}</p>}
          <button
            type="submit"
            className="bg-white text-black font-bold px-6 py-2.5 rounded-xl text-sm hover:bg-gray-100 active:scale-95 transition-all cursor-pointer"
          >
            Save Password
          </button>
        </form>
      </div>

      <div className="border-t border-white/10 pt-6">
        <h3 className="text-white font-bold mb-2">Store Info</h3>
        <div className="space-y-1 text-sm text-gray-400">
          <p>Store: <span className="text-white">MOTIONBOYZ</span></p>
          <p>Currency: <span className="text-white">NGN (₦)</span></p>
          <p>Payment: <span className="text-white">Paystack</span></p>
        </div>
      </div>
    </div>
  )
}

// ── Main Admin Page ───────────────────────────────────────────
type Tab = 'orders' | 'products' | 'settings'

export default function AdminPage() {
  const navigate = useNavigate()
  const [authed, setAuthed] = useState(() => localStorage.getItem(SESSION_KEY) === 'true')
  const [tab, setTab] = useState<Tab>('orders')

  const logout = () => {
    localStorage.removeItem(SESSION_KEY)
    setAuthed(false)
  }

  if (!authed) return <LoginScreen onLogin={() => setAuthed(true)} />

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'orders', label: 'Orders', icon: <ShoppingBag className="w-4 h-4" /> },
    { id: 'products', label: 'Products', icon: <Package className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="text-gray-400 hover:text-white transition-colors cursor-pointer text-sm flex items-center gap-1"
          >
            ← Store
          </button>
          <span className="text-white/20">|</span>
          <h1 className="text-white font-black tracking-widest text-sm">MEMBERS</h1>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 bg-white/5 p-1 rounded-xl w-fit">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                tab === t.id
                  ? 'bg-white text-black'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {t.icon}
              {t.label}
              {tab === t.id && <ChevronRight className="w-3 h-3" />}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {tab === 'orders' && <OrdersTab />}
        {tab === 'products' && <ProductsTab />}
        {tab === 'settings' && <SettingsTab />}
      </div>
    </div>
  )
}
