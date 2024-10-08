export interface AdminCreateSalesChannel {
  name: string
  description?: string
  is_disabled?: boolean
  metadata?: Record<string, unknown>
}

export interface AdminUpdateSalesChannel {
  name?: string
  description?: string | null
  is_disabled?: boolean
  metadata?: Record<string, unknown>
}

export interface AdminUpdateSalesChannelProducts {
  add?: string[]
  remove?: string[]
}
