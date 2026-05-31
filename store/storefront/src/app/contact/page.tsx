import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contact Us | MemoryLane Gifts",
  description: "Get in touch with the MemoryLane Gifts team. We'd love to hear from you.",
}

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      <div className="bg-cream-100 border-b border-gold-200 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="font-serif text-4xl font-bold text-charcoal-900 mb-3">Get in Touch</h1>
          <p className="text-gray-500 font-sans">
            We're a small team and we genuinely love hearing from our customers.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact form */}
          <div>
            <h2 className="font-serif text-2xl font-bold text-charcoal-900 mb-6">Send Us a Message</h2>
            <form className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-sans font-medium text-charcoal-800 mb-1">First Name</label>
                  <input type="text" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-sans focus:outline-none focus:ring-2 focus:ring-gold-400" placeholder="Jane" />
                </div>
                <div>
                  <label className="block text-sm font-sans font-medium text-charcoal-800 mb-1">Last Name</label>
                  <input type="text" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-sans focus:outline-none focus:ring-2 focus:ring-gold-400" placeholder="Smith" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-sans font-medium text-charcoal-800 mb-1">Email</label>
                <input type="email" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-sans focus:outline-none focus:ring-2 focus:ring-gold-400" placeholder="jane@example.com" />
              </div>
              <div>
                <label className="block text-sm font-sans font-medium text-charcoal-800 mb-1">Order Number (if applicable)</label>
                <input type="text" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-sans focus:outline-none focus:ring-2 focus:ring-gold-400" placeholder="#12345" />
              </div>
              <div>
                <label className="block text-sm font-sans font-medium text-charcoal-800 mb-1">Subject</label>
                <select className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-sans focus:outline-none focus:ring-2 focus:ring-gold-400 bg-white">
                  <option>Order enquiry</option>
                  <option>Personalisation question</option>
                  <option>NFC card setup</option>
                  <option>Bulk / corporate order</option>
                  <option>Something else</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-sans font-medium text-charcoal-800 mb-1">Message</label>
                <textarea rows={5} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-sans focus:outline-none focus:ring-2 focus:ring-gold-400 resize-none" placeholder="Tell us how we can help…" />
              </div>
              <button type="submit" className="w-full btn-primary py-3">
                Send Message
              </button>
            </form>
          </div>

          {/* Contact info */}
          <div className="space-y-8">
            <div>
              <h2 className="font-serif text-2xl font-bold text-charcoal-900 mb-6">Other Ways to Reach Us</h2>
            </div>

            {/* WhatsApp */}
            <a
              href="https://wa.me/447700900000"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-4 p-5 rounded-2xl bg-green-50 border border-green-200 hover:bg-green-100 transition-colors"
            >
              <span className="text-4xl">💬</span>
              <div>
                <p className="font-sans font-semibold text-green-800">WhatsApp Us</p>
                <p className="text-sm text-green-600 font-sans">Fastest response · Usually reply within 1 hour</p>
              </div>
            </a>

            <div className="space-y-4">
              {[
                { icon: "📧", label: "Email", value: "hello@memorylane.gifts", href: "mailto:hello@memorylane.gifts" },
                { icon: "⏰", label: "Response time", value: "Within 4 business hours", href: null },
                { icon: "📦", label: "Bulk orders", value: "corporate@memorylane.gifts", href: "mailto:corporate@memorylane.gifts" },
              ].map((c) => (
                <div key={c.label} className="flex items-center gap-4 p-4 rounded-xl bg-cream-50 border border-gold-100">
                  <span className="text-2xl">{c.icon}</span>
                  <div>
                    <p className="text-xs font-sans text-gray-400">{c.label}</p>
                    {c.href ? (
                      <a href={c.href} className="font-sans font-medium text-charcoal-800 hover:text-gold-600 transition-colors text-sm">{c.value}</a>
                    ) : (
                      <p className="font-sans font-medium text-charcoal-800 text-sm">{c.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-5 rounded-2xl bg-gold-50 border border-gold-200">
              <h3 className="font-serif font-bold text-charcoal-900 mb-2">Corporate & Bulk Gifting</h3>
              <p className="text-sm text-gray-600 font-sans leading-relaxed">
                Looking for personalised gifts for your team, clients, or events? We offer volume pricing, custom branding, and dedicated account management for bulk orders of 10+ items.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
