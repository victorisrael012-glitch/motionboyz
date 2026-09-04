import { Globe, MessageCircle, Send, Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-black text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl font-black text-white tracking-widest">MOTIONBOYZ</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
              MB swag — are you down like that? Premium gear for those who move different.
            </p>
            <div className="flex gap-3 mt-5">
              {[Globe, MessageCircle, Send, Mail].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Shop</h4>
            <ul className="space-y-2.5">
              {['All Items', 'New Arrivals', 'Best Sellers', 'Accessories', 'Apparel'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">{link}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Support</h4>
            <ul className="space-y-2.5">
              {['FAQ', 'Shipping Policy', 'Returns', 'Track Order', 'Contact Us'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">{link}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-gray-500">© 2026 MOTIONBOYZ. All rights reserved.</p>
          <p className="text-xs text-gray-500">Secure payments powered by <span className="text-white">Paystack</span></p>
        </div>
      </div>
    </footer>
  )
}
