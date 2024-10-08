export interface AdminCreateProductTag {
  value: string
  metadata?: Record<string, unknown> | null
}

export interface AdminUpdateProductTag {
  value?: string
  metadata?: Record<string, unknown> | null
}
