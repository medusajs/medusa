import { BaseProduct } from "../product/common"

export interface ProductCategory {
  id: string
  name: string
  description: string | null
  handle: string
  is_active: boolean
  is_internal: boolean
  rank: number | null
  parent_category_id: string | null
  parent_category: ProductCategory | null
  category_children: ProductCategory[]
  products?: BaseProduct[]
  created_at: string
  updated_at: string
  deleted_at: string | null
}
