import {
  BaseProductListParams,
  BaseProductOptionParams,
  BaseProductVariantParams,
} from "../common"

export interface StoreProductOptionParams extends BaseProductOptionParams {}
export interface StoreProductVariantParams extends BaseProductVariantParams {}
export interface StoreProductParams
  extends Omit<BaseProductListParams, "tags" | "status" | "categories" | "deleted_at"> {
  /**
   * Filter by the product's tag(s).
   */
  tag_id?: string | string[]
  /**
   * The ID of the region the products are being viewed from. This is required if you're retrieving product variant prices with taxes.
   * 
   * @privateRemarks
   * The region ID and currency_code are not params, but are used for the pricing context. Maybe move to separate type definition.
   */
  region_id?: string
  /**
   * The currency code to retrieve prices in.
   */
  currency_code?: string
  /**
   * Filter by the product's variants.
   */
  variants?: Pick<StoreProductVariantParams, "options">
  /**
   * The province the products are being viewed from. This is useful to narrow down the tax context when calculating product variant prices with taxes.
   */
  province?: string
}
