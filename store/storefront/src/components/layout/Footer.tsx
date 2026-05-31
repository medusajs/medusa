import Link from "next/link"

const LINKS = {
  shop: [
    { href: "/collections/birthday-gifts",    label: "Birthday Gifts" },
    { href: "/collections/wedding-gifts",     label: "Wedding Gifts" },
    { href: "/collections/anniversary-gifts", label: "Anniversary Gifts" },
    { href: "/collections/nfc-smart-cards",   label: "NFC Smart Cards" },
    { href: "/collections/gift-bundles",      label: "Gift Bundles" },
    { href: "/gift-finder",                   label: "Gift Finder" },
  ],
  info: [
    { href: "/how-it-works", label: "How It Works" },
    { href: "/about",        label: "About Us" },
    { href: "/faq",          label: "FAQs" },
    { href: "/contact",      label: "Contact Us" },
  ],
  legal: [
    { href: "/privacy-policy",  label: "Privacy Policy" },
    { href: "/terms",           label: "Terms of Service" },
    { href: "/returns-policy",  label: "Returns Policy" },
    { href: "/shipping-policy", label: "Shipping Policy" },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-charcoal-900 text-white">
      {/* Newsletter */}
      <div className="bg-gold-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h3 className="font-serif text-2xl font-bold text-white mb-2">
            Never miss a gifting moment
          </h3>
          <p className="text-gold-100 text-sm mb-6 font-sans">
            Seasonal inspiration, exclusive offers, and early access to new collections.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-4 py-3 rounded-full text-charcoal-900 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-charcoal-900 text-white rounded-full text-sm font-medium hover:bg-charcoal-800 transition-colors font-sans whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl text-gold-400">✦</span>
              <div>
                <span className="font-serif text-xl font-bold">MemoryLane</span>
                <span className="block text-[10px] text-gold-400 font-sans tracking-[0.2em] uppercase">Gifts</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm font-sans leading-relaxed">
              Handcrafted, personalised gifts that turn moments into lasting memories. Made with love for the people who matter most.
            </p>
            <div className="flex gap-4 mt-6">
              {["instagram", "facebook", "tiktok", "pinterest"].map((s) => (
                <a key={s} href="#" aria-label={s} className="text-gray-400 hover:text-gold-400 transition-colors text-sm capitalize">
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-sans font-semibold text-sm uppercase tracking-wider text-gold-400 mb-4">Shop</h4>
            <ul className="space-y-2">
              {LINKS.shop.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-gray-400 hover:text-white text-sm font-sans transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-sans font-semibold text-sm uppercase tracking-wider text-gold-400 mb-4">Information</h4>
            <ul className="space-y-2">
              {LINKS.info.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-gray-400 hover:text-white text-sm font-sans transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-sans font-semibold text-sm uppercase tracking-wider text-gold-400 mb-4">Legal</h4>
            <ul className="space-y-2">
              {LINKS.legal.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-gray-400 hover:text-white text-sm font-sans transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Trust badges */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-wrap justify-center gap-8 mb-6">
            {[
              { icon: "✋", label: "Handcrafted" },
              { icon: "⚡", label: "Fast Dispatch" },
              { icon: "🔒", label: "Secure Checkout" },
              { icon: "⭐", label: "5-Star Reviews" },
              { icon: "🎁", label: "Free Gift Wrapping" },
            ].map((b) => (
              <div key={b.label} className="flex items-center gap-2 text-sm text-gray-400 font-sans">
                <span>{b.icon}</span>
                <span>{b.label}</span>
              </div>
            ))}
          </div>
          <p className="text-center text-gray-600 text-xs font-sans">
            © {new Date().getFullYear()} MemoryLane Gifts. All rights reserved. Made with ♥
          </p>
        </div>
      </div>
    </footer>
  )
}
