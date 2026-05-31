"use client"
import Link from "next/link"
import type { CheckoutData } from "./CheckoutClient"

type Props = {
  orderId: string
  data: CheckoutData
}

export default function OrderConfirmed({ orderId, data }: Props) {
  return (
    <div className="min-h-screen bg-cream-50 flex items-center justify-center px-4 py-20">
      <div className="max-w-lg w-full text-center">
        {/* Success animation */}
        <div className="w-24 h-24 bg-gold-100 rounded-full flex items-center justify-center mx-auto mb-6 text-5xl animate-fade-in">
          🎉
        </div>

        <h1 className="font-serif text-4xl font-bold text-charcoal-900 mb-3">
          Order Confirmed!
        </h1>
        <p className="text-gray-500 font-sans mb-2">
          Thank you for your order. We're so excited to make something beautiful for you.
        </p>
        <p className="font-mono text-sm bg-gold-50 border border-gold-200 text-gold-700 px-4 py-2 rounded-full inline-block mb-8">
          Order #{orderId}
        </p>

        {/* What happens next */}
        <div className="bg-white rounded-2xl border border-gold-100 shadow-sm p-6 text-left mb-6">
          <h2 className="font-serif text-lg font-bold text-charcoal-900 mb-4">What happens next?</h2>
          <div className="space-y-4">
            {[
              {
                step: "1",
                icon: "📧",
                title: "Check your email",
                desc: `A confirmation has been sent to ${data.email}. It includes all your personalisation details — please review them carefully.`,
              },
              {
                step: "2",
                icon: "✏️",
                title: "We start crafting",
                desc: "Once you've confirmed your personalisation details, our team begins production. Most items are ready in 1-4 days.",
              },
              {
                step: "3",
                icon: "📦",
                title: "It ships to you",
                desc: `You'll receive a dispatch email with tracking. Estimated delivery via ${data.shippingMethodLabel}.`,
              },
            ].map((s) => (
              <div key={s.step} className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-gold-100 text-gold-600 flex items-center justify-center font-bold text-sm flex-shrink-0 font-sans">
                  {s.step}
                </div>
                <div>
                  <p className="font-sans font-semibold text-sm text-charcoal-800 flex items-center gap-2">
                    <span>{s.icon}</span> {s.title}
                  </p>
                  <p className="text-xs text-gray-500 font-sans mt-0.5 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* NFC setup reminder */}
        <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4 text-left mb-6">
          <p className="text-sm font-sans font-semibold text-purple-800 mb-1">✨ Set up your NFC card</p>
          <p className="text-xs font-sans text-purple-700">
            If you ordered an NFC card, you can set or update its linked content any time at{" "}
            <span className="font-mono">memorylane.gifts/nfc/setup</span> using your order number.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/shop" className="btn-primary flex-1 text-center">
            Continue Shopping
          </Link>
          <Link href="/faq" className="btn-outline flex-1 text-center">
            FAQs
          </Link>
        </div>

        <p className="text-xs text-gray-400 font-sans mt-6">
          Questions? Chat with us on{" "}
          <a href="https://wa.me/447700900000" className="text-gold-600 underline">WhatsApp</a>{" "}
          or email{" "}
          <a href="mailto:hello@memorylane.gifts" className="text-gold-600 underline">hello@memorylane.gifts</a>
        </p>
      </div>
    </div>
  )
}
