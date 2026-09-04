import { useState } from 'react'
import { useCart } from '../context/CartContext'
import type { Product } from '../context/CartContext'

interface Props {
  product: Product
}

export default function ProductCard({ product }: Props) {
  const { addToCart } = useCart()
  const [hovered, setHovered] = useState(false)

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(price)

  const hasFrontBack = !!product.backImage

  return (
    <div
      className="flex flex-col items-center text-center cursor-pointer group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image — no card, no border, floats on white */}
      <div className="relative w-full" style={{ aspectRatio: '4/5' }}>
        {hasFrontBack ? (
          <>
            <img
              src={product.image}
              alt={`${product.name} front`}
              className="absolute inset-0 w-full h-full object-contain transition-opacity duration-500"
              style={{ opacity: hovered ? 0 : 1 }}
            />
            <img
              src={product.backImage}
              alt={`${product.name} back`}
              className="absolute inset-0 w-full h-full object-contain transition-opacity duration-500"
              style={{ opacity: hovered ? 1 : 0 }}
            />
          </>
        ) : (
          <img
            src={product.image}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-contain transition-transform duration-500"
            style={{ transform: hovered ? 'scale(1.04)' : 'scale(1)' }}
          />
        )}
      </div>

      {/* Name + price below image */}
      <div className="mt-3 space-y-1">
        <p className="text-sm font-semibold text-black tracking-wide">{product.name}</p>
        <div className="flex items-center justify-center gap-2">
          <span className="text-sm font-bold text-black">{formatPrice(product.price)}</span>
          {product.originalPrice && (
            <span className="text-sm text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
          )}
        </div>
        <button
          onClick={() => addToCart(product)}
          className="mt-2 text-xs font-bold tracking-widest uppercase text-white bg-black px-4 py-2 rounded-full hover:bg-gray-800 active:scale-95 transition-all duration-200 opacity-0 group-hover:opacity-100 cursor-pointer"
        >
          Add to Cart
        </button>
      </div>
    </div>
  )
}
