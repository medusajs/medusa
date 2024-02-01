/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { Currency } from "./Currency"
import type { PriceList } from "./PriceList"
import type { ProductVariant } from "./ProductVariant"
import type { Region } from "./Region"

/**
 * A Money Amount represent a price amount, for example, a product variant's price or a price in a price list. Each Money Amount either has a Currency or Region associated with it to indicate the pricing in a given Currency or, for fully region-based pricing, the given price in a specific Region. If region-based pricing is used, the amount will be in the currency defined for the Region.
 */
export interface MoneyAmount {
  /**
   * The money amount's ID
   */
  id: string
  /**
   * The 3 character currency code that the money amount may belong to.
   */
  currency_code: string
  /**
   * The details of the currency that the money amount may belong to.
   */
  currency?: Currency | null
  /**
   * The amount in the smallest currecny unit (e.g. cents 100 cents to charge $1) that the Product Variant will cost.
   */
  amount: number
  /**
   * The minimum quantity that the Money Amount applies to. If this value is not set, the Money Amount applies to all quantities.
   */
  min_quantity: number | null
  /**
   * The maximum quantity that the Money Amount applies to. If this value is not set, the Money Amount applies to all quantities.
   */
  max_quantity: number | null
  /**
   * The ID of the price list that the money amount may belong to.
   */
  price_list_id: string | null
  /**
   * The details of the price list that the money amount may belong to.
   */
  price_list?: PriceList | null
  /**
   * The ID of the Product Variant contained in the Line Item.
   */
  variant_id: string | null
  /**
   * The details of the product variant that the money amount may belong to.
   */
  variant?: ProductVariant | null
  /**
   * The region's ID
   */
  region_id: string | null
  /**
   * The details of the region that the money amount may belong to.
   */
  region?: Region | null
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
