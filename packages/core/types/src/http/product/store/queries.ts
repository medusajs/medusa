import {
  BaseProductOptionParams,
  BaseProductParams,
  BaseProductTagParams,
  BaseProductTypeParams,
  BaseProductVariantParams,
} from "../common"

export interface StoreProductTagParams extends BaseProductTagParams {}
export interface StoreProductTypeParams extends BaseProductTypeParams {}
export interface StoreProductOptionParams extends BaseProductOptionParams {}
export interface StoreProductVariantParams extends BaseProductVariantParams {}
export interface StoreProductParams extends BaseProductParams {
  // The region ID and currency_code are not params, but are used for the pricing context. Maybe move to separate type definition.
  region_id?: string
  currency_code?: string
  variants?: StoreProductVariantParams
}
