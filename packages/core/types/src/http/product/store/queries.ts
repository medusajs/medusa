import { SelectParams } from "../../common"
import {
  BaseProductListParams,
  BaseProductOptionParams,
  BaseProductVariantParams,
} from "../common"

/**
 * The product option's details.
 */
export interface StoreProductOptionParams extends BaseProductOptionParams {}
export interface StoreProductVariantParams extends BaseProductVariantParams {
  sku?: string | string[]
  manage_inventory?: boolean
  allow_backorder?: boolean
  product_id?: string | string[]
}
export interface StoreProductPricingContext {
  /**
   * The ID of the customer's region. This parameter must be included if you want to apply taxes on the product variant's price.
   */
  region_id?: string
  /**
   * The customer's country code. This parameter must be included if you want to apply taxes on the product variant's price.
   */
  country_code?: string
  /**
   * The lower-case [ISO 3166-2](https://en.wikipedia.org/wiki/ISO_3166-2) province, which can be taken from a customer's address. This parameter helps further narrowing down the taxes applied on a the product variant's prices.
   */
  province?: string
  /**
   * The ID of the customer's cart, if available. If set, the cart's region and shipping address's country code and province are used instead of the `region_id`, `country_code`, and `province` parameters.
   */
  cart_id?: string
}
export interface StoreProductParams
  extends SelectParams,
    StoreProductPricingContext {
  /**
   * The locale code in BCP 47 format. Information of the
   * product and related entities will be localized based on the provided locale.
   *
   * Learn more in the [Serve Translations in Storefront](https://docs.medusajs.com/resources/commerce-modules/translations/storefront) guide.
   *
   * @example
   * "en-US"
   * 
   * @http-validation-ignore
   */
  locale?: string
}

export interface StoreProductListParams
  extends Omit<
      BaseProductListParams,
      "tags" | "status" | "categories" | "deleted_at" | "with_deleted"
    >,
    StoreProductPricingContext {
  /**
   * Filter by the product's tag(s).
   */
  tag_id?: string | string[]
  /**
   * Filter by the product's variants.
   */
  variants?: StoreProductVariantParams & {
    /**
     * Filter by variant sku(s).
     *
     * @since 2.13.7
     */
    sku?: string | string[]
    /**
     * Filter by variant ean(s).
     *
     * @since 2.13.7
     */
    ean?: string | string[]
    /**
     * Filter by variant upc(s).
     *
     * @since 2.13.7
     */
    upc?: string | string[]
    /**
     * Filter by variant barcode(s).
     *
     * @since 2.13.7
     */
    barcode?: string | string[]
  }
  /**
   * The locale code in BCP 47 format. Information of the
   * product and related entities will be localized based on the provided locale.
   *
   * Learn more in the [Serve Translations in Storefront](https://docs.medusajs.com/resources/commerce-modules/translations/storefront) guide.
   *
   * @example
   * "en-US"
   */
  locale?: string
}
