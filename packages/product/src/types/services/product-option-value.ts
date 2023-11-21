export interface UpdateProductOptionValueDTO {
  id: string
  value: string
  option_id: string
  metadata?: Record<string, unknown> | null
}

export interface CreateProductOptionValueDTO {
  id?: string
  value: string
  option_id: string
  variant_id: string
  metadata?: Record<string, unknown> | null
}
