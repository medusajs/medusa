import {
  BaseProductCategoryListParams,
  BaseProductCategoryParams,
} from "../common"

export interface StoreProductCategoryListParams
  extends Omit<BaseProductCategoryListParams, "is_internal" | "is_active"> {}

export interface StoreProductCategoryParams extends BaseProductCategoryParams {}
