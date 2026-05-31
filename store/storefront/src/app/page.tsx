import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import TrustBadges from "@/components/ui/TrustBadges"

export const metadata: Metadata = {
  title: "MemoryLane Gifts | Personalised Gifts Made with Love",
  description:
    "Beautiful personalised gifts for every occasion. Laser engraving, custom printing & NFC smart cards. Birthdays, weddings, anniversaries and more.",
}

const OCCASIONS = [
  { name: "Birthday",     emoji: "🎂", href: "/collections/birthday-gifts",    bg: "from-amber-50 to-orange-50",   border: "border-amber-200" },
  { name: "Wedding",      emoji: "💍", href: "/collections/wedding-gifts",     bg: "from-rose-50 to-pink-50",      border: "border-rose-200"  },
  { name: "Anniversary",  emoji: "❤️", href: "/collections/anniversary-gifts", bg: "from-red-50 to-rose-50",       border: "border-red-200"   },
  { name: "Baby",         emoji: "🍼", href: "/collections/baby-gifts",        bg: "from-blue-50 to-sky-50",       border: "border-blue-200"  },
  { name: "Graduation",   emoji: "🎓", href: "/shop?occasion=Graduation",      bg: "from-purple-50 to-violet-50",  border: "border-purple-200"},
  { name: "Valentine's",  emoji: "💝", href: "/shop?occasion=Valentine's+Day", bg: "from-pink-50 to-rose-50",      border: "border-pink-200"  },
  { name: "Mother's Day", emoji: "🌸", href: "/shop?occasion=Mother's+Day",    bg: "from-fuchsia-50 to-pink-50",   border: "border-fuchsia-200"},
  { name: "NFC Cards",    emoji: "✨", href: "/collections/nfc-smart-cards",   bg: "from-gold-50 to-amber-50",     border: "border-gold-200"  },
]

const BESTSELLERS = [
  {
    title: "Engraved Wooden Keychain",
    price: "$14.99",
    handle: "engraved-wooden-keychain",
    img: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=600",
    tag: "Laser Engraved",
  },
  {
    title: "NFC Birthday Card",
    price: "$24.99",
    handle: "nfc-birthday-card",
    img: "https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=600",
    tag: "NFC Smart Card",
  },
  {
    title: "Custom Printed Photo Mug",
    price: "$19.99",
    handle: "custom-printed-photo-mug",
    img: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600",
    tag: "Printed",
  },
  {
    title: "Birthday Gift Box",
    price: "$59.99",
    handle: "birthday-gift-box",
    img: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600",
    tag: "Gift Bundle",
  },
]

const REVIEWS = [
  {
    name: "Emma T.",
    rating: 5,
    text: "Absolutely stunning quality. The engraving was flawless and it arrived beautifully packaged. My mum cried happy tears!",
    product: "Engraved Jewelry Box",
    avatar: "ET",
  },
  {
    name: "James R.",
    rating: 5,
    text: "The NFC wedding card was the talk of the reception. Everyone wanted to know how to 'tap the card'. Genius idea.",
    product: "NFC Wedding Card",
    avatar: "JR",
  },
  {
    name: "Priya M.",
    rating: 5,
    text: "Ordered the birthday gift box and I was blown away. Every item was perfect and the personalisation was exactly right.",
    product: "Birthday Gift Box",
    avatar: "PM",
  },
]

export default function HomePage() {
  return (
    <div>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[85vh] flex items-center bg-hero-pattern overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 right-10 w-72 h-72 bg-gold-200/30 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-amber-100/40 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-up">
              <div className="inline-flex items-center gap-2 bg-gold-100 text-gold-700 text-sm font-sans px-4 py-2 rounded-full mb-6">
                <span>✦</span>
                <span>Made to order · Laser engraved · NFC enabled</span>
              </div>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-charcoal-900 leading-[1.15] mb-6">
                Gifts They'll{" "}
                <span className="text-gold-500 italic">Treasure</span>{" "}
                Forever
              </h1>
              <p className="text-lg text-gray-600 font-sans leading-relaxed mb-8 max-w-lg">
                Beautifully personalised gifts for every milestone and moment — laser engraved, custom printed, or embedded with NFC technology to unlock a digital memory they'll revisit for years.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/gift-finder" className="btn-primary text-center">
                  Find the Perfect Gift ✨
                </Link>
                <Link href="/shop" className="btn-outline text-center">
                  Browse All Gifts
                </Link>
              </div>
              <div className="mt-8 flex items-center gap-6">
                <div className="flex -space-x-2">
                  {["bg-rose-200", "bg-amber-200", "bg-blue-200", "bg-green-200"].map((c, i) => (
                    <div key={i} className={`w-8 h-8 rounded-full ${c} border-2 border-white`} />
                  ))}
                </div>
                <p className="text-sm text-gray-500 font-sans">
                  <span className="font-semibold text-charcoal-800">10,000+</span> happy customers · ⭐⭐⭐⭐⭐
                </p>
              </div>
            </div>

            {/* Hero image grid */}
            <div className="grid grid-cols-2 gap-4 animate-fade-in">
              <div className="space-y-4">
                <div className="rounded-2xl overflow-hidden aspect-[3/4] shadow-gold-lg">
                  <Image
                    src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600"
                    alt="Gift being opened"
                    width={400} height={533}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="rounded-2xl overflow-hidden aspect-square shadow-gold-md">
                  <Image
                    src="https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=600"
                    alt="Engraved keychain"
                    width={400} height={400}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="rounded-2xl overflow-hidden aspect-square shadow-gold-md">
                  <Image
                    src="https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=600"
                    alt="NFC card"
                    width={400} height={400}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="rounded-2xl overflow-hidden aspect-[3/4] shadow-gold-lg">
                  <Image
                    src="https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600"
                    alt="Custom mug"
                    width={400} height={533}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust badges ──────────────────────────────────────────────────── */}
      <TrustBadges />

      {/* ── Occasions grid ────────────────────────────────────────────────── */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="section-heading">Shop by Occasion</h2>
          <p className="section-subheading">Whatever the moment, we have the perfect personalised gift</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {OCCASIONS.map((o) => (
            <Link
              key={o.name}
              href={o.href}
              className={`group relative flex flex-col items-center justify-center p-6 rounded-2xl bg-gradient-to-br ${o.bg} border ${o.border} hover:shadow-gold-md transition-all duration-300 hover:-translate-y-1`}
            >
              <span className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                {o.emoji}
              </span>
              <span className="font-serif font-semibold text-charcoal-800 text-center">{o.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Bestsellers ───────────────────────────────────────────────────── */}
      <section className="py-20 bg-cream-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="section-heading">Customer Favourites</h2>
              <p className="section-subheading">Our most-loved personalised gifts</p>
            </div>
            <Link href="/shop" className="hidden md:block text-gold-600 hover:text-gold-700 font-sans text-sm font-medium underline underline-offset-4">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {BESTSELLERS.map((p) => (
              <Link key={p.handle} href={`/products/${p.handle}`} className="group block">
                <div className="rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-gold-md transition-all duration-300 border border-transparent hover:border-gold-200">
                  <div className="relative aspect-square overflow-hidden bg-cream-100">
                    <Image
                      src={p.img}
                      alt={p.title}
                      fill sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 left-3 text-[11px] bg-gold-100 text-gold-700 font-sans font-semibold px-2.5 py-1 rounded-full">
                      {p.tag}
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-serif text-base font-semibold text-charcoal-900 group-hover:text-gold-600 transition-colors">
                      {p.title}
                    </h3>
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-sans font-bold text-gold-600 text-lg">{p.price}</span>
                    </div>
                    <button className="mt-3 w-full py-2.5 bg-gold-500 hover:bg-gold-600 text-white rounded-full text-sm font-sans transition-colors">
                      Personalise This Gift
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ──────────────────────────────────────────────────── */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="section-heading">How It Works</h2>
          <p className="section-subheading">Creating a meaningful gift takes just minutes</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative">
          {/* Connector line */}
          <div className="hidden md:block absolute top-12 left-1/4 right-1/4 h-px bg-gold-200 z-0" />

          {[
            {
              step: "01",
              icon: "🛍️",
              title: "Choose Your Gift",
              desc: "Browse our collection and pick the perfect product for your occasion. Keychains, mugs, canvas prints, NFC cards, and more.",
            },
            {
              step: "02",
              icon: "✏️",
              title: "Personalise It",
              desc: "Add names, dates, photos, and messages. Upload a logo or choose a font style. Our guided form makes it simple.",
            },
            {
              step: "03",
              icon: "📦",
              title: "We Craft & Deliver",
              desc: "Our artisans produce your item with precision. Beautifully packaged and delivered to your door — ready to gift.",
            },
          ].map((s, i) => (
            <div key={i} className="relative z-10 flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gold-100 to-amber-100 border-2 border-gold-300 flex items-center justify-center text-4xl mb-6 shadow-gold-sm">
                {s.icon}
              </div>
              <div className="absolute top-0 right-0 w-7 h-7 bg-gold-500 text-white rounded-full flex items-center justify-center text-xs font-bold font-sans">
                {s.step}
              </div>
              <h3 className="font-serif text-xl font-semibold text-charcoal-900 mb-3">{s.title}</h3>
              <p className="text-gray-500 font-sans text-sm leading-relaxed max-w-xs">{s.desc}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
          <Link href="/how-it-works" className="btn-outline">
            Learn More About Our Process
          </Link>
        </div>
      </section>

      {/* ── NFC Spotlight ─────────────────────────────────────────────────── */}
      <section className="py-20 bg-charcoal-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-gold-500/20 text-gold-300 text-sm font-sans px-4 py-2 rounded-full mb-6">
                <span>✨</span> New Technology
              </div>
              <h2 className="font-serif text-4xl font-bold text-white mb-4">
                Introducing NFC Smart Cards
              </h2>
              <p className="text-gray-300 font-sans leading-relaxed mb-6">
                A card that does more than sit on a shelf. Tap with any smartphone to instantly open a personalised video message, photo album, playlist, or voice note. No app needed — just tap and be moved.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "Works with any NFC-enabled smartphone",
                  "Link to any URL — YouTube, Google Photos, iCloud, anything",
                  "Update your content any time",
                  "Printed on luxury card stock with gold foil finish",
                ].map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm font-sans text-gray-300">
                    <span className="text-gold-400 text-base">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/collections/nfc-smart-cards" className="btn-primary">
                Shop NFC Cards
              </Link>
            </div>
            <div className="relative">
              <div className="rounded-3xl overflow-hidden aspect-[4/3] shadow-gold-lg">
                <Image
                  src="https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=800"
                  alt="NFC Smart Card tap"
                  width={800} height={600}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-gold-md p-4 max-w-[200px]">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">📱</span>
                  <span className="text-xs font-sans font-semibold text-charcoal-800">Just tap your phone</span>
                </div>
                <p className="text-xs text-gray-500 font-sans">Opens instantly. No app. No password.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Reviews ───────────────────────────────────────────────────────── */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="section-heading">What Our Customers Say</h2>
          <div className="flex items-center justify-center gap-1 mt-3">
            {"⭐⭐⭐⭐⭐".split("").map((s, i) => <span key={i}>{s}</span>)}
            <span className="ml-2 text-gray-500 font-sans text-sm">4.9 / 5 from 2,400+ reviews</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {REVIEWS.map((r) => (
            <div key={r.name} className="p-6 bg-white rounded-2xl border border-gold-100 shadow-gold-sm hover:shadow-gold-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gold-100 text-gold-700 rounded-full flex items-center justify-center font-sans font-bold text-sm">
                  {r.avatar}
                </div>
                <div>
                  <p className="font-sans font-semibold text-sm text-charcoal-800">{r.name}</p>
                  <p className="text-xs text-gray-400 font-sans">{r.product}</p>
                </div>
                <div className="ml-auto text-yellow-400 text-sm">{"⭐".repeat(r.rating)}</div>
              </div>
              <p className="text-gray-600 font-sans text-sm leading-relaxed italic">"{r.text}"</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Gift Finder CTA ────────────────────────────────────────────────── */}
      <section className="py-20 bg-gradient-to-br from-gold-500 to-amber-500">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4">
            Not Sure What to Get?
          </h2>
          <p className="font-sans text-lg text-gold-100 mb-8">
            Answer a few quick questions and we'll recommend the perfect personalised gift for your person.
          </p>
          <Link
            href="/gift-finder"
            className="inline-block px-10 py-4 bg-white text-gold-600 rounded-full font-sans font-bold text-base hover:bg-cream-50 transition-colors shadow-lg"
          >
            Take the Gift Finder Quiz ✨
          </Link>
        </div>
      </section>
    </div>
  )
}
