/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { Address } from "./Address"
import type { Customer } from "./Customer"
import type { Discount } from "./Discount"
import type { GiftCard } from "./GiftCard"
import type { LineItem } from "./LineItem"
import type { Payment } from "./Payment"
import type { PaymentSession } from "./PaymentSession"
import type { Region } from "./Region"
import type { SalesChannel } from "./SalesChannel"
import type { ShippingMethod } from "./ShippingMethod"

/**
 * Represents a user cart
 */
export interface Cart {
  /**
   * The cart's ID
   */
  id: string
  /**
   * The email associated with the cart
   */
  email: string | null
  /**
   * The billing address's ID
   */
  billing_address_id: string | null
  /**
   * Available if the relation `billing_address` is expanded.
   */
  billing_address?: Address | null
  /**
   * The shipping address's ID
   */
  shipping_address_id: string | null
  /**
   * Available if the relation `shipping_address` is expanded.
   */
  shipping_address?: Address | null
  /**
   * Available if the relation `items` is expanded.
   */
  items?: Array<LineItem>
  /**
   * The region's ID
   */
  region_id: string
  /**
   * A region object. Available if the relation `region` is expanded.
   */
  region?: Region | null
  /**
   * Available if the relation `discounts` is expanded.
   */
  discounts?: Array<Discount>
  /**
   * Available if the relation `gift_cards` is expanded.
   */
  gift_cards?: Array<GiftCard>
  /**
   * The customer's ID
   */
  customer_id: string | null
  /**
   * A customer object. Available if the relation `customer` is expanded.
   */
  customer?: Customer | null
  /**
   * The selected payment session in the cart.
   */
  payment_session: PaymentSession | null
  /**
   * The payment sessions created on the cart.
   */
  payment_sessions?: Array<PaymentSession>
  /**
   * The payment's ID if available
   */
  payment_id: string | null
  /**
   * Available if the relation `payment` is expanded.
   */
  payment?: Payment | null
  /**
   * The shipping methods added to the cart.
   */
  shipping_methods?: Array<ShippingMethod>
  /**
   * The cart's type.
   */
  type: "default" | "swap" | "draft_order" | "payment_link" | "claim"
  /**
   * The date with timezone at which the cart was completed.
   */
  completed_at: string | null
  /**
   * The date with timezone at which the payment was authorized.
   */
  payment_authorized_at: string | null
  /**
   * Randomly generated key used to continue the completion of a cart in case of failure.
   */
  idempotency_key: string | null
  /**
   * The context of the cart which can include info like IP or user agent.
   */
  context: Record<string, any> | null
  /**
   * The sales channel ID the cart is associated with.
   */
  sales_channel_id?: string | null
  /**
   * A sales channel object. Available if the relation `sales_channel` is expanded.
   */
  sales_channel?: SalesChannel | null
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
   * The total of shipping
   */
  shipping_total?: number
  /**
   * The total of discount rounded
   */
  discount_total?: number
  /**
   * The total of discount
   */
  raw_discount_total?: number
  /**
   * The total of items with taxes
   */
  item_tax_total?: number
  /**
   * The total of shipping with taxes
   */
  shipping_tax_total?: number
  /**
   * The total of tax
   */
  tax_total?: number
  /**
   * The total amount refunded if the order associated with this cart is returned.
   */
  refunded_total?: number
  /**
   * The total amount of the cart
   */
  total?: number
  /**
   * The subtotal of the cart
   */
  subtotal?: number
  /**
   * The amount that can be refunded
   */
  refundable_amount?: number
  /**
   * The total of gift cards
   */
  gift_card_total?: number
  /**
   * The total of gift cards with taxes
   */
  gift_card_tax_total?: number
}
