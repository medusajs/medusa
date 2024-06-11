import { BaseProductCategoryParams } from "../common"

export interface AdminProductCategoryListParams
  extends BaseProductCategoryParams {
  is_internal?: boolean
  is_active?: boolean
}

export interface AdminProductCategoryParams extends BaseProductCategoryParams {}
