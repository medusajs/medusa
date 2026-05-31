import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Your Cart | MemoryLane Gifts",
}

const MOCK_ITEMS = [
  {
    id: "1",
    title: "Engraved Wooden Keychain",
    variant: "Maple Wood",
    personalization: "Sarah · 14 Feb 2025 · With all my love ♥",
    price: 1499,
    qty: 1,
    img: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=200",
    productionDays: 2,
  },
  {
    id: "2",
    title: "NFC Birthday Card",
    variant: "Gold Foil",
    personalization: "Happy 30th! · nfc.link/my-video",
    price: 2499,
    qty: 1,
    img: "https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=200",
    productionDays: 1,
  },
]

export default function CartPage() {
  const subtotal = MOCK_ITEMS.reduce((s, i) => s + i.price * i.qty, 0)

  return (
    <div className="min-h-screen bg-cream-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="font-serif text-3xl font-bold text-charcoal-900 mb-2">Your Cart</h1>
        <p className="text-gray-400 font-sans text-sm mb-8">{MOCK_ITEMS.length} item{MOCK_ITEMS.length !== 1 ? "s" : ""} in your cart</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart items */}
          <div className="lg:col-span-2 space-y-4">
            {MOCK_ITEMS.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl border border-gold-100 p-5 flex gap-4">
                <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-cream-100 flex-shrink-0">
                  <Image src={item.img} alt={item.title} fill className="object-cover" sizes="80px" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-serif font-semibold text-charcoal-900 text-sm">{item.title}</h3>
                  <p className="text-xs text-gray-400 font-sans">{item.variant}</p>
                  <div className="mt-1 bg-gold-50 border border-gold-200 rounded-lg px-2.5 py-1.5">
                    <p className="text-xs text-gold-700 font-sans italic">✏️ {item.personalization}</p>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2">
                      <button className="w-7 h-7 rounded-full border border-gray-200 text-sm font-sans hover:border-gold-400 transition-colors">−</button>
                      <span className="text-sm font-sans font-medium w-4 text-center">{item.qty}</span>
                      <button className="w-7 h-7 rounded-full border border-gray-200 text-sm font-sans hover:border-gold-400 transition-colors">+</button>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-400 font-sans">⏱️ {item.productionDays}d production</span>
                      <span className="font-sans font-bold text-gold-600">£{(item.price / 100).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                <button className="text-gray-300 hover:text-red-400 transition-colors self-start text-lg">×</button>
              </div>
            ))}

            <Link
              href="/shop"
              className="block text-center text-sm text-gold-600 hover:text-gold-700 font-sans underline underline-offset-4 py-2"
            >
              ← Continue Shopping
            </Link>
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gold-100 shadow-sm p-6 space-y-4 sticky top-24">
              <h2 className="font-serif text-xl font-bold text-charcoal-900">Order Summary</h2>

              <div className="space-y-2 text-sm font-sans text-gray-500">
                <div className="flex justify-between">
                  <span>Subtotal ({MOCK_ITEMS.length} items)</span>
                  <span>£{(subtotal / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Gift wrapping</span>
                  <span>Select at checkout</span>
                </div>
              </div>

              <div className="border-t border-gold-200 pt-3 flex justify-between font-sans font-bold text-charcoal-900">
                <span>Total</span>
                <span className="text-gold-600 text-xl">£{(subtotal / 100).toFixed(2)}</span>
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

              <Link href="/checkout" className="block w-full text-center btn-primary py-4 text-base font-bold">
                Checkout Securely 🔒
              </Link>

              {/* Payment icons */}
              <div className="flex items-center justify-center gap-3 pt-1">
                {["💳", "🅿️", "🩷", "🏦", "📱"].map((icon, i) => (
                  <span key={i} className="text-xl opacity-60">{icon}</span>
                ))}
              </div>
              <p className="text-center text-xs text-gray-400 font-sans">
                Card · PayPal · Klarna · iDEAL · Apple Pay
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
