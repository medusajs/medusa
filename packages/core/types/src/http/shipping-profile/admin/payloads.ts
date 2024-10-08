export interface AdminCreateShippingProfile {
  name: string
  type: string
  metadata?: Record<string, unknown>
}

export interface AdminUpdateShippingProfile {
  name?: string
  type?: string
  metadata?: Record<string, unknown> | null
}
