export interface AdminCreateInventoryItem {
  sku?: string
  hs_code?: string
  weight?: number
  length?: number
  height?: number
  width?: number
  origin_country?: string
  mid_code?: string
  material?: string
  title?: string
  description?: string
  requires_shipping?: boolean
  thumbnail?: string
  metadata?: Record<string, unknown>
}

export interface AdminUpdateInventoryItem extends AdminCreateInventoryItem {}
