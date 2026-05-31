import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Shop All Personalised Gifts",
  description: "Browse our full range of personalised gifts — laser engraved, custom printed, and NFC smart cards for every occasion.",
}

const ALL_PRODUCTS = [
  { title: "Engraved Wooden Keychain",   price: "$14.99", handle: "engraved-wooden-keychain",   img: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=600", type: "Laser Engraved", occasion: "Birthday" },
  { title: "Engraved Metal Wallet Card", price: "$19.99", handle: "engraved-metal-wallet-card", img: "https://images.unsplash.com/photo-1553531087-b75f57f2e3b5?w=600", type: "Laser Engraved", occasion: "Birthday" },
  { title: "Engraved Photo Frame",       price: "$34.99", handle: "engraved-photo-frame",       img: "https://images.unsplash.com/photo-1541123437800-1bb1317badc2?w=600", type: "Laser Engraved", occasion: "Anniversary" },
  { title: "Engraved Jewelry Box",       price: "$49.99", handle: "engraved-wooden-jewelry-box",img: "https://images.unsplash.com/photo-1584553421349-3557471bed79?w=600", type: "Laser Engraved", occasion: "Anniversary" },
  { title: "Engraved Wine Glass",        price: "$24.99", handle: "engraved-wine-whiskey-glass",img: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600", type: "Laser Engraved", occasion: "Wedding" },
  { title: "Engraved Cutting Board",     price: "$59.99", handle: "custom-engraved-cutting-board",img: "https://images.unsplash.com/photo-1530062845289-9109b2c9c868?w=600", type: "Laser Engraved", occasion: "Wedding" },
  { title: "Engraved Leather Wallet",    price: "$54.99", handle: "engraved-leather-wallet",    img: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=600", type: "Laser Engraved", occasion: "Birthday" },
  { title: "Custom Photo Mug",           price: "$19.99", handle: "custom-printed-photo-mug",   img: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600", type: "Printed",        occasion: "Birthday" },
  { title: "Personalised Phone Case",    price: "$24.99", handle: "personalised-phone-case",    img: "https://images.unsplash.com/photo-1601972599720-36938d4ecd31?w=600", type: "Printed",        occasion: "Birthday" },
  { title: "Custom Printed Cushion",     price: "$29.99", handle: "custom-printed-cushion",     img: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600", type: "Printed",        occasion: "Baby" },
  { title: "Canvas Photo Print",         price: "$49.99", handle: "personalised-canvas-photo-print", img: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600", type: "Printed",   occasion: "Anniversary" },
  { title: "Custom Tote Bag",            price: "$17.99", handle: "custom-printed-tote-bag",    img: "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=600", type: "Printed",        occasion: "Wedding" },
  { title: "Personalised Notebook",      price: "$19.99", handle: "personalised-notebook",      img: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600", type: "Printed",          occasion: "Graduation" },
  { title: "NFC Birthday Card",          price: "$24.99", handle: "nfc-birthday-card",          img: "https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=600", type: "NFC Smart Card", occasion: "Birthday" },
  { title: "NFC Anniversary Card",       price: "$24.99", handle: "nfc-anniversary-card",       img: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600", type: "NFC Smart Card", occasion: "Anniversary" },
  { title: "NFC Wedding Card",           price: "$34.99", handle: "nfc-wedding-card",           img: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600", type: "NFC Smart Card", occasion: "Wedding" },
  { title: "NFC Memorial Card",          price: "$29.99", handle: "nfc-memorial-card",          img: "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=600", type: "NFC Smart Card", occasion: "Other" },
  { title: "Birthday Gift Box",          price: "$59.99", handle: "birthday-gift-box",          img: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600", type: "Gift Bundle",     occasion: "Birthday" },
  { title: "Wedding Bundle",             price: "$99.99", handle: "wedding-bundle",             img: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600", type: "Gift Bundle",    occasion: "Wedding" },
  { title: "New Baby Bundle",            price: "$89.99", handle: "new-baby-bundle",            img: "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=600", type: "Gift Bundle",    occasion: "Baby" },
]

const TYPE_FILTERS  = ["All", "Laser Engraved", "Printed", "NFC Smart Card", "Gift Bundle"]
const OCC_FILTERS   = ["All", "Birthday", "Wedding", "Anniversary", "Baby", "Graduation", "Other"]

export default function ShopPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-cream-100 border-b border-gold-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-serif text-4xl font-bold text-charcoal-900 mb-2">Shop All Gifts</h1>
          <p className="text-gray-500 font-sans">
            {ALL_PRODUCTS.length} personalised gifts, handcrafted to order
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 pb-6 border-b border-gray-100">
          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-sans font-semibold text-gray-500 self-center mr-2">Type:</span>
            {TYPE_FILTERS.map((f) => (
              <button key={f} className="px-4 py-1.5 text-sm font-sans rounded-full border border-gray-200 hover:border-gold-400 hover:text-gold-600 transition-colors first:bg-gold-500 first:text-white first:border-gold-500">
                {f}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 md:border-l md:border-gray-200 md:pl-4">
            <span className="text-sm font-sans font-semibold text-gray-500 self-center mr-2">Occasion:</span>
            {OCC_FILTERS.map((f) => (
              <button key={f} className="px-4 py-1.5 text-sm font-sans rounded-full border border-gray-200 hover:border-gold-400 hover:text-gold-600 transition-colors">
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {ALL_PRODUCTS.map((p) => (
            <Link key={p.handle} href={`/products/${p.handle}`} className="group block">
              <div className="rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-gold-md transition-all duration-300 border border-transparent hover:border-gold-200">
                <div className="relative aspect-square overflow-hidden bg-cream-100">
                  <Image
                    src={p.img}
                    alt={p.title}
                    fill sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-2 left-2 text-[10px] bg-white/90 text-gold-700 font-sans font-semibold px-2 py-0.5 rounded-full border border-gold-200">
                    {p.type}
                  </span>
                </div>
                <div className="p-3">
                  <h3 className="font-serif text-sm font-semibold text-charcoal-900 group-hover:text-gold-600 transition-colors line-clamp-2">
                    {p.title}
                  </h3>
                  <div className="flex items-center justify-between mt-1">
                    <span className="font-sans font-bold text-gold-600 text-sm">{p.price}</span>
                    <span className="text-[10px] text-gray-400 font-sans">{p.occasion}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
