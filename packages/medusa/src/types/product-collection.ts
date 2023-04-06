export type CreateProductCollection = {
  title: string
  handle?: string
  metadata?: Record<string, unknown>
}

export type UpdateProductCollection = {
  title?: string
  handle?: string
  metadata?: Record<string, unknown>
}
