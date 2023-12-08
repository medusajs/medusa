/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { MoneyAmount } from "./MoneyAmount"
import type { Product } from "./Product"
import type { ProductOptionValue } from "./ProductOptionValue"
import type { ProductVariantInventoryItem } from "./ProductVariantInventoryItem"

/**
 * A Product Variant represents a Product with a specific set of Product Option configurations. The maximum number of Product Variants that a Product can have is given by the number of available Product Option combinations. A product must at least have one product variant.
 */
export interface ProductVariant {
  /**
   * The product variant's ID
   */
  id: string
  /**
   * A title that can be displayed for easy identification of the Product Variant.
   */
  title: string
  /**
   * The ID of the product that the product variant belongs to.
   */
  product_id: string
  /**
   * The details of the product that the product variant belongs to.
   */
  product?: Product | null
  /**
   * The details of the prices of the Product Variant, each represented as a Money Amount. Each Money Amount represents a price in a given currency or a specific Region.
   */
  prices?: Array<MoneyAmount>
  /**
   * The unique stock keeping unit used to identify the Product Variant. This will usually be a unique identifer for the item that is to be shipped, and can be referenced across multiple systems.
   */
  sku: string | null
  /**
   * A generic field for a GTIN number that can be used to identify the Product Variant.
   */
  barcode: string | null
  /**
   * An EAN barcode number that can be used to identify the Product Variant.
   */
  ean: string | null
  /**
   * A UPC barcode number that can be used to identify the Product Variant.
   */
  upc: string | null
  /**
   * The ranking of this variant
   */
  variant_rank?: number | null
  /**
   * The current quantity of the item that is stocked.
   */
  inventory_quantity: number
  /**
   * Whether the Product Variant should be purchasable when `inventory_quantity` is 0.
   */
  allow_backorder: boolean
  /**
   * Whether Medusa should manage inventory for the Product Variant.
   */
  manage_inventory: boolean
  /**
   * The Harmonized System code of the Product Variant. May be used by Fulfillment Providers to pass customs information to shipping carriers.
   */
  hs_code: string | null
  /**
   * The country in which the Product Variant was produced. May be used by Fulfillment Providers to pass customs information to shipping carriers.
   */
  origin_country: string | null
  /**
   * The Manufacturers Identification code that identifies the manufacturer of the Product Variant. May be used by Fulfillment Providers to pass customs information to shipping carriers.
   */
  mid_code: string | null
  /**
   * The material and composition that the Product Variant is made of, May be used by Fulfillment Providers to pass customs information to shipping carriers.
   */
  material: string | null
  /**
   * The weight of the Product Variant. May be used in shipping rate calculations.
   */
  weight: number | null
  /**
   * The length of the Product Variant. May be used in shipping rate calculations.
   */
  length: number | null
  /**
   * The height of the Product Variant. May be used in shipping rate calculations.
   */
  height: number | null
  /**
   * The width of the Product Variant. May be used in shipping rate calculations.
   */
  width: number | null
  /**
   * The details of the product options that this product variant defines values for.
   */
  options?: Array<ProductOptionValue>
  /**
   * The details inventory items of the product variant.
   */
  inventory_items?: Array<ProductVariantInventoryItem>
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
  /**
   * An optional key-value map with additional details
   */
  metadata: Record<string, any> | null
  /**
   * Only used with the inventory modules.
   * A boolean value indicating whether the Product Variant is purchasable.
   * A variant is purchasable if:
   * - inventory is not managed
   * - it has no inventory items
   * - it is in stock
   * - it is backorderable.
   *
   */
  purchasable?: boolean
}
