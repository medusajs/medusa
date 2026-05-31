import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "How It Works | Personalised Gifts",
  description: "Learn how our laser engraving, UV/DTF printing, and NFC smart card technology creates truly unique personalised gifts.",
}

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen">
      <div className="bg-cream-100 border-b border-gold-200 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-charcoal-900 mb-4">
            How It Works
          </h1>
          <p className="text-gray-500 font-sans text-lg max-w-2xl mx-auto">
            Every gift is made to order with precision craftsmanship and genuine care. Here's how we bring your vision to life.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
        {/* The 3 Steps */}
        <section>
          <h2 className="font-serif text-3xl font-bold text-charcoal-900 text-center mb-12">
            Three Simple Steps
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { step: "1", icon: "🛍️", title: "Choose Your Gift", desc: "Browse our collection and select the perfect product. Filter by occasion, product type, or price. Every item is designed to be meaningful." },
              { step: "2", icon: "✏️", title: "Personalise It", desc: "Fill in your personalisation details — names, dates, messages, photos, and more. Our guided form ensures nothing is missed." },
              { step: "3", icon: "📦", title: "We Craft & Deliver", desc: "Your order goes into our production queue. We craft, quality-check, and dispatch with beautiful packaging. Estimated delivery shown at checkout." },
            ].map((s) => (
              <div key={s.step} className="text-center">
                <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-full bg-gold-100 border-2 border-gold-300 text-4xl mb-5 mx-auto">
                  {s.icon}
                  <span className="absolute -top-2 -right-2 w-7 h-7 bg-gold-500 text-white text-xs font-bold rounded-full flex items-center justify-center font-sans">
                    {s.step}
                  </span>
                </div>
                <h3 className="font-serif text-xl font-bold text-charcoal-900 mb-3">{s.title}</h3>
                <p className="text-gray-500 font-sans text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Technologies */}
        <section className="space-y-12">
          <h2 className="font-serif text-3xl font-bold text-charcoal-900 text-center">
            Our Crafting Technologies
          </h2>

          {[
            {
              icon: "⚡",
              title: "Laser Engraving",
              color: "from-amber-50 to-orange-50 border-amber-200",
              points: [
                "CO₂ and fibre laser systems for wood, metal, acrylic, leather, and glass",
                "Depth and precision that never fades — permanent and durable",
                "Up to 0.1mm accuracy for fine text and detailed designs",
                "Production time: 1-3 business days depending on complexity",
              ],
            },
            {
              icon: "🖨️",
              title: "UV/DTF Printing",
              color: "from-blue-50 to-sky-50 border-blue-200",
              points: [
                "UV-cured inks bond directly to the substrate — scratch and fade resistant",
                "Full CMYK + white ink for vibrant colour on any surface",
                "DTF (Direct-to-Film) transfers for soft, flexible surfaces like fabric and cushions",
                "Photo-realistic quality at up to 1200 DPI",
              ],
            },
            {
              icon: "✨",
              title: "NFC Smart Cards",
              color: "from-purple-50 to-violet-50 border-purple-200",
              points: [
                "ISO 14443 NFC chip embedded in premium card stock",
                "Works with all NFC-enabled smartphones — no app download required",
                "Link to any URL: YouTube, Google Photos, iCloud, Dropbox, or your own site",
                "Update your linked content any time after purchase via our NFC portal",
                "Gold or rose gold foil printing on 400gsm luxury card",
              ],
            },
          ].map((t) => (
            <div key={t.title} className={`rounded-2xl bg-gradient-to-br ${t.color} border p-8`}>
              <div className="flex items-center gap-4 mb-5">
                <span className="text-4xl">{t.icon}</span>
                <h3 className="font-serif text-2xl font-bold text-charcoal-900">{t.title}</h3>
              </div>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {t.points.map((p) => (
                  <li key={p} className="flex items-start gap-3 text-sm font-sans text-gray-600">
                    <span className="text-gold-500 mt-0.5 flex-shrink-0">✓</span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        {/* Production timeline */}
        <section className="bg-charcoal-900 rounded-3xl p-8 text-white">
          <h2 className="font-serif text-2xl font-bold mb-6 text-center">Production & Delivery Timeline</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-sans">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-2 pr-4 text-gold-400 font-semibold">Product Type</th>
                  <th className="text-left py-2 pr-4 text-gold-400 font-semibold">Production</th>
                  <th className="text-left py-2 text-gold-400 font-semibold">Shipping</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {[
                  ["NFC Smart Cards", "1 business day", "1-3 days standard"],
                  ["Laser Engraved (small)", "1-2 business days", "1-3 days standard"],
                  ["Laser Engraved (large)", "2-3 business days", "1-3 days standard"],
                  ["Printed Products", "2-3 business days", "1-3 days standard"],
                  ["Gift Bundles", "3-4 business days", "1-3 days standard"],
                ].map(([type, prod, ship]) => (
                  <tr key={type}>
                    <td className="py-3 pr-4 text-gray-300">{type}</td>
                    <td className="py-3 pr-4 text-gray-300">{prod}</td>
                    <td className="py-3 text-gray-300">{ship}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-gray-500 text-xs mt-4 text-center font-sans">
            Express dispatch available at checkout. All times are business days.
          </p>
        </section>

        <div className="text-center">
          <Link href="/shop" className="btn-primary text-lg px-10 py-4">
            Start Personalising
          </Link>
        </div>
      </div>
    </div>
  )
}
