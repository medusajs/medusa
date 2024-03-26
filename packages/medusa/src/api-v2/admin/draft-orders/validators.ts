import { BigNumberInput } from "@medusajs/types"
import { Type } from "class-transformer"
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateIf,
  ValidateNested,
} from "class-validator"
import {
  AddressPayload,
  FindParams,
  extendedFindParamsMixin,
} from "../../../types/common"
import { IsType } from "../../../utils/validators/is-type"

export class AdminGetOrdersOrderParams extends FindParams {}
/**
 * Parameters used to filter and configure the pagination of the retrieved api keys.
 */
export class AdminGetOrdersParams extends extendedFindParamsMixin({
  limit: 50,
  offset: 0,
}) {
  /**
   * Search parameter for api keys.
   */
  @IsString({ each: true })
  @IsOptional()
  id?: string | string[]

  /**
   * Filter by title
   */
  @IsString({ each: true })
  @IsOptional()
  name?: string | string[]

  // Additional filters from BaseFilterable
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => AdminGetOrdersParams)
  $and?: AdminGetOrdersParams[]

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => AdminGetOrdersParams)
  $or?: AdminGetOrdersParams[]
}

enum Status {
  completed = "completed",
}

export class AdminPostDraftOrdersReq {
  @IsEnum(Status)
  @IsOptional()
  status?: string

  @IsEmail()
  @ValidateIf((o) => !o.customer_id)
  email: string

  @IsString()
  @IsOptional()
  sales_channel_id?: string

  @IsOptional()
  @IsType([AddressPayload, String])
  billing_address?: AddressPayload

  @IsOptional()
  @IsType([AddressPayload, String])
  shipping_address?: AddressPayload

  @IsArray()
  @Type(() => Item)
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @IsOptional()
  items?: Item[]

  @IsString()
  region_id: string

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  promo_codes?: string[]

  @IsString()
  @IsOptional()
  currency_code?: string

  @IsString()
  @IsOptional()
  @ValidateIf((o) => !o.email)
  customer_id?: string

  @IsBoolean()
  @IsOptional()
  no_notification_order?: boolean

  @IsArray()
  @Type(() => ShippingMethod)
  @IsNotEmpty()
  @ValidateNested({ each: true })
  shipping_methods: ShippingMethod[]

  @IsObject()
  @IsOptional()
  metadata?: Record<string, unknown> = {}
}

class ShippingMethod {
  @IsString()
  @IsOptional()
  shipping_method_id: string

  @IsString()
  @IsOptional()
  order_id: string

  @IsString()
  name: string

  @IsString()
  option_id: string

  @IsObject()
  @IsOptional()
  data?: Record<string, unknown> = {}

  @IsNumber()
  amount: BigNumberInput
}

class Item {
  @IsString()
  @ValidateIf((o) => !o.variant_id)
  title: string

  @IsString()
  @IsOptional()
  @ValidateIf((o) => !o.variant_id)
  sku: string

  @IsString()
  @IsOptional()
  @ValidateIf((o) => !o.variant_id)
  barcode: string

  @IsNumber()
  @IsOptional()
  unit_price: BigNumberInput

  @IsString()
  @IsOptional()
  variant_id?: string

  @IsNumber()
  quantity: number

  @IsObject()
  @IsOptional()
  metadata?: Record<string, unknown> = {}
}

export class AdminDeleteOrdersOrderReq {}
