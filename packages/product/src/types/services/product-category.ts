export interface CreateProductCategoryDTO {
  name: string
  handle?: string
  is_active?: boolean
  is_internal?: boolean
  rank?: number
  parent_category_id: string | null
  metadata?: Record<string, unknown>
}

export interface UpdateProductCategoryDTO {
  name?: string
  handle?: string
  is_active?: boolean
  is_internal?: boolean
  rank?: number
  parent_category_id?: string | null
  metadata?: Record<string, unknown>
}