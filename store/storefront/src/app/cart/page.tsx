import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Your Cart | MemoryLane Gifts",
}

export default function CartPage() {
  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="font-serif text-3xl font-bold text-charcoal-900 mb-8">Your Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Cart items (empty state) */}
          <div className="lg:col-span-2">
            <div className="flex flex-col items-center justify-center py-20 text-center bg-cream-50 rounded-2xl border border-gold-100">
              <span className="text-6xl mb-4">🛍️</span>
              <h2 className="font-serif text-2xl font-bold text-charcoal-900 mb-2">Your cart is empty</h2>
              <p className="text-gray-500 font-sans mb-6">Browse our personalised gifts and find something special.</p>
              <Link href="/shop" className="btn-primary">Browse Gifts</Link>
            </div>
          </div>

          {/* Order summary */}
          <div>
            <div className="bg-cream-50 rounded-2xl border border-gold-100 p-6 space-y-4">
              <h2 className="font-serif text-xl font-bold text-charcoal-900">Order Summary</h2>
              <div className="space-y-2 text-sm font-sans text-gray-500">
                <div className="flex justify-between"><span>Subtotal</span><span>—</span></div>
                <div className="flex justify-between"><span>Shipping</span><span>Calculated at checkout</span></div>
                <div className="flex justify-between"><span>Gift wrapping</span><span>Free on $50+</span></div>
              </div>
              <div className="border-t border-gold-200 pt-3">
                <div className="flex justify-between font-sans font-bold text-charcoal-900">
                  <span>Total</span><span>—</span>
                </div>
              </div>

              {/* Gift options */}
              <div className="space-y-3 pt-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 accent-gold-500" />
                  <span className="text-sm font-sans text-charcoal-800">Add gift wrapping 🎁</span>
                  <span className="ml-auto text-xs text-gray-400 font-sans">Free on $50+</span>
                </label>
                <div>
                  <label className="block text-sm font-sans font-medium text-charcoal-800 mb-1">Gift message (optional)</label>
                  <textarea
                    placeholder="Add a message to include with the order…"
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-sans focus:outline-none focus:ring-2 focus:ring-gold-400 resize-none"
                  />
                </div>
              </div>

              {/* Discount code */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Discount code"
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-sm font-sans focus:outline-none focus:ring-2 focus:ring-gold-400"
                />
                <button className="px-4 py-2 border border-gold-400 text-gold-600 rounded-xl text-sm font-sans hover:bg-gold-50 transition-colors">
                  Apply
                </button>
              </div>

              <button className="w-full btn-primary py-4 text-base" disabled>
                Checkout →
              </button>

              <div className="flex justify-center gap-4 pt-2">
                {["💳", "🅿️", "🍎"].map((icon, i) => (
                  <span key={i} className="text-xl opacity-60">{icon}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
