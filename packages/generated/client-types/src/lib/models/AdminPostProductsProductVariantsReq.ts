/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface AdminPostProductsProductVariantsReq {
  /**
   * The title to identify the Product Variant by.
   */
  title: string
  /**
   * The unique SKU for the Product Variant.
   */
  sku?: string
  /**
   * The EAN number of the item.
   */
  ean?: string
  /**
   * The UPC number of the item.
   */
  upc?: string
  /**
   * A generic GTIN field for the Product Variant.
   */
  barcode?: string
  /**
   * The Harmonized System code for the Product Variant.
   */
  hs_code?: string
  /**
   * The amount of stock kept for the Product Variant.
   */
  inventory_quantity?: number
  /**
   * Whether the Product Variant can be purchased when out of stock.
   */
  allow_backorder?: boolean
  /**
   * Whether Medusa should keep track of the inventory for this Product Variant.
   */
  manage_inventory?: boolean
  /**
   * The wieght of the Product Variant.
   */
  weight?: number
  /**
   * The length of the Product Variant.
   */
  length?: number
  /**
   * The height of the Product Variant.
   */
  height?: number
  /**
   * The width of the Product Variant.
   */
  width?: number
  /**
   * The country of origin of the Product Variant.
   */
  origin_country?: string
  /**
   * The Manufacturer Identification code for the Product Variant.
   */
  mid_code?: string
  /**
   * The material composition of the Product Variant.
   */
  material?: string
  /**
   * An optional set of key-value pairs with additional information.
   */
  metadata?: Record<string, any>
  prices: Array<{
    /**
     * The ID of the price.
     */
    id?: string
    /**
     * The ID of the Region for which the price is used. Only required if currency_code is not provided.
     */
    region_id?: string
    /**
     * The 3 character ISO currency code for which the price will be used. Only required if region_id is not provided.
     */
    currency_code?: string
    /**
     * The amount to charge for the Product Variant.
     */
    amount: number
    /**
     * The minimum quantity for which the price will be used.
     */
    min_quantity?: number
    /**
     * The maximum quantity for which the price will be used.
     */
    max_quantity?: number
  }>
  options: Array<{
    /**
     * The ID of the Product Option to set the value for.
     */
    option_id: string
    /**
     * The value to give for the Product Option.
     */
    value: string
  }>
}
