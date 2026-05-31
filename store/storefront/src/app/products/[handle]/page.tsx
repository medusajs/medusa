import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import PersonalizationForm from "@/components/product/PersonalizationForm"
import { getPersonalizationFields } from "@/lib/medusa"

// Static fallback product data (in real use, fetch from Medusa API at build/request time)
const PRODUCT_DATA: Record<string, any> = {
  "engraved-wooden-keychain": {
    id: "prod_01",
    title: "Engraved Wooden Keychain",
    handle: "engraved-wooden-keychain",
    description: "A beautifully crafted wooden keychain laser-engraved with a name, date, or short message. Made from sustainably sourced maple wood with a smooth finish. The perfect pocket-sized reminder of someone special.",
    thumbnail: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=800",
    images: [
      { url: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=800" },
      { url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800" },
    ],
    variants: [
      { id: "v1", title: "Maple Wood", prices: [{ amount: 1499, currency_code: "usd" }] },
      { id: "v2", title: "Walnut Wood", prices: [{ amount: 1499, currency_code: "usd" }] },
      { id: "v3", title: "Bamboo",      prices: [{ amount: 1499, currency_code: "usd" }] },
    ],
    options: [{ id: "opt1", title: "Material", values: [{ value: "Maple Wood" }, { value: "Walnut Wood" }, { value: "Bamboo" }] }],
    metadata: { production_days: 2, personalization_type: "engraving", personalization_fields: '["recipient_name","date","message","font_style"]', max_chars: 30 },
    tags: [{ value: "keychain" }, { value: "wood" }],
  },
}

type Props = { params: { handle: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = PRODUCT_DATA[params.handle]
  if (!product) return { title: "Product Not Found" }
  return {
    title: `${product.title} | Personalised Gift`,
    description: product.description,
    openGraph: { images: [product.thumbnail] },
  }
}

export default function ProductPage({ params }: Props) {
  const product = PRODUCT_DATA[params.handle] ?? {
    title: "Custom Personalised Gift",
    handle: params.handle,
    description: "A beautiful made-to-order personalised gift crafted with care.",
    thumbnail: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800",
    images: [{ url: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800" }],
    variants: [{ id: "v1", title: "Default", prices: [{ amount: 2999, currency_code: "usd" }] }],
    options: [],
    metadata: { production_days: 3, personalization_type: "mixed", personalization_fields: '["recipient_name","sender_name","date","message","occasion"]', max_chars: 80 },
    tags: [],
  }

  const personalizationFields = getPersonalizationFields(product)
  const price = product.variants?.[0]?.prices?.[0]
  const priceFormatted = price
    ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(price.amount / 100)
    : "—"

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex items-center gap-2 text-sm font-sans text-gray-400">
          <Link href="/" className="hover:text-gold-500 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-gold-500 transition-colors">Shop</Link>
          <span>/</span>
          <span className="text-charcoal-800">{product.title}</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* ── Images ────────────────────────────────────────────────── */}
          <div className="space-y-4">
            <div className="rounded-3xl overflow-hidden aspect-square bg-cream-50 shadow-gold-md">
              <Image
                src={product.thumbnail || product.images?.[0]?.url}
                alt={product.title}
                width={800} height={800}
                className="w-full h-full object-cover"
                priority
              />
            </div>
            {product.images?.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.images.map((img: any, i: number) => (
                  <div key={i} className="rounded-xl overflow-hidden aspect-square bg-cream-50 border-2 border-transparent hover:border-gold-400 cursor-pointer transition">
                    <Image
                      src={img.url}
                      alt={`${product.title} ${i + 1}`}
                      width={200} height={200}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Product details & form ─────────────────────────────────── */}
          <div className="space-y-6">
            <div>
              <div className="flex flex-wrap gap-2 mb-3">
                {product.tags?.map((t: any) => (
                  <span key={t.value} className="text-xs bg-gold-50 text-gold-700 font-sans px-3 py-1 rounded-full border border-gold-200">
                    {t.value}
                  </span>
                ))}
              </div>
              <h1 className="font-serif text-3xl md:text-4xl font-bold text-charcoal-900 mb-3">
                {product.title}
              </h1>
              <div className="flex items-center gap-3 mb-4">
                <span className="font-sans text-3xl font-bold text-gold-600">{priceFormatted}</span>
                <div className="flex items-center gap-1 text-yellow-400 text-sm">
                  ⭐⭐⭐⭐⭐
                  <span className="text-gray-400 text-xs ml-1">(128 reviews)</span>
                </div>
              </div>
              <p className="text-gray-600 font-sans leading-relaxed">{product.description}</p>
            </div>

            {/* Variant selector */}
            {product.options?.length > 0 && (
              <div className="space-y-3">
                {product.options.map((opt: any) => (
                  <div key={opt.id}>
                    <p className="text-sm font-sans font-semibold text-charcoal-800 mb-2">{opt.title}</p>
                    <div className="flex flex-wrap gap-2">
                      {opt.values.map((v: any) => (
                        <button
                          key={v.value}
                          className="px-4 py-2 text-sm font-sans border border-gray-200 rounded-lg hover:border-gold-400 hover:bg-gold-50 hover:text-gold-700 transition-colors"
                        >
                          {v.value}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Personalization form */}
            <div className="bg-cream-50 rounded-2xl p-6 border border-gold-100">
              <PersonalizationForm
                fields={personalizationFields}
                maxChars={product.metadata?.max_chars || 80}
                productionDays={product.metadata?.production_days}
                onSubmit={(data) => {
                  console.log("Add to cart:", data)
                  // In a real implementation: call Medusa cart API with line item + metadata
                }}
              />
            </div>

            {/* Guarantees */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              {[
                { icon: "✋", text: "Handcrafted with care" },
                { icon: "🔒", text: "Secure checkout" },
                { icon: "🎁", text: "Gift wrapping available" },
                { icon: "💌", text: "Personalisation reviewed before production" },
              ].map((g) => (
                <div key={g.text} className="flex items-center gap-2 text-sm text-gray-500 font-sans">
                  <span>{g.icon}</span>
                  <span>{g.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Upsell: NFC Card ──────────────────────────────────────────── */}
        {product.metadata?.personalization_type !== "nfc" && (
          <div className="mt-16 bg-gradient-to-r from-charcoal-900 to-gray-800 rounded-3xl p-8 text-white">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="text-5xl">✨</div>
              <div className="flex-1 text-center sm:text-left">
                <h3 className="font-serif text-xl font-bold mb-1">Complete the gift with an NFC Card</h3>
                <p className="text-gray-300 font-sans text-sm">
                  Add a digital memory card that opens a video message or photo album with a tap. The perfect pairing.
                </p>
              </div>
              <Link href="/collections/nfc-smart-cards" className="btn-primary whitespace-nowrap flex-shrink-0">
                Add NFC Card
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
