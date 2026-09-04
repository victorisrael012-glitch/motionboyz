import { usePaystackPayment } from 'react-paystack'
import { useCart } from '../context/CartContext'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

export default function CheckoutButton() {
  const { cartTotal, clearCart, setIsCartOpen, cartItems } = useCart()

  const reference = `ref_${new Date().getTime()}`

  const config = {
    reference,
    email: 'customer@example.com',
    amount: cartTotal * 100,
    publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_test_placeholder',
  }

  const onSuccess = async () => {
    // Save order to Supabase
    const { error } = await supabase.from('orders').insert({
      reference,
      items: cartItems,
      total: cartTotal,
      status: 'paid',
    })

    if (error) {
      console.error('Failed to save order:', error.message)
    }

    toast.success('Payment successful! Order confirmed.', { duration: 4000 })
    clearCart()
    setIsCartOpen(false)
  }

  const onClose = () => {
    toast('Payment cancelled.', { icon: '⚠️' })
  }

  const initializePayment = usePaystackPayment(config)

  return (
    <button
      onClick={() => initializePayment({ onSuccess, onClose })}
      className="w-full bg-black hover:bg-gray-900 active:scale-95 text-white font-bold py-3.5 px-6 rounded-xl transition-all duration-200 text-sm tracking-wide cursor-pointer"
    >
      Checkout — {new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(cartTotal)}
    </button>
  )
}
