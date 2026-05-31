"use client"
import { useState } from "react"

type PaymentProvider = {
  id: string
  name: string
  description: string
  icon: string
  methods?: string[]
  recommended?: boolean
}

const PAYMENT_PROVIDERS: PaymentProvider[] = [
  {
    id: "mollie-ideal",
    name: "iDEAL",
    description: "Instant bank transfer (Netherlands)",
    icon: "🏦",
    methods: [],
  },
  {
    id: "mollie-card",
    name: "Credit / Debit Card",
    description: "Visa, Mastercard, Amex via Mollie",
    icon: "💳",
    methods: ["Visa", "Mastercard", "Amex"],
    recommended: true,
  },
  {
    id: "paypal",
    name: "PayPal",
    description: "Pay with your PayPal account or PayPal Pay Later",
    icon: "🅿️",
    methods: [],
  },
  {
    id: "mollie-klarna",
    name: "Klarna",
    description: "Buy now, pay later in 3 instalments",
    icon: "🩷",
    methods: [],
  },
  {
    id: "mollie-bancontact",
    name: "Bancontact",
    description: "Belgian bank payment",
    icon: "🇧🇪",
    methods: [],
  },
  {
    id: "mollie-sofort",
    name: "SOFORT Banking",
    description: "Instant bank transfer (DE, AT, CH)",
    icon: "🇩🇪",
    methods: [],
  },
  {
    id: "stripe",
    name: "Apple Pay / Google Pay",
    description: "One-tap payment with your device wallet",
    icon: "📱",
    methods: [],
  },
  {
    id: "manual",
    name: "Bank Transfer",
    description: "Pay by BACS / SEPA — order held until payment clears",
    icon: "🏛️",
    methods: [],
  },
]

type Props = {
  total: number
  currencyCode: string
  onBack: () => void
  onNext: (data: { paymentProvider: string }) => void
}

export default function PaymentStep({ total, currencyCode, onBack, onNext }: Props) {
  const [selected, setSelected] = useState("mollie-card")
  const [cardNumber, setCardNumber] = useState("")
  const [expiry, setExpiry]       = useState("")
  const [cvc, setCvc]             = useState("")
  const [cardName, setCardName]   = useState("")

  const currency = currencyCode.toUpperCase()
  const symbol   = currency === "GBP" ? "£" : currency === "EUR" ? "€" : "$"

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl font-bold text-charcoal-900 mb-1">Payment</h2>
        <p className="text-sm text-gray-400 font-sans">
          All transactions are secured and encrypted. Choose your payment method below.
        </p>
      </div>

      {/* Payment method list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {PAYMENT_PROVIDERS.map((p) => (
          <label
            key={p.id}
            className="flex items-center gap-3 p-3 border-2 rounded-xl cursor-pointer transition-all"
            style={{
              borderColor:      selected === p.id ? "#c9962a" : "#e5e7eb",
              backgroundColor:  selected === p.id ? "#fdfbf3" : "white",
            }}
          >
            <input
              type="radio"
              name="payment"
              value={p.id}
              checked={selected === p.id}
              onChange={() => setSelected(p.id)}
              className="sr-only"
            />
            <span className="text-2xl">{p.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-sans font-semibold text-charcoal-800">{p.name}</span>
                {p.recommended && (
                  <span className="text-[10px] bg-gold-100 text-gold-700 font-sans font-bold px-1.5 py-0.5 rounded-full">Popular</span>
                )}
              </div>
              <p className="text-xs text-gray-400 font-sans truncate">{p.description}</p>
            </div>
            <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${selected === p.id ? "border-gold-500 bg-gold-500" : "border-gray-300"}`} />
          </label>
        ))}
      </div>

      {/* Card form — shown for Stripe and Mollie card */}
      {(selected === "mollie-card" || selected === "stripe") && (
        <div className="border border-gold-200 rounded-2xl p-5 bg-cream-50 space-y-4">
          <p className="text-sm font-sans font-semibold text-charcoal-800 flex items-center gap-2">
            <span>💳</span> Card Details
            <span className="ml-auto flex gap-1">
              {["VISA", "MC", "AMEX"].map((b) => (
                <span key={b} className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded font-bold font-sans">{b}</span>
              ))}
            </span>
          </p>
          <div>
            <label className="block text-xs font-sans font-medium text-charcoal-800 mb-1">Name on card</label>
            <input
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              placeholder="Jane Smith"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm font-sans focus:outline-none focus:ring-2 focus:ring-gold-400"
            />
          </div>
          <div>
            <label className="block text-xs font-sans font-medium text-charcoal-800 mb-1">Card number</label>
            <input
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim().slice(0, 19))}
              placeholder="1234 5678 9012 3456"
              maxLength={19}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm font-sans tracking-widest focus:outline-none focus:ring-2 focus:ring-gold-400"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-sans font-medium text-charcoal-800 mb-1">Expiry date</label>
              <input
                value={expiry}
                onChange={(e) => {
                  const v = e.target.value.replace(/\D/g, "")
                  setExpiry(v.length > 2 ? `${v.slice(0, 2)}/${v.slice(2, 4)}` : v)
                }}
                placeholder="MM/YY"
                maxLength={5}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm font-sans focus:outline-none focus:ring-2 focus:ring-gold-400"
              />
            </div>
            <div>
              <label className="block text-xs font-sans font-medium text-charcoal-800 mb-1">CVC / CVV</label>
              <input
                value={cvc}
                onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))}
                placeholder="123"
                maxLength={4}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm font-sans focus:outline-none focus:ring-2 focus:ring-gold-400"
              />
            </div>
          </div>
          <p className="text-xs text-gray-400 font-sans flex items-center gap-1">
            <span>🔒</span> Processed securely via Mollie. We never store card details.
          </p>
        </div>
      )}

      {/* PayPal flow notice */}
      {selected === "paypal" && (
        <div className="border border-blue-200 rounded-2xl p-5 bg-blue-50 text-center">
          <p className="text-sm font-sans text-blue-800 mb-3">
            You'll be redirected to PayPal to complete your payment securely.
          </p>
          <div className="text-3xl">🅿️</div>
          <p className="text-xs text-blue-600 font-sans mt-2">PayPal · Pay Later available</p>
        </div>
      )}

      {/* Klarna notice */}
      {selected === "mollie-klarna" && (
        <div className="border border-pink-200 rounded-2xl p-5 bg-pink-50">
          <p className="text-sm font-sans text-pink-800 font-semibold mb-1">Pay in 3 with Klarna</p>
          <p className="text-xs text-pink-600 font-sans">
            Split your {symbol}{(total / 100).toFixed(2)} into 3 interest-free payments.
            First payment today, then every 30 days. Subject to Klarna approval.
          </p>
        </div>
      )}

      {/* Bank transfer notice */}
      {selected === "manual" && (
        <div className="border border-gray-200 rounded-2xl p-5 bg-gray-50">
          <p className="text-sm font-sans text-gray-700 font-semibold mb-1">Bank Transfer Details</p>
          <p className="text-xs text-gray-500 font-sans mb-2">
            Your order will be reserved for 48 hours. Production begins once payment is received.
          </p>
          <div className="text-xs font-sans text-gray-600 space-y-1 font-mono">
            <p>Account name: MemoryLane Gifts Ltd</p>
            <p>Sort code: 04-00-75</p>
            <p>Account: 12345678</p>
            <p>IBAN: GB00 MONZ 0400 7512 3456 78</p>
          </div>
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <button onClick={onBack} className="btn-outline flex-1 py-4">← Back</button>
        <button
          onClick={() => onNext({ paymentProvider: selected })}
          className="btn-primary flex-1 py-4"
        >
          Review Order →
        </button>
      </div>
    </div>
  )
}
