/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface InventoryItemDTO {
  /**
   * The Stock Keeping Unit (SKU) code of the Inventory Item.
   */
  sku: string
  /**
   * The Harmonized System code of the Inventory Item. May be used by Fulfillment Providers to pass customs information to shipping carriers.
   */
  hs_code?: string
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
   * The weight of the Inventory Item. May be used in shipping rate calculations.
   */
  weight?: number
  /**
   * The height of the Inventory Item. May be used in shipping rate calculations.
   */
  height?: number
  /**
   * The width of the Inventory Item. May be used in shipping rate calculations.
   */
  width?: number
  /**
   * The length of the Inventory Item. May be used in shipping rate calculations.
   */
  length?: number
  /**
   * Whether the item requires shipping.
   */
  requires_shipping?: boolean
  /**
   * An optional key-value map with additional details
   */
  metadata?: Record<string, any>
  /**
   * The date with timezone at which the resource was created.
   */
  created_at?: string
  /**
   * The date with timezone at which the resource was updated.
   */
  updated_at?: string
  /**
   * The date with timezone at which the resource was deleted.
   */
  deleted_at?: string
}
