import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

const COLLECTION_META: Record<string, { title: string; desc: string; hero: string }> = {
  "birthday-gifts":    { title: "Birthday Gifts",    desc: "Make their big day unforgettable with a gift personalised just for them.", hero: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=1600" },
  "wedding-gifts":     { title: "Wedding Gifts",     desc: "Celebrate the happy couple with a keepsake they'll treasure for a lifetime.", hero: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1600" },
  "anniversary-gifts": { title: "Anniversary Gifts", desc: "Mark every milestone with a personalised gift that tells their love story.", hero: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=1600" },
  "baby-gifts":        { title: "Baby Gifts",        desc: "Welcome the newest family member with a personalised keepsake.", hero: "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=1600" },
  "nfc-smart-cards":   { title: "NFC Smart Cards",   desc: "The card that opens a memory. Tap to unlock a video, album, or voice note.", hero: "https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=1600" },
  "laser-engraved":    { title: "Laser Engraved",    desc: "Precision-crafted keepsakes with deep, lasting laser engravings.", hero: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=1600" },
  "printed-products":  { title: "Printed Gifts",     desc: "Full-colour, fade-proof custom prints on mugs, cushions, canvas, and more.", hero: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=1600" },
  "gift-bundles":      { title: "Gift Bundles",       desc: "Curated sets that combine multiple personalised items in one luxury box.", hero: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=1600" },
}

const COLLECTION_PRODUCTS: Record<string, { title: string; price: string; handle: string; img: string }[]> = {
  "birthday-gifts": [
    { title: "Engraved Wooden Keychain",   price: "$14.99", handle: "engraved-wooden-keychain",   img: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=600" },
    { title: "Custom Photo Mug",           price: "$19.99", handle: "custom-printed-photo-mug",   img: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600" },
    { title: "NFC Birthday Card",          price: "$24.99", handle: "nfc-birthday-card",          img: "https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=600" },
    { title: "Birthday Gift Box",          price: "$59.99", handle: "birthday-gift-box",          img: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600" },
    { title: "Engraved Metal Wallet Card", price: "$19.99", handle: "engraved-metal-wallet-card", img: "https://images.unsplash.com/photo-1553531087-b75f57f2e3b5?w=600" },
    { title: "Engraved Leather Wallet",    price: "$54.99", handle: "engraved-leather-wallet",    img: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=600" },
  ],
  "wedding-gifts": [
    { title: "NFC Wedding Card",           price: "$34.99", handle: "nfc-wedding-card",           img: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600" },
    { title: "Engraved Cutting Board",     price: "$59.99", handle: "custom-engraved-cutting-board", img: "https://images.unsplash.com/photo-1530062845289-9109b2c9c868?w=600" },
    { title: "Wedding Bundle",             price: "$99.99", handle: "wedding-bundle",             img: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600" },
    { title: "Engraved Wine Glass",        price: "$24.99", handle: "engraved-wine-whiskey-glass", img: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600" },
    { title: "Custom Tote Bag",            price: "$17.99", handle: "custom-printed-tote-bag",    img: "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=600" },
    { title: "Engraved Photo Frame",       price: "$34.99", handle: "engraved-photo-frame",       img: "https://images.unsplash.com/photo-1541123437800-1bb1317badc2?w=600" },
  ],
  "nfc-smart-cards": [
    { title: "NFC Birthday Card",    price: "$24.99", handle: "nfc-birthday-card",    img: "https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=600" },
    { title: "NFC Anniversary Card", price: "$24.99", handle: "nfc-anniversary-card", img: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600" },
    { title: "NFC Wedding Card",     price: "$34.99", handle: "nfc-wedding-card",     img: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600" },
    { title: "NFC Memorial Card",    price: "$29.99", handle: "nfc-memorial-card",    img: "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=600" },
  ],
}

type Props = { params: { handle: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const meta = COLLECTION_META[params.handle]
  return {
    title: meta?.title ? `${meta.title} | Personalised Gifts` : "Gift Collection",
    description: meta?.desc,
  }
}

export default function CollectionPage({ params }: Props) {
  const meta = COLLECTION_META[params.handle] ?? {
    title: params.handle.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
    desc: "Browse our personalised gift collection",
    hero: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=1600",
  }
  const products = COLLECTION_PRODUCTS[params.handle] ?? []

  return (
    <div>
      {/* Hero */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <Image src={meta.hero} alt={meta.title} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/70 via-charcoal-900/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 max-w-7xl mx-auto">
          <h1 className="font-serif text-3xl md:text-5xl font-bold text-white mb-2">{meta.title}</h1>
          <p className="text-gray-200 font-sans text-sm md:text-base max-w-xl">{meta.desc}</p>
        </div>
      </div>

      {/* Products */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {products.map((p) => (
              <Link key={p.handle} href={`/products/${p.handle}`} className="group block">
                <div className="rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-gold-md transition-all border border-transparent hover:border-gold-200">
                  <div className="relative aspect-square bg-cream-100">
                    <Image src={p.img} alt={p.title} fill sizes="25vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-serif text-sm font-semibold text-charcoal-900 group-hover:text-gold-600 transition-colors">{p.title}</h3>
                    <p className="font-sans font-bold text-gold-600 mt-1">{p.price}</p>
                    <button className="mt-2 w-full py-2 bg-gold-500 hover:bg-gold-600 text-white rounded-full text-xs font-sans transition-colors">
                      Personalise This Gift
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-400 font-sans">Products coming soon. Check back shortly!</p>
            <Link href="/shop" className="btn-primary mt-6 inline-block">Browse All Gifts</Link>
          </div>
        )}
      </div>
    </div>
  )
}
