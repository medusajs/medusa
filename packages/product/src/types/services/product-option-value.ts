export interface UpdateProductOptionValueDTO {
  id: string
  value: string
  option: string
  metadata?: Record<string, unknown> | null
}

export interface CreateProductOptionValueDTO {
  id?: string
  value: string
  option: string
  variant: string
  metadata?: Record<string, unknown> | null
}
