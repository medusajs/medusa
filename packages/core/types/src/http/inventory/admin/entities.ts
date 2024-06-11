export interface AdminInventoryItem {
  id: string
  sku?: string | null
  origin_country?: string | null
  hs_code?: string | null
  requires_shipping: boolean
  mid_code?: string | null
  material?: string | null
  weight?: number | null
  length?: number | null
  height?: number | null
  width?: number | null
  title?: string | null
  description?: string | null
  thumbnail?: string | null
  metadata?: Record<string, unknown> | null
}
