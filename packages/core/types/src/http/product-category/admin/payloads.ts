export interface AdminCreateProductCategory {
  name: string
  description?: string
  handle?: string
  is_internal?: boolean
  is_active?: boolean
  parent_category_id?: string
  rank?: number
  metadata?: Record<string, unknown>
}

export interface AdminUpdateProductCategory {
  name?: string
  description?: string
  handle?: string
  is_internal?: boolean
  is_active?: boolean
  parent_category_id?: string | null
  rank?: number
  metadata?: Record<string, unknown>
}

export interface AdminUpdateProductCategoryProducts {
  add?: string[]
  remove?: string[]
}
