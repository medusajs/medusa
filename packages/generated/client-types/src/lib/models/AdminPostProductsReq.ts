/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface AdminPostProductsReq {
  /**
   * The title of the Product
   */
  title: string
  /**
   * The subtitle of the Product
   */
  subtitle?: string
  /**
   * A description of the Product.
   */
  description?: string
  /**
   * A flag to indicate if the Product represents a Gift Card. Purchasing Products with this flag set to `true` will result in a Gift Card being created.
   */
  is_giftcard?: boolean
  /**
   * A flag to indicate if discounts can be applied to the LineItems generated from this Product
   */
  discountable?: boolean
  /**
   * Images of the Product.
   */
  images?: Array<string>
  /**
   * The thumbnail to use for the Product.
   */
  thumbnail?: string
  /**
   * A unique handle to identify the Product by.
   */
  handle?: string
  /**
   * The status of the product.
   */
  status?: "draft" | "proposed" | "published" | "rejected"
  /**
   * The Product Type to associate the Product with.
   */
  type?: {
    /**
     * The ID of the Product Type.
     */
    id?: string
    /**
     * The value of the Product Type.
     */
    value: string
  }
  /**
   * The ID of the Collection the Product should belong to.
   */
  collection_id?: string
  /**
   * Tags to associate the Product with.
   */
  tags?: Array<{
    /**
     * The ID of an existing Tag.
     */
    id?: string
    /**
     * The value of the Tag, these will be upserted.
     */
    value: string
  }>
  /**
   * [EXPERIMENTAL] Sales channels to associate the Product with.
   */
  sales_channels?: Array<{
    /**
     * The ID of an existing Sales channel.
     */
    id: string
  }>
  /**
   * Categories to add the Product to.
   */
  categories?: Array<any>
  /**
   * The Options that the Product should have. These define on which properties the Product's Product Variants will differ.
   */
  options?: Array<{
    /**
     * The title to identify the Product Option by.
     */
    title: string
  }>
  /**
   * A list of Product Variants to create with the Product.
   */
  variants?: Array<{
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
    prices?: Array<{
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
    options?: Array<{
      /**
       * The value to give for the Product Option at the same index in the Product's `options` field.
       */
      value: string
    }>
  }>
  /**
   * The weight of the Product.
   */
  weight?: number
  /**
   * The length of the Product.
   */
  length?: number
  /**
   * The height of the Product.
   */
  height?: number
  /**
   * The width of the Product.
   */
  width?: number
  /**
   * The Harmonized System code for the Product Variant.
   */
  hs_code?: string
  /**
   * The country of origin of the Product.
   */
  origin_country?: string
  /**
   * The Manufacturer Identification code for the Product.
   */
  mid_code?: string
  /**
   * The material composition of the Product.
   */
  material?: string
  /**
   * An optional set of key-value pairs with additional information.
   */
  metadata?: Record<string, any>
}
