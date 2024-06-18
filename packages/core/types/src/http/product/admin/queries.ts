import {
  BaseProductListParams,
  BaseProductOptionParams,
  BaseProductTagParams,
  BaseProductVariantParams,
} from "../common"

export interface AdminProductTagParams extends BaseProductTagParams {}
export interface AdminProductOptionParams extends BaseProductOptionParams {}
export interface AdminProductVariantParams extends BaseProductVariantParams {}
export interface AdminProductListParams extends BaseProductListParams {
  price_list_id?: string | string[]
  variants?: AdminProductVariantParams
}
