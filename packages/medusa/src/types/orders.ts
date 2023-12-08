import { Type } from "class-transformer"
import {
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator"
import { IsType } from "../utils/validators/is-type"
import { Order, Payment } from "../models"
import { AddressPayload, DateComparisonOperator } from "./common"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isOrder(object: any): object is Order {
  return object.object === "order"
}

export type TotalsContext = {
  force_taxes?: boolean
  includes?: { returnable_items?: boolean }
}

/**
 * @enum
 *
 * The status of an order.
 */
enum OrderStatus {
  /**
   * Order is pending.
   */
  pending = "pending",
  /**
   * Order is completed. An order is completed when it's paid and fulfilled.
   */
  completed = "completed",
  /**
   * Order is archived.
   */
  archived = "archived",
  /**
   * Order is canceled.
   */
  canceled = "canceled",
  /**
   * Order requires an action. This status is applied when the order's payment or fulfillment requires an additional action.
   */
  requires_action = "requires_action",
}

/**
 * @enum
 *
 * The fulfillment status of an order.
 */
enum FulfillmentStatus {
  /**
   * The order isn't fulfilled.
   */
  not_fulfilled = "not_fulfilled",
  /**
   * All of the order's items are fulfilled.
   */
  fulfilled = "fulfilled",
  /**
   * Some, but not all, of the order's items are fulfilled.
   */
  partially_fulfilled = "partially_fulfilled",
  /**
   * All of the order's items are shipped.
   */
  shipped = "shipped",
  /**
   * Some, but not all, of the order's items are shipped.
   */
  partially_shipped = "partially_shipped",
  /**
   * The order's fulfillments are canceled.
   */
  canceled = "canceled",
  /**
   * All of the order's items are returned.
   */
  returned = "returned",
  /**
   * Some, but not all, of the order's items are returned.
   */
  partially_returned = "partially_returned",
  /**
   * The order's fulfillment requires an action.
   */
  requires_action = "requires_action",
}

/**
 * @enum
 *
 * The payment status of the order.
 */
enum PaymentStatus {
  /**
   * The order's payment is captured.
   */
  captured = "captured",
  /**
   * The order's payment is awaiting.
   */
  awaiting = "awaiting",
  /**
   * The order's payment isn't paid.
   */
  not_paid = "not_paid",
  /**
   * The order's payment is fully refunded.
   */
  refunded = "refunded",
  /**
   * The order's payment is partially refunded.
   */
  partially_refunded = "partially_refunded",
  /**
   * The order's payment is canceled.
   */
  canceled = "canceled",
  /**
   * The order's payment requires an action.
   */
  requires_action = "requires_action",
}

export type CreateOrderInput = {
  status?: OrderStatus
  email: string
  billing_address: AddressPayload
  shipping_address: AddressPayload
  items: Record<string, unknown>[]
  region: string
  discounts?: Record<string, unknown>[]
  customer_id: string
  payment_method: {
    provider_id: string
    ata?: Record<string, unknown>
  }
  shipping_method?: {
    provider_id: string
    profile_id: string
    price: number
    data?: Record<string, unknown>
    items?: Record<string, unknown>[]
  }[]
  no_notification?: boolean
}

export type UpdateOrderInput = {
  email?: string
  billing_address?: AddressPayload
  shipping_address?: AddressPayload
  items?: object[]
  region?: string
  discounts?: object[]
  customer_id?: string
  payment_method?: {
    provider_id?: string
    data?: Record<string, unknown>
  }
  shipping_method?: {
    provider_id?: string
    profile_id?: string
    price?: number
    data?: Record<string, unknown>
    items?: Record<string, unknown>[]
  }[]
  no_notification?: boolean
  payment?: Payment
  status?: OrderStatus
  fulfillment_status?: FulfillmentStatus
  payment_status?: PaymentStatus
  metadata?: Record<string, unknown>
}

export const defaultAdminOrdersRelations = [
  "billing_address",
  "claims",
  "claims.additional_items",
  "claims.additional_items.variant",
  "claims.claim_items",
  "claims.claim_items.images",
  "claims.claim_items.item",
  "claims.fulfillments",
  "claims.fulfillments.tracking_links",
  "claims.return_order",
  "claims.return_order.shipping_method",
  "claims.return_order.shipping_method.tax_lines",
  "claims.shipping_address",
  "claims.shipping_methods",
  "customer",
  "discounts",
  "discounts.rule",
  "fulfillments",
  "fulfillments.items",
  "fulfillments.tracking_links",
  "gift_card_transactions",
  "gift_cards",
  "items",
  "payments",
  "refunds",
  "region",
  "returns",
  "returns.items",
  "returns.items.reason",
  "returns.shipping_method",
  "returns.shipping_method.shipping_option",
  "returns.shipping_method.tax_lines",
  "shipping_address",
  "shipping_methods",
  "shipping_methods.shipping_option",
  "shipping_methods.tax_lines",
  "swaps",
  "swaps.additional_items",
  "swaps.additional_items.variant",
  "swaps.fulfillments",
  "swaps.fulfillments.tracking_links",
  "swaps.payment",
  "swaps.return_order",
  "swaps.return_order.shipping_method",
  "swaps.return_order.shipping_method.shipping_option",
  "swaps.return_order.shipping_method.tax_lines",
  "swaps.shipping_address",
  "swaps.shipping_methods",
  "swaps.shipping_methods.shipping_option",
  "swaps.shipping_methods.tax_lines",
  // "claims.claim_items.tags",
]

export const defaultAdminOrdersFields = [
  "id",
  "status",
  "fulfillment_status",
  "payment_status",
  "display_id",
  "cart_id",
  "draft_order_id",
  "customer_id",
  "email",
  "region_id",
  "currency_code",
  "tax_rate",
  "canceled_at",
  "created_at",
  "updated_at",
  "metadata",
  "items.refundable",
  "swaps.additional_items.refundable",
  "claims.additional_items.refundable",
  "no_notification",
] as (keyof Order)[]

/**
 * Filters to apply on the retrieved orders.
 */
export class AdminListOrdersSelector {
  /**
   * Search term to search orders' shipping address, first name, email, and display ID.
   */
  @IsString()
  @IsOptional()
  q?: string

  /**
   * ID to filter orders by.
   */
  @IsString()
  @IsOptional()
  id?: string

  /**
   * Statuses to filter orders by.
   */
  @IsArray()
  @IsEnum(OrderStatus, { each: true })
  @IsOptional()
  status?: string[]

  /**
   * Fulfillment statuses to filter orders by.
   */
  @IsArray()
  @IsEnum(FulfillmentStatus, { each: true })
  @IsOptional()
  fulfillment_status?: string[]

  /**
   * Payment statuses to filter orders by.
   */
  @IsArray()
  @IsEnum(PaymentStatus, { each: true })
  @IsOptional()
  payment_status?: string[]

  /**
   * Display ID to filter orders by.
   */
  @IsString()
  @IsOptional()
  display_id?: string

  /**
   * Cart ID to filter orders by.
   */
  @IsString()
  @IsOptional()
  cart_id?: string

  /**
   * Customer ID to filter orders by.
   */
  @IsString()
  @IsOptional()
  customer_id?: string

  /**
   * Email to filter orders by.
   */
  @IsString()
  @IsOptional()
  email?: string

  /**
   * Regions to filter orders by.
   */
  @IsOptional()
  @IsType([String, [String]])
  region_id?: string | string[]

  /**
   * Currency code to filter orders by.
   */
  @IsString()
  @IsOptional()
  currency_code?: string

  /**
   * Tax rate to filter orders by.
   */
  @IsString()
  @IsOptional()
  tax_rate?: string

  /**
   * Sales channel IDs to filter orders by.
   */
  @IsArray()
  @IsOptional()
  sales_channel_id?: string[]

  /**
   * Date filters to apply on the orders' `canceled_at` date.
   */
  @IsOptional()
  @ValidateNested()
  @Type(() => DateComparisonOperator)
  canceled_at?: DateComparisonOperator

  /**
   * Date filters to apply on the orders' `created_at` date.
   */
  @IsOptional()
  @ValidateNested()
  @Type(() => DateComparisonOperator)
  created_at?: DateComparisonOperator

  /**
   * Date filters to apply on the orders' `updated_at` date.
   */
  @IsOptional()
  @ValidateNested()
  @Type(() => DateComparisonOperator)
  updated_at?: DateComparisonOperator
}

export class OrdersReturnItem {
  @IsString()
  @IsNotEmpty()
  item_id: string

  @IsInt()
  @IsNotEmpty()
  @Type(() => Number)
  quantity: number

  @IsString()
  @IsOptional()
  reason_id?: string

  @IsString()
  @IsOptional()
  note?: string
}
