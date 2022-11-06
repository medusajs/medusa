export type CreateProductType = {
  value: string
  images?: string[]
  thumbnail?: string
  metadata?: Record<string, unknown>
}

export type UpdateProductType = {
  value?: string
  images?: string[]
  thumbnail?: string
  metadata?: Record<string, unknown>
}
