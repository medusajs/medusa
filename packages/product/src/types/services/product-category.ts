export type ProductCategoryEventData = {
  id: string
}

export enum ProductCategoryEvents {
  CATEGORY_UPDATED = "product-category.updated",
  CATEGORY_CREATED = "product-category.created",
  CATEGORY_DELETED = "product-category.deleted",
}

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
