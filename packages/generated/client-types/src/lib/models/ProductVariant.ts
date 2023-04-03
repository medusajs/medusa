/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { MoneyAmount } from "./MoneyAmount"
import type { Product } from "./Product"
import type { ProductOptionValue } from "./ProductOptionValue"
import type { ProductVariantInventoryItem } from "./ProductVariantInventoryItem"

/**
 * Product Variants represent a Product with a specific set of Product Option configurations. The maximum number of Product Variants that a Product can have is given by the number of available Product Option combinations.
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
   * The ID of the Product that the Product Variant belongs to.
   */
  product_id: string
  /**
   * A product object. Available if the relation `product` is expanded.
   */
  product?: Product | null
  /**
   * The Money Amounts defined for the Product Variant. Each Money Amount represents a price in a given currency or a price in a specific Region. Available if the relation `prices` is expanded.
   */
  prices?: Array<MoneyAmount>
  /**
   * The unique stock keeping unit used to identify the Product Variant. This will usually be a unqiue identifer for the item that is to be shipped, and can be referenced across multiple systems.
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
   * The Product Option Values specified for the Product Variant. Available if the relation `options` is expanded.
   */
  options?: Array<ProductOptionValue>
  /**
   * The Inventory Items related to the product variant. Available if the relation `inventory_items` is expanded.
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
}
