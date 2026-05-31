import Medusa from "@medusajs/js-sdk"

export const sdk = new Medusa({
  baseUrl: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000",
  publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
  auth: {
    type: "session",
  },
})

export type ProductWithPersonalization = {
  id: string
  title: string
  handle: string
  description?: string
  thumbnail?: string
  images?: { url: string }[]
  variants: {
    id: string
    title: string
    options?: Record<string, string>
    prices?: { amount: number; currency_code: string }[]
    calculated_price?: { calculated_amount: number; currency_code: string }
  }[]
  options?: { id: string; title: string; values: { value: string }[] }[]
  metadata?: {
    production_days?: number
    personalization_type?: string
    personalization_fields?: string
    max_chars?: number
    type?: string
  }
  categories?: { id: string; name: string; handle: string }[]
  tags?: { value: string }[]
}

export function formatPrice(amount: number, currencyCode = "usd"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode.toUpperCase(),
    minimumFractionDigits: 0,
  }).format(amount / 100)
}

export function getPersonalizationFields(product: ProductWithPersonalization): string[] {
  try {
    return JSON.parse(product.metadata?.personalization_fields || "[]")
  } catch {
    return []
  }
}
