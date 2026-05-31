"use client"
import { useState } from "react"

type ShippingOption = {
  id: string
  name: string
  description: string
  price: number
  days: string
  icon: string
}

const UK_OPTIONS: ShippingOption[] = [
  { id: "standard", name: "Standard Delivery",   description: "Royal Mail Tracked 48",        price: 0,    days: "3-5 business days", icon: "📦" },
  { id: "express",  name: "Express Delivery",    description: "Royal Mail Tracked 24",        price: 399,  days: "1-2 business days", icon: "⚡" },
  { id: "next-day", name: "Next-Day Delivery",   description: "DPD Next Day before 1pm",      price: 799,  days: "Next business day",  icon: "🚀" },
]

const INTL_OPTIONS: ShippingOption[] = [
  { id: "standard-intl", name: "Standard International", description: "Royal Mail International Tracked", price: 899,  days: "7-14 business days", icon: "📦" },
  { id: "express-intl",  name: "Express International",  description: "DHL Express Worldwide",             price: 1999, days: "3-5 business days",  icon: "✈️" },
]

type Props = {
  countryCode: string
  onBack: () => void
  onNext: (data: { shippingMethod: string; shippingMethodLabel: string; shippingPrice: number }) => void
}

export default function ShippingStep({ countryCode, onBack, onNext }: Props) {
  const options = countryCode === "gb" ? UK_OPTIONS : INTL_OPTIONS
  const [selected, setSelected] = useState(options[0].id)

  const handleNext = () => {
    const opt = options.find((o) => o.id === selected)!
    onNext({ shippingMethod: opt.id, shippingMethodLabel: opt.name, shippingPrice: opt.price })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl font-bold text-charcoal-900 mb-1">Shipping Method</h2>
        <p className="text-sm text-gray-400 font-sans">
          Production time (1-4 days) + shipping time = estimated delivery shown below.
        </p>
      </div>

      <div className="space-y-3">
        {options.map((opt) => (
          <label key={opt.id} className="flex items-center gap-4 p-4 border-2 rounded-2xl cursor-pointer transition-all
            hover:border-gold-300 peer-checked:border-gold-500"
            style={{ borderColor: selected === opt.id ? "#c9962a" : "#e5e7eb", background: selected === opt.id ? "#fdfbf3" : "white" }}>
            <input
              type="radio"
              name="shipping"
              value={opt.id}
              checked={selected === opt.id}
              onChange={() => setSelected(opt.id)}
              className="sr-only"
            />
            <span className="text-2xl">{opt.icon}</span>
            <div className="flex-1">
              <p className="font-sans font-semibold text-sm text-charcoal-800">{opt.name}</p>
              <p className="text-xs text-gray-400 font-sans">{opt.description} · {opt.days}</p>
            </div>
            <div className="font-sans font-bold text-charcoal-800">
              {opt.price === 0 ? <span className="text-green-600">Free</span> : `£${(opt.price / 100).toFixed(2)}`}
            </div>
          </label>
        ))}
      </div>

      <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
        <p className="text-sm font-sans text-amber-800">
          <strong>⏱️ Personalised order note:</strong> Your item is made to order. We add 1-4 production days before dispatch.
          Total estimated delivery is shown per option.
        </p>
      </div>

      <div className="flex gap-3">
        <button onClick={onBack} className="btn-outline flex-1 py-4">← Back</button>
        <button onClick={handleNext} className="btn-primary flex-1 py-4">Continue to Payment →</button>
      </div>
    </div>
  )
}
