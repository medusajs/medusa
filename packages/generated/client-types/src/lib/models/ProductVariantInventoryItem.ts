/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { ProductVariant } from "./ProductVariant"

/**
 * Product Variant Inventory Items link variants with inventory items and denote the number of inventory items constituting a variant.
 */
export interface ProductVariantInventoryItem {
  /**
   * The product variant inventory item's ID
   */
  id: string
  /**
   * The id of the inventory item
   */
  inventory_item_id: string
  /**
   * The id of the variant.
   */
  variant_id: string
  /**
   * A ProductVariant object. Available if the relation `variant` is expanded.
   */
  variant?: ProductVariant | null
  /**
   * The quantity of an inventory item required for one quantity of the variant.
   */
  required_quantity: number
  /**
   * The date with timezone at which the resource was created.
   */
  created_at: string
  /**
   * The date with timezone at which the resource was updated.
   */
  updated_at: string
  /**
   * The date with timezone at which the resource was deleted.
   */
  deleted_at: string | null
}
