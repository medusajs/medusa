import { OperatorMap } from "../../../dal"
import { FindParams, SelectParams } from "../../common"

export interface AdminProductCategoryListParams extends FindParams {
  id?: string | string[]
  q?: string
  description?: string | string[]
  handle?: string | string[]
  parent_category_id?: string | string[]
  include_ancestors_tree?: boolean
  include_descendants_tree?: boolean
  is_internal?: boolean
  is_active?: boolean
  created_at?: OperatorMap<string>
  updated_at?: OperatorMap<string>
  deleted_at?: OperatorMap<string>
  $and?: AdminProductCategoryListParams[]
  $or?: AdminProductCategoryListParams[]
}

export interface AdminProductCategoryParams extends SelectParams {
  include_ancestors_tree?: boolean
  include_descendants_tree?: boolean
}
