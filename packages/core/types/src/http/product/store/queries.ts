import {
  BaseProductListParams,
  BaseProductOptionParams,
  BaseProductVariantParams,
} from "../common"

export interface StoreProductOptionParams extends BaseProductOptionParams {}
export interface StoreProductVariantParams extends BaseProductVariantParams {}
export interface StoreProductParams extends BaseProductListParams {
  // The region ID and currency_code are not params, but are used for the pricing context. Maybe move to separate type definition.
  region_id?: string
  currency_code?: string
  variants?: StoreProductVariantParams
}
