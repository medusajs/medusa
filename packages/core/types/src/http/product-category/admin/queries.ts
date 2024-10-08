import {
  BaseProductCategoryListParams,
  BaseProductCategoryParams,
} from "../common"

export interface AdminProductCategoryListParams
  extends BaseProductCategoryListParams {
  is_internal?: boolean
  is_active?: boolean
}

export interface AdminProductCategoryParams extends BaseProductCategoryParams {}
