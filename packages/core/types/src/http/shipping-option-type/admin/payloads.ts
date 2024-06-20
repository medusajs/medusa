export interface AdminCreateShippingOptionType {
  label: string
  description?: string
  code?: string
  metadata?: Record<string, unknown>
}

export interface AdminUpdateShippingOptionType {
  label?: string
  description?: string
  code?: string
  metadata?: Record<string, unknown> | null
}
