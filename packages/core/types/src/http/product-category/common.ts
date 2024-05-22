export interface ProductCategoryResponse {
  id: string
  name: string
  description: string | null
  handle: string | null
  is_active: boolean
  is_internal: boolean
  rank: number | null
  parent_category_id: string | null
  created_at: string | Date
  updated_at: string | Date

  parent_category: ProductCategoryResponse
  category_children: ProductCategoryResponse[]
}
