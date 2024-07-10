import {
  BaseProductListParams,
  BaseProductOptionParams,
  BaseProductVariantParams,
} from "../common"

export interface AdminProductOptionParams extends BaseProductOptionParams {}
export interface AdminProductVariantParams extends BaseProductVariantParams {}
export interface AdminProductListParams extends BaseProductListParams {
  price_list_id?: string | string[]
  variants?: AdminProductVariantParams
}
