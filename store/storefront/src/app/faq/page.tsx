import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "FAQs | MemoryLane Gifts",
  description: "Frequently asked questions about personalisation, production time, shipping, NFC cards, and returns.",
}

const FAQ_SECTIONS = [
  {
    category: "Personalisation",
    faqs: [
      {
        q: "How do I personalise my gift?",
        a: "On each product page you'll find a personalisation form. Fill in the relevant fields — names, dates, messages, and optionally upload a photo. We'll review your details before production begins.",
      },
      {
        q: "Can I upload a photo for printing or engraving?",
        a: "Yes. Products that support photo uploads will show a file upload field in the personalisation form. We accept JPG, PNG, and SVG files up to 10MB. High-resolution images (300 DPI+) produce the best results.",
      },
      {
        q: "Is there a character limit on engraved messages?",
        a: "Yes, each product has a maximum character limit shown on the product page. Keychains typically allow up to 30 characters, while larger items like cutting boards can accommodate up to 100 characters.",
      },
      {
        q: "Can I see a proof before production?",
        a: "For complex or bespoke orders, we can provide a digital proof on request. Simply note this in the message field or contact us after ordering. Standard orders proceed to production based on the details submitted.",
      },
    ],
  },
  {
    category: "Production & Timing",
    faqs: [
      {
        q: "How long does production take?",
        a: "Production time varies by product: NFC cards take 1 business day, small engraved items 1-2 days, printed products 2-3 days, and gift bundles 3-4 days. The estimated dispatch date is shown at checkout.",
      },
      {
        q: "Can I get my order expedited?",
        a: "Express production and shipping options are available at checkout for most products. If you have an urgent deadline, please contact us before ordering and we'll do our best to help.",
      },
      {
        q: "What happens after I place my order?",
        a: "You'll receive an order confirmation email summarising your personalisation details. Please review these carefully and contact us immediately if anything needs correcting. Once production begins, changes cannot be made.",
      },
    ],
  },
  {
    category: "Shipping",
    faqs: [
      {
        q: "Where do you ship to?",
        a: "We ship worldwide. Standard shipping is available to the UK, Europe, USA, Canada, Australia, and the Middle East. Shipping costs and estimated delivery times are shown at checkout.",
      },
      {
        q: "How will I know when my order ships?",
        a: "You'll receive a shipping confirmation email with a tracking number as soon as your order is dispatched.",
      },
    ],
  },
  {
    category: "NFC Smart Cards",
    faqs: [
      {
        q: "How do NFC cards work?",
        a: "Each card contains an embedded NFC chip. When an NFC-enabled smartphone (iPhone 7+, most Android phones) is held near the card, it automatically opens the linked URL in the phone's browser — no app required.",
      },
      {
        q: "What can I link my NFC card to?",
        a: "Any publicly accessible URL works: YouTube videos, Google Photos albums, iCloud shared albums, Dropbox links, personal websites, or any direct link. We recommend testing your link before gifting.",
      },
      {
        q: "Can I change the linked content after the card is gifted?",
        a: "Yes. Each NFC card has a unique ID. After purchase, you can log into our NFC portal with your order number to update the linked URL at any time. The physical card never changes.",
      },
      {
        q: "What if the recipient doesn't have NFC on their phone?",
        a: "Every NFC card also includes a printed QR code on the reverse that links to the same content, so no one is ever left out.",
      },
    ],
  },
  {
    category: "Returns & Refunds",
    faqs: [
      {
        q: "Can I return a personalised item?",
        a: "Due to the made-to-order, personalised nature of our products, we cannot accept returns or exchanges unless an item arrives damaged or there was an error on our part. Please double-check all personalisation details before submitting your order.",
      },
      {
        q: "What if my item arrives damaged?",
        a: "We're so sorry if this happens. Please contact us within 48 hours of delivery with photos of the damage and we will arrange a replacement at no extra cost.",
      },
      {
        q: "What if I made a mistake in the personalisation?",
        a: "If you notice an error immediately after ordering, contact us as soon as possible. We can sometimes correct details if production hasn't started. Once an item is in production, we cannot make changes but may be able to offer a discounted remake.",
      },
    ],
  },
]

export default function FAQPage() {
  return (
    <div className="min-h-screen">
      <div className="bg-cream-100 border-b border-gold-200 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="font-serif text-4xl font-bold text-charcoal-900 mb-3">
            Frequently Asked Questions
          </h1>
          <p className="text-gray-500 font-sans">
            Can't find what you're looking for?{" "}
            <Link href="/contact" className="text-gold-600 hover:underline">
              Contact us
            </Link>{" "}
            and we'll get back to you within a few hours.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        {FAQ_SECTIONS.map((section) => (
          <section key={section.category}>
            <h2 className="font-serif text-2xl font-bold text-charcoal-900 mb-6 flex items-center gap-3">
              <span className="w-8 h-0.5 bg-gold-400" />
              {section.category}
            </h2>
            <div className="space-y-4">
              {section.faqs.map((faq) => (
                <div key={faq.q} className="rounded-2xl border border-gold-100 bg-white overflow-hidden">
                  <details className="group">
                    <summary className="flex items-center justify-between p-5 cursor-pointer list-none">
                      <span className="font-sans font-semibold text-charcoal-800 text-sm">{faq.q}</span>
                      <span className="text-gold-400 group-open:rotate-45 transition-transform text-xl font-light">+</span>
                    </summary>
                    <div className="px-5 pb-5">
                      <p className="text-gray-600 font-sans text-sm leading-relaxed">{faq.a}</p>
                    </div>
                  </details>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
