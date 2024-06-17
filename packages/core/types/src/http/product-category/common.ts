import { BaseFilterable, OperatorMap } from "../../dal"
import { FindParams, SelectParams } from "../common"
import { BaseProduct } from "../product/common"

export interface BaseProductCategory {
  id: string
  name: string
  description: string
  handle: string
  is_active: boolean
  is_internal: boolean
  rank: number | null
  parent_category_id: string | null
  parent_category: BaseProductCategory | null
  category_children: BaseProductCategory[]
  products?: BaseProduct[]
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface BaseProductCategoryListParams
  extends FindParams,
    BaseFilterable<BaseProductCategoryListParams> {
  q?: string
  id?: string | string[]
  name?: string | string[]
  description?: string | string[]
  parent_category_id?: string | string[] | null
  handle?: string | string[]
  is_active?: boolean
  is_internal?: boolean
  include_descendants_tree?: boolean
  include_ancestors_tree?: boolean
  created_at?: OperatorMap<string>
  updated_at?: OperatorMap<string>
  deleted_at?: OperatorMap<string>
}

export interface BaseProductCategoryParams extends SelectParams {
  include_ancestors_tree?: boolean
  include_descendants_tree?: boolean
}
