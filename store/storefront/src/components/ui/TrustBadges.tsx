const badges = [
  { icon: "✋", title: "Handmade", desc: "Crafted with care" },
  { icon: "⚡", title: "Fast Dispatch", desc: "1-4 day production" },
  { icon: "🔒", title: "Secure Checkout", desc: "SSL encrypted" },
  { icon: "⭐", title: "5-Star Reviews", desc: "Thousands of happy customers" },
  { icon: "🎁", title: "Gift Wrapping", desc: "Complimentary on $50+" },
]

export default function TrustBadges() {
  return (
    <div className="bg-cream-100 border-y border-gold-200 py-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-wrap justify-center gap-6 md:gap-10">
          {badges.map((b) => (
            <div key={b.title} className="flex items-center gap-3 text-center md:text-left">
              <span className="text-2xl">{b.icon}</span>
              <div>
                <p className="text-sm font-sans font-semibold text-charcoal-800">{b.title}</p>
                <p className="text-xs text-gray-500 font-sans">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
