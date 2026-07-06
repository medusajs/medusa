import {
  BaseProductCategoryListParams,
  BaseProductCategoryParams,
} from "../common"

export interface AdminProductCategoryListParams
  extends Omit<BaseProductCategoryListParams, "name"> {
  /**
   * Filter by whether the category is only available internally.
   */
  is_internal?: boolean
  /**
   * Filter by whether the category is active.
   */
  is_active?: boolean
}

export interface AdminProductCategoryParams extends BaseProductCategoryParams {}
