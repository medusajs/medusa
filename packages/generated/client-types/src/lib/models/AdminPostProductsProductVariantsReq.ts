/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface AdminPostProductsProductVariantsReq {
  /**
   * The title of the product variant.
   */
  title: string
  /**
   * The unique SKU of the product variant.
   */
  sku?: string
  /**
   * The EAN number of the product variant.
   */
  ean?: string
  /**
   * The UPC number of the product variant.
   */
  upc?: string
  /**
   * A generic GTIN field of the product variant.
   */
  barcode?: string
  /**
   * The Harmonized System code of the product variant.
   */
  hs_code?: string
  /**
   * The amount of stock kept of the product variant.
   */
  inventory_quantity?: number
  /**
   * Whether the product variant can be purchased when out of stock.
   */
  allow_backorder?: boolean
  /**
   * Whether Medusa should keep track of the inventory of this product variant.
   */
  manage_inventory?: boolean
  /**
   * The wieght of the product variant.
   */
  weight?: number
  /**
   * The length of the product variant.
   */
  length?: number
  /**
   * The height of the product variant.
   */
  height?: number
  /**
   * The width of the product variant.
   */
  width?: number
  /**
   * The country of origin of the product variant.
   */
  origin_country?: string
  /**
   * The Manufacturer Identification code of the product variant.
   */
  mid_code?: string
  /**
   * The material composition of the product variant.
   */
  material?: string
  /**
   * An optional set of key-value pairs with additional information.
   */
  metadata?: Record<string, any>
  /**
   * An array of product variant prices. A product variant can have different prices for each region or currency code.
   */
  prices: Array<{
    /**
     * The ID of the Region the price will be used in. This is only required if `currency_code` is not provided.
     */
    region_id?: string
    /**
     * The 3 character ISO currency code the price will be used in. This is only required if `region_id` is not provided.
     */
    currency_code?: string
    /**
     * The price amount.
     */
    amount: number
    /**
     * The minimum quantity required to be added to the cart for the price to be used.
     */
    min_quantity?: number
    /**
     * The maximum quantity required to be added to the cart for the price to be used.
     */
    max_quantity?: number
  }>
  /**
   * An array of Product Option values that the variant corresponds to.
   */
  options: Array<{
    /**
     * The ID of the Product Option.
     */
    option_id: string
    /**
     * A value to give to the Product Option.
     */
    value: string
  }>
}
