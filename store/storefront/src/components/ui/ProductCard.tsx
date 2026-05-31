import Image from "next/image"
import Link from "next/link"
import { formatPrice } from "@/lib/medusa"

type Props = {
  product: {
    id: string
    title: string
    handle: string
    thumbnail?: string
    variants?: { prices?: { amount: number; currency_code: string }[] }[]
    metadata?: { production_days?: number; personalization_type?: string }
  }
}

const TYPE_BADGE: Record<string, string> = {
  engraving: "bg-amber-100 text-amber-700",
  printing:  "bg-blue-100 text-blue-700",
  nfc:       "bg-purple-100 text-purple-700",
  mixed:     "bg-green-100 text-green-700",
}

const TYPE_LABEL: Record<string, string> = {
  engraving: "Laser Engraved",
  printing:  "Printed",
  nfc:       "NFC Smart Card",
  mixed:     "Gift Bundle",
}

export default function ProductCard({ product }: Props) {
  const price = product.variants?.[0]?.prices?.find((p) => p.currency_code === "usd")
  const type = product.metadata?.personalization_type || ""
  const prodDays = product.metadata?.production_days

  return (
    <Link href={`/products/${product.handle}`} className="group block">
      <div className="rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-gold-md transition-all duration-300 border border-transparent hover:border-gold-200">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-cream-100">
          {product.thumbnail ? (
            <Image
              src={product.thumbnail}
              alt={product.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-5xl text-gold-200">
              🎁
            </div>
          )}
          {type && (
            <span className={`absolute top-3 left-3 text-[11px] font-sans font-semibold px-2.5 py-1 rounded-full ${TYPE_BADGE[type] || "bg-gray-100 text-gray-600"}`}>
              {TYPE_LABEL[type] || type}
            </span>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="font-serif text-base font-semibold text-charcoal-900 mb-1 group-hover:text-gold-600 transition-colors line-clamp-2">
            {product.title}
          </h3>
          <div className="flex items-center justify-between mt-2">
            {price ? (
              <span className="text-lg font-sans font-bold text-gold-600">
                {formatPrice(price.amount)}
              </span>
            ) : (
              <span className="text-sm text-gray-400 font-sans">From —</span>
            )}
            {prodDays && (
              <span className="text-xs text-gray-400 font-sans">
                Ready in {prodDays}d
              </span>
            )}
          </div>
          <button className="mt-3 w-full py-2.5 bg-gold-500 hover:bg-gold-600 text-white rounded-full text-sm font-sans font-medium transition-colors">
            Personalise This Gift
          </button>
        </div>
      </div>
    </Link>
  )
}
