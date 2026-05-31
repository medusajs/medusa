"use client"
import { useState } from "react"
import AddressStep from "./AddressStep"
import ShippingStep from "./ShippingStep"
import PaymentStep from "./PaymentStep"
import ReviewStep from "./ReviewStep"
import OrderConfirmed from "./OrderConfirmed"
import Link from "next/link"

export type CheckoutData = {
  email: string
  shippingAddress: {
    firstName: string
    lastName: string
    address1: string
    address2?: string
    city: string
    postalCode: string
    countryCode: string
    phone: string
  }
  shippingMethod: string
  shippingMethodLabel: string
  shippingPrice: number
  paymentProvider: string
  giftWrap: boolean
  giftMessage: string
}

const STEPS = ["Address", "Shipping", "Payment", "Review"] as const
type Step = typeof STEPS[number]

export default function CheckoutClient() {
  const [step, setStep] = useState<Step>("Address")
  const [confirmed, setConfirmed] = useState(false)
  const [orderId, setOrderId] = useState<string | null>(null)
  const [data, setData] = useState<Partial<CheckoutData>>({})

  const stepIndex = STEPS.indexOf(step)

  if (confirmed && orderId) {
    return <OrderConfirmed orderId={orderId} data={data as CheckoutData} />
  }

  return (
    <div className="min-h-screen bg-cream-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-gold-500 text-xl">✦</span>
            <span className="font-serif text-lg font-bold text-charcoal-900">MemoryLane Gifts</span>
          </Link>
          <div className="hidden sm:flex items-center gap-2">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`flex items-center gap-1.5 ${i < stepIndex ? "text-gold-600" : i === stepIndex ? "text-charcoal-900" : "text-gray-400"}`}>
                  <span className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center font-sans
                    ${i < stepIndex ? "bg-gold-500 text-white" : i === stepIndex ? "bg-charcoal-900 text-white" : "bg-gray-200 text-gray-500"}`}>
                    {i < stepIndex ? "✓" : i + 1}
                  </span>
                  <span className="text-sm font-sans font-medium">{s}</span>
                </div>
                {i < STEPS.length - 1 && <div className={`w-8 h-px ${i < stepIndex ? "bg-gold-400" : "bg-gray-200"}`} />}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main step area */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gold-100 p-6 sm:p-8">
              {step === "Address" && (
                <AddressStep
                  initial={data}
                  onNext={(addressData) => {
                    setData((d) => ({ ...d, ...addressData }))
                    setStep("Shipping")
                  }}
                />
              )}
              {step === "Shipping" && (
                <ShippingStep
                  countryCode={data.shippingAddress?.countryCode || "gb"}
                  onBack={() => setStep("Address")}
                  onNext={(shipping) => {
                    setData((d) => ({ ...d, ...shipping }))
                    setStep("Payment")
                  }}
                />
              )}
              {step === "Payment" && (
                <PaymentStep
                  total={4999}
                  currencyCode="GBP"
                  onBack={() => setStep("Shipping")}
                  onNext={(payment) => {
                    setData((d) => ({ ...d, ...payment }))
                    setStep("Review")
                  }}
                />
              )}
              {step === "Review" && (
                <ReviewStep
                  data={data as CheckoutData}
                  onBack={() => setStep("Payment")}
                  onConfirm={(id) => {
                    setOrderId(id)
                    setConfirmed(true)
                  }}
                />
              )}
            </div>
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <OrderSummary data={data} />
          </div>
        </div>
      </div>
    </div>
  )
}

function OrderSummary({ data }: { data: Partial<CheckoutData> }) {
  const MOCK_ITEMS = [
    { title: "Engraved Wooden Keychain", variant: "Maple Wood", personalization: "Sarah · 14 Feb · With love ♥", price: 1499, qty: 1 },
    { title: "NFC Birthday Card",        variant: "Gold Foil",  personalization: "Happy 30th!",                 price: 2499, qty: 1 },
  ]

  const subtotal = MOCK_ITEMS.reduce((s, i) => s + i.price * i.qty, 0)
  const shipping = data.shippingPrice ?? 0
  const giftWrap = data.giftWrap ? 0 : 0
  const total = subtotal + shipping + giftWrap

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gold-100 p-6 sticky top-24">
      <h3 className="font-serif text-lg font-bold text-charcoal-900 mb-4">Order Summary</h3>

      <div className="space-y-3 mb-5">
        {MOCK_ITEMS.map((item, i) => (
          <div key={i} className="flex gap-3">
            <div className="w-14 h-14 rounded-xl bg-cream-100 flex items-center justify-center text-2xl flex-shrink-0">🎁</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-sans font-semibold text-charcoal-800 truncate">{item.title}</p>
              <p className="text-xs text-gray-400 font-sans">{item.variant}</p>
              <p className="text-xs text-gold-600 font-sans italic truncate">{item.personalization}</p>
            </div>
            <div className="text-sm font-bold font-sans text-charcoal-800 flex-shrink-0">
              £{(item.price / 100).toFixed(2)}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-100 pt-4 space-y-2">
        <div className="flex justify-between text-sm font-sans text-gray-500">
          <span>Subtotal</span><span>£{(subtotal / 100).toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm font-sans text-gray-500">
          <span>Shipping</span>
          <span>{shipping === 0 ? "Free" : `£${(shipping / 100).toFixed(2)}`}</span>
        </div>
        {data.giftWrap && (
          <div className="flex justify-between text-sm font-sans text-green-600">
            <span>🎁 Gift wrapping</span><span>Free</span>
          </div>
        )}
      </div>

      <div className="border-t border-gold-200 mt-3 pt-3 flex justify-between font-sans font-bold text-charcoal-900">
        <span>Total</span>
        <span className="text-gold-600 text-lg">£{(total / 100).toFixed(2)}</span>
      </div>

      <div className="mt-5 space-y-2">
        <div className="flex items-center gap-2 text-xs text-gray-400 font-sans">
          <span>🔒</span><span>SSL encrypted checkout</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400 font-sans">
          <span>⚡</span><span>Order confirmed instantly</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400 font-sans">
          <span>📧</span><span>Personalisation review email sent</span>
        </div>
      </div>
    </div>
  )
}
