/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { ShippingOption } from "./ShippingOption"

/**
 * A requirement that a Cart must satisfy for the Shipping Option to be available to the Cart.
 */
export interface ShippingOptionRequirement {
  /**
   * The shipping option requirement's ID
   */
  id: string
  /**
   * The id of the Shipping Option that the hipping option requirement belongs to
   */
  shipping_option_id: string
  /**
   * Available if the relation `shipping_option` is expanded.
   */
  shipping_option?: ShippingOption | null
  /**
   * The type of the requirement, this defines how the value will be compared to the Cart's total. `min_subtotal` requirements define the minimum subtotal that is needed for the Shipping Option to be available, while the `max_subtotal` defines the maximum subtotal that the Cart can have for the Shipping Option to be available.
   */
  type: "min_subtotal" | "max_subtotal"
  /**
   * The amount to compare the Cart subtotal to.
   */
  amount: number
  /**
   * The date with timezone at which the resource was deleted.
   */
  deleted_at: string | null
}
