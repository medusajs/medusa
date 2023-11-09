/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface AdminPostInventoryItemsReq {
  /**
   * The ID of the variant to create the inventory item for.
   */
  variant_id: string
  /**
   * The unique SKU of the associated Product Variant.
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
   * The Harmonized System code of the Inventory Item. May be used by Fulfillment Providers to pass customs information to shipping carriers.
   */
  hs_code?: string
  /**
   * The amount of stock kept of the associated Product Variant.
   */
  inventory_quantity?: number
  /**
   * Whether the associated Product Variant can be purchased when out of stock.
   */
  allow_backorder?: boolean
  /**
   * Whether Medusa should keep track of the inventory for the associated Product Variant.
   */
  manage_inventory?: boolean
  /**
   * The weight of the Inventory Item. May be used in shipping rate calculations.
   */
  weight?: number
  /**
   * The length of the Inventory Item. May be used in shipping rate calculations.
   */
  length?: number
  /**
   * The height of the Inventory Item. May be used in shipping rate calculations.
   */
  height?: number
  /**
   * The width of the Inventory Item. May be used in shipping rate calculations.
   */
  width?: number
  /**
   * The country in which the Inventory Item was produced. May be used by Fulfillment Providers to pass customs information to shipping carriers.
   */
  origin_country?: string
  /**
   * The Manufacturers Identification code that identifies the manufacturer of the Inventory Item. May be used by Fulfillment Providers to pass customs information to shipping carriers.
   */
  mid_code?: string
  /**
   * The material and composition that the Inventory Item is made of, May be used by Fulfillment Providers to pass customs information to shipping carriers.
   */
  material?: string
  /**
   * The inventory item's title.
   */
  title?: string
  /**
   * The inventory item's description.
   */
  description?: string
  /**
   * The inventory item's thumbnail.
   */
  thumbnail?: string
  /**
   * An optional set of key-value pairs with additional information.
   */
  metadata?: Record<string, any>
}
