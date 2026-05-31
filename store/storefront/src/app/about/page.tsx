import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

export const metadata: Metadata = {
  title: "About Us | MemoryLane Gifts",
  description: "The story behind MemoryLane Gifts — handcrafted personalised gifts made with love.",
}

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative h-72 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=1600"
          alt="Artisan crafting a gift"
          fill className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/70 to-transparent" />
        <div className="absolute bottom-8 left-0 right-0 text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-white">Our Story</h1>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        {/* Brand story */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="font-serif text-3xl font-bold text-charcoal-900 mb-4">
              Born from a belief that gifts should mean something
            </h2>
            <p className="text-gray-600 font-sans leading-relaxed mb-4">
              MemoryLane started when our founder, searching for a truly meaningful birthday gift, realised that everything in the shops felt generic. She wanted something that would make her mum cry happy tears — not a scented candle from a shelf.
            </p>
            <p className="text-gray-600 font-sans leading-relaxed mb-4">
              So she invested in a laser engraver, taught herself the craft, and made a personalised jewelry box. The reaction was everything. That moment became MemoryLane.
            </p>
            <p className="text-gray-600 font-sans leading-relaxed">
              Today, our small team of artisans uses a combination of laser engraving, UV printing, and NFC technology to create gifts that carry real emotion — gifts that recipients keep, display, and return to for years.
            </p>
          </div>
          <div className="rounded-3xl overflow-hidden aspect-[4/3] shadow-gold-lg">
            <Image
              src="https://images.unsplash.com/photo-1556741533-6e6a62bd8b49?w=800"
              alt="Our workshop"
              width={800} height={600}
              className="w-full h-full object-cover"
            />
          </div>
        </section>

        {/* Values */}
        <section>
          <h2 className="font-serif text-3xl font-bold text-charcoal-900 text-center mb-10">
            What We Stand For
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: "✋", title: "Handcrafted", desc: "Every item is made by a human, not a machine assembly line. We take pride in the details." },
              { icon: "💚", title: "Sustainable", desc: "We source responsibly — FSC certified wood, eco inks, and minimal plastic packaging." },
              { icon: "💌", title: "Meaningful", desc: "We believe the best gifts carry a piece of the giver's heart. We help you express that." },
            ].map((v) => (
              <div key={v.title} className="text-center p-6 rounded-2xl bg-cream-50 border border-gold-100">
                <div className="text-4xl mb-4">{v.icon}</div>
                <h3 className="font-serif text-lg font-bold text-charcoal-900 mb-2">{v.title}</h3>
                <p className="text-sm text-gray-500 font-sans">{v.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="text-center">
          <Link href="/shop" className="btn-primary">Browse Our Gifts</Link>
        </div>
      </div>
    </div>
  )
}
