import { products } from '../data/products'
import ProductCard from './ProductCard'

export default function ProductGrid() {
  return (
    <section id="shop" className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-12">
          <span className="inline-block bg-black text-white text-sm font-semibold px-4 py-1.5 rounded-full mb-3">
            Our Collection
          </span>
        </div>

        {/* Grid — 3 columns, images float on white */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-14">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
