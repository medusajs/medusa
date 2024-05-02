/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { Cart } from "./Cart"
import type { ClaimOrder } from "./ClaimOrder"
import type { Order } from "./Order"
import type { Return } from "./Return"
import type { ShippingMethodTaxLine } from "./ShippingMethodTaxLine"
import type { ShippingOption } from "./ShippingOption"
import type { Swap } from "./Swap"

/**
 * A Shipping Method represents a way in which an Order or Return can be shipped. Shipping Methods are created from a Shipping Option, but may contain additional details that can be necessary for the Fulfillment Provider to handle the shipment. If the shipping method is created for a return, it may be associated with a claim or a swap that the return is part of.
 */
export interface ShippingMethod {
  /**
   * The shipping method's ID
   */
  id: string
  /**
   * The ID of the Shipping Option that the Shipping Method is built from.
   */
  shipping_option_id: string
  /**
   * The ID of the order that the shipping method is used in.
   */
  order_id: string | null
  /**
   * The details of the order that the shipping method is used in.
   */
  order?: Order | null
  /**
   * The ID of the claim that the shipping method is used in.
   */
  claim_order_id: string | null
  /**
   * The details of the claim that the shipping method is used in.
   */
  claim_order?: ClaimOrder | null
  /**
   * The ID of the cart that the shipping method is used in.
   */
  cart_id: string | null
  /**
   * The details of the cart that the shipping method is used in.
   */
  cart?: Cart | null
  /**
   * The ID of the swap that the shipping method is used in.
   */
  swap_id: string | null
  /**
   * The details of the swap that the shipping method is used in.
   */
  swap?: Swap | null
  /**
   * The ID of the return that the shipping method is used in.
   */
  return_id: string | null
  /**
   * The details of the return that the shipping method is used in.
   */
  return_order?: Return | null
  /**
   * The details of the shipping option the method was created from.
   */
  shipping_option?: ShippingOption | null
  /**
   * The details of the tax lines applied on the shipping method.
   */
  tax_lines?: Array<ShippingMethodTaxLine>
  /**
   * The amount to charge for the Shipping Method. The currency of the price is defined by the Region that the Order that the Shipping Method belongs to is a part of.
   */
  price: number
  /**
   * Additional data that the Fulfillment Provider needs to fulfill the shipment. This is used in combination with the Shipping Options data, and may contain information such as a drop point id.
   */
  data: Record<string, any>
  /**
   * Whether the shipping method price include tax
   */
  includes_tax?: boolean
  /**
   * The subtotal of the shipping
   */
  subtotal?: number
  /**
   * The total amount of the shipping
   */
  total?: number
  /**
   * The total of tax
   */
  tax_total?: number
}
