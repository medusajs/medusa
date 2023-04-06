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

enum OrderStatus {
  pending = "pending",
  completed = "completed",
  archived = "archived",
  canceled = "canceled",
  requires_action = "requires_action",
}

enum FulfillmentStatus {
  not_fulfilled = "not_fulfilled",
  fulfilled = "fulfilled",
  partially_fulfilled = "partially_fulfilled",
  shipped = "shipped",
  partially_shipped = "partially_shipped",
  canceled = "canceled",
  returned = "returned",
  partially_returned = "partially_returned",
  requires_action = "requires_action",
}

enum PaymentStatus {
  captured = "captured",
  awaiting = "awaiting",
  not_paid = "not_paid",
  refunded = "refunded",
  partially_refunded = "partially_refunded",
  canceled = "canceled",
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
  "returns.shipping_method.tax_lines",
  "shipping_address",
  "shipping_methods",
  "swaps",
  "swaps.additional_items",
  "swaps.additional_items.variant",
  "swaps.fulfillments",
  "swaps.fulfillments.tracking_links",
  "swaps.payment",
  "swaps.return_order",
  "swaps.return_order.shipping_method",
  "swaps.return_order.shipping_method.tax_lines",
  "swaps.shipping_address",
  "swaps.shipping_methods",
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

export class AdminListOrdersSelector {
  @IsString()
  @IsOptional()
  q?: string

  @IsString()
  @IsOptional()
  id?: string

  @IsArray()
  @IsEnum(OrderStatus, { each: true })
  @IsOptional()
  status?: string[]

  @IsArray()
  @IsEnum(FulfillmentStatus, { each: true })
  @IsOptional()
  fulfillment_status?: string[]

  @IsArray()
  @IsEnum(PaymentStatus, { each: true })
  @IsOptional()
  payment_status?: string[]

  @IsString()
  @IsOptional()
  display_id?: string

  @IsString()
  @IsOptional()
  cart_id?: string

  @IsString()
  @IsOptional()
  customer_id?: string

  @IsString()
  @IsOptional()
  email?: string

  @IsOptional()
  @IsType([String, [String]])
  region_id?: string | string[]

  @IsString()
  @IsOptional()
  currency_code?: string

  @IsString()
  @IsOptional()
  tax_rate?: string

  @IsArray()
  @IsOptional()
  sales_channel_id?: string[]

  @IsOptional()
  @ValidateNested()
  @Type(() => DateComparisonOperator)
  canceled_at?: DateComparisonOperator

  @IsOptional()
  @ValidateNested()
  @Type(() => DateComparisonOperator)
  created_at?: DateComparisonOperator

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
