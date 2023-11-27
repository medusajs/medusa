/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { Address } from "./Address"
import type { Cart } from "./Cart"
import type { ClaimOrder } from "./ClaimOrder"
import type { Currency } from "./Currency"
import type { Customer } from "./Customer"
import type { Discount } from "./Discount"
import type { DraftOrder } from "./DraftOrder"
import type { Fulfillment } from "./Fulfillment"
import type { GiftCard } from "./GiftCard"
import type { GiftCardTransaction } from "./GiftCardTransaction"
import type { LineItem } from "./LineItem"
import type { OrderEdit } from "./OrderEdit"
import type { Payment } from "./Payment"
import type { Refund } from "./Refund"
import type { Region } from "./Region"
import type { Return } from "./Return"
import type { SalesChannel } from "./SalesChannel"
import type { ShippingMethod } from "./ShippingMethod"
import type { Swap } from "./Swap"

/**
 * An order is a purchase made by a customer. It holds details about payment and fulfillment of the order. An order may also be created from a draft order, which is created by an admin user.
 */
export interface Order {
  /**
   * The order's ID
   */
  id: string
  /**
   * The order's status
   */
  status: "pending" | "completed" | "archived" | "canceled" | "requires_action"
  /**
   * The order's fulfillment status
   */
  fulfillment_status:
    | "not_fulfilled"
    | "partially_fulfilled"
    | "fulfilled"
    | "partially_shipped"
    | "shipped"
    | "partially_returned"
    | "returned"
    | "canceled"
    | "requires_action"
  /**
   * The order's payment status
   */
  payment_status:
    | "not_paid"
    | "awaiting"
    | "captured"
    | "partially_refunded"
    | "refunded"
    | "canceled"
    | "requires_action"
  /**
   * The order's display ID
   */
  display_id: number
  /**
   * The ID of the cart associated with the order
   */
  cart_id: string | null
  /**
   * The details of the cart associated with the order.
   */
  cart?: Cart | null
  /**
   * The ID of the customer associated with the order
   */
  customer_id: string
  /**
   * The details of the customer associated with the order.
   */
  customer?: Customer | null
  /**
   * The email associated with the order
   */
  email: string
  /**
   * The ID of the billing address associated with the order
   */
  billing_address_id: string | null
  /**
   * The details of the billing address associated with the order.
   */
  billing_address?: Address | null
  /**
   * The ID of the shipping address associated with the order
   */
  shipping_address_id: string | null
  /**
   * The details of the shipping address associated with the order.
   */
  shipping_address?: Address | null
  /**
   * The ID of the region this order was created in.
   */
  region_id: string
  /**
   * The details of the region this order was created in.
   */
  region?: Region | null
  /**
   * The 3 character currency code that is used in the order
   */
  currency_code: string
  /**
   * The details of the currency used in the order.
   */
  currency?: Currency | null
  /**
   * The order's tax rate
   */
  tax_rate: number | null
  /**
   * The details of the discounts applied on the order.
   */
  discounts?: Array<Discount>
  /**
   * The details of the gift card used in the order.
   */
  gift_cards?: Array<GiftCard>
  /**
   * The details of the shipping methods used in the order.
   */
  shipping_methods?: Array<ShippingMethod>
  /**
   * The details of the payments used in the order.
   */
  payments?: Array<Payment>
  /**
   * The details of the fulfillments created for the order.
   */
  fulfillments?: Array<Fulfillment>
  /**
   * The details of the returns created for the order.
   */
  returns?: Array<Return>
  /**
   * The details of the claims created for the order.
   */
  claims?: Array<ClaimOrder>
  /**
   * The details of the refunds created for the order.
   */
  refunds?: Array<Refund>
  /**
   * The details of the swaps created for the order.
   */
  swaps?: Array<Swap>
  /**
   * The ID of the draft order this order was created from.
   */
  draft_order_id: string | null
  /**
   * The details of the draft order this order was created from.
   */
  draft_order?: DraftOrder | null
  /**
   * The details of the line items that belong to the order.
   */
  items?: Array<LineItem>
  /**
   * The details of the order edits done on the order.
   */
  edits?: Array<OrderEdit>
  /**
   * The gift card transactions made in the order.
   */
  gift_card_transactions?: Array<GiftCardTransaction>
  /**
   * The date the order was canceled on.
   */
  canceled_at: string | null
  /**
   * Flag for describing whether or not notifications related to this should be send.
   */
  no_notification: boolean | null
  /**
   * Randomly generated key used to continue the processing of the order in case of failure.
   */
  idempotency_key: string | null
  /**
   * The ID of an external order.
   */
  external_id: string | null
  /**
   * The ID of the sales channel this order belongs to.
   */
  sales_channel_id?: string | null
  /**
   * The details of the sales channel this order belongs to.
   */
  sales_channel?: SalesChannel | null
  /**
   * The total of shipping
   */
  shipping_total?: number | null
  /**
   * The tax total applied on shipping
   */
  shipping_tax_total?: number
  /**
   * The total of discount
   */
  raw_discount_total?: number
  /**
   * The total of discount rounded
   */
  discount_total?: number
  /**
   * The total of tax
   */
  tax_total?: number
  /**
   * The tax total applied on items
   */
  item_tax_total?: number | null
  /**
   * The total amount refunded if the order is returned.
   */
  refunded_total?: number
  /**
   * The total amount of the order
   */
  total?: number
  /**
   * The subtotal of the order
   */
  subtotal?: number
  /**
   * The total amount paid
   */
  paid_total?: number
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
  /**
   * The details of the line items that are returnable as part of the order, swaps, or claims
   */
  returnable_items?: Array<LineItem>
  /**
   * The date with timezone at which the resource was created.
   */
  created_at: string
  /**
   * The date with timezone at which the resource was updated.
   */
  updated_at: string
  /**
   * An optional key-value map with additional details
   */
  metadata: Record<string, any> | null
}
