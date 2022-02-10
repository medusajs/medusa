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
import { Order } from "../models/order"
import { DateComparisonOperator } from "./common"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isOrder(object: any): object is Order {
  return object.object === "order"
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

  @IsString()
  @IsOptional()
  region_id?: string

  @IsString()
  @IsOptional()
  currency_code?: string

  @IsString()
  @IsOptional()
  tax_rate?: string

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
