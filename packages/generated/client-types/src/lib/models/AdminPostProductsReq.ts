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
   * The description of the Product.
   */
  description?: string
  /**
   * A flag to indicate if the Product represents a Gift Card. Purchasing Products with this flag set to `true` will result in a Gift Card being created.
   */
  is_giftcard?: boolean
  /**
   * A flag to indicate if discounts can be applied to the Line Items generated from this Product
   */
  discountable?: boolean
  /**
   * An array of images of the Product. Each value in the array is a URL to the image. You can use the upload API Routes to upload the image and obtain a URL.
   */
  images?: Array<string>
  /**
   * The thumbnail to use for the Product. The value is a URL to the thumbnail. You can use the upload API Routes to upload the thumbnail and obtain a URL.
   */
  thumbnail?: string
  /**
   * A unique handle to identify the Product by. If not provided, the kebab-case version of the product title will be used. This can be used as a slug in URLs.
   */
  handle?: string
  /**
   * The status of the product. The product is shown to the customer only if its status is `published`.
   */
  status?: "draft" | "proposed" | "published" | "rejected"
  /**
   * The Product Type to associate the Product with.
   */
  type?: {
    /**
     * The ID of an existing Product Type. If not provided, a new product type will be created.
     */
    id?: string
    /**
     * The value of the Product Type.
     */
    value: string
  }
  /**
   * The ID of the Product Collection the Product belongs to.
   */
  collection_id?: string
  /**
   * Product Tags to associate the Product with.
   */
  tags?: Array<{
    /**
     * The ID of an existing Product Tag. If not provided, a new product tag will be created.
     */
    id?: string
    /**
     * The value of the Tag. If the `id` is provided, the value of the existing tag will be updated.
     */
    value: string
  }>
  /**
   * Sales channels to associate the Product with.
   */
  sales_channels?: Array<{
    /**
     * The ID of an existing Sales channel.
     */
    id: string
  }>
  /**
   * Product categories to add the Product to.
   */
  categories?: Array<{
    /**
     * The ID of a Product Category.
     */
    id: string
  }>
  /**
   * The Options that the Product should have. A new product option will be created for every item in the array.
   */
  options?: Array<{
    /**
     * The title of the Product Option.
     */
    title: string
  }>
  /**
   * An array of Product Variants to create with the Product. Each product variant must have a unique combination of Product Option values.
   */
  variants?: Array<{
    /**
     * The title of the Product Variant.
     */
    title: string
    /**
     * The unique SKU of the Product Variant.
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
     * A generic GTIN field of the Product Variant.
     */
    barcode?: string
    /**
     * The Harmonized System code of the Product Variant.
     */
    hs_code?: string
    /**
     * The amount of stock kept of the Product Variant.
     */
    inventory_quantity?: number
    /**
     * Whether the Product Variant can be purchased when out of stock.
     */
    allow_backorder?: boolean
    /**
     * Whether Medusa should keep track of the inventory of this Product Variant.
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
     * The Manufacturer Identification code of the Product Variant.
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
    /**
     * An array of product variant prices. A product variant can have different prices for each region or currency code.
     */
    prices?: Array<{
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
     * An array of Product Option values that the variant corresponds to. The option values should be added into the array in the same index as in the `options` field of the product.
     */
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
   * The Harmonized System code of the Product.
   */
  hs_code?: string
  /**
   * The country of origin of the Product.
   */
  origin_country?: string
  /**
   * The Manufacturer Identification code of the Product.
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
