"use client"
import { useState } from "react"
import type { CheckoutData } from "./CheckoutClient"

const PAYMENT_LABELS: Record<string, string> = {
  "mollie-card":       "💳 Credit / Debit Card",
  "mollie-ideal":      "🏦 iDEAL",
  "mollie-klarna":     "🩷 Klarna — Pay in 3",
  "mollie-bancontact": "🇧🇪 Bancontact",
  "mollie-sofort":     "🇩🇪 SOFORT Banking",
  "paypal":            "🅿️ PayPal",
  "stripe":            "📱 Apple Pay / Google Pay",
  "manual":            "🏛️ Bank Transfer",
}

type Props = {
  data: CheckoutData
  onBack: () => void
  onConfirm: (orderId: string) => void
}

export default function ReviewStep({ data, onBack, onConfirm }: Props) {
  const [placing, setPlacing] = useState(false)
  const [agreed, setAgreed]   = useState(false)

  const handlePlace = async () => {
    if (!agreed) return
    setPlacing(true)

    // In production: call Medusa cart completion API here
    // const cart = await sdk.store.cart.complete(cartId)
    await new Promise((r) => setTimeout(r, 1800))

    const mockOrderId = `ML-${Date.now().toString(36).toUpperCase()}`
    setPlacing(false)
    onConfirm(mockOrderId)
  }

  const address = data.shippingAddress

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl font-bold text-charcoal-900 mb-1">Review Your Order</h2>
        <p className="text-sm text-gray-400 font-sans">Please check everything looks correct before placing your order.</p>
      </div>

      {/* Summary sections */}
      {[
        {
          title: "📍 Delivery Address",
          content: (
            <div className="text-sm font-sans text-gray-600 space-y-0.5">
              <p className="font-semibold text-charcoal-800">{address.firstName} {address.lastName}</p>
              <p>{address.address1}{address.address2 ? `, ${address.address2}` : ""}</p>
              <p>{address.city}, {address.postalCode.toUpperCase()}</p>
              <p>{address.countryCode.toUpperCase()}</p>
              {address.phone && <p>{address.phone}</p>}
            </div>
          ),
        },
        {
          title: "🚚 Shipping Method",
          content: (
            <div className="text-sm font-sans text-gray-600">
              <p className="font-semibold text-charcoal-800">{data.shippingMethodLabel}</p>
              <p>{data.shippingPrice === 0 ? "Free" : `£${(data.shippingPrice / 100).toFixed(2)}`}</p>
            </div>
          ),
        },
        {
          title: "💳 Payment",
          content: (
            <p className="text-sm font-sans text-charcoal-800 font-semibold">
              {PAYMENT_LABELS[data.paymentProvider] || data.paymentProvider}
            </p>
          ),
        },
      ].map((s) => (
        <div key={s.title} className="border border-gray-100 rounded-xl p-4">
          <p className="text-xs font-sans font-bold text-gray-400 uppercase tracking-wider mb-2">{s.title}</p>
          {s.content}
        </div>
      ))}

      {data.giftWrap && (
        <div className="border border-gold-200 rounded-xl p-4 bg-cream-50">
          <p className="text-xs font-sans font-bold text-gold-600 uppercase tracking-wider mb-1">🎁 Gift Wrapping</p>
          {data.giftMessage && (
            <p className="text-sm font-sans text-gray-600 italic">"{data.giftMessage}"</p>
          )}
        </div>
      )}

      {/* Personalisation reminder */}
      <div className="border border-amber-200 bg-amber-50 rounded-xl p-4">
        <p className="text-sm font-sans font-semibold text-amber-800 mb-1">✏️ Personalisation confirmation</p>
        <p className="text-xs font-sans text-amber-700">
          After placing your order, you'll receive an email summarising all your personalisation details.
          Please review it carefully — production begins once confirmed.
        </p>
      </div>

      {/* Terms agreement */}
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="mt-0.5 w-4 h-4 accent-gold-500 flex-shrink-0"
        />
        <p className="text-xs font-sans text-gray-500 leading-relaxed">
          I agree to the{" "}
          <a href="/terms" className="text-gold-600 underline">Terms of Service</a>,{" "}
          <a href="/privacy-policy" className="text-gold-600 underline">Privacy Policy</a>, and understand that personalised items cannot be returned unless faulty.
        </p>
      </label>

      <div className="flex gap-3">
        <button onClick={onBack} className="btn-outline flex-1 py-4">← Back</button>
        <button
          onClick={handlePlace}
          disabled={!agreed || placing}
          className={`flex-1 py-4 rounded-full font-sans font-bold text-base transition-all
            ${agreed && !placing ? "bg-gold-500 hover:bg-gold-600 text-white shadow-gold-md" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}
        >
          {placing ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Placing Order…
            </span>
          ) : (
            "Place Order 🎁"
          )}
        </button>
      </div>
    </div>
  )
}
