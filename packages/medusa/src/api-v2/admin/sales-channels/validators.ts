import { OperatorMap } from "@medusajs/types"
import { Type } from "class-transformer"
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator"
import { FindParams, extendedFindParamsMixin } from "../../../types/common"
import { OperatorMapValidator } from "../../../types/validators/operator-map"

export class AdminGetSalesChannelsSalesChannelParams extends FindParams {}

export class AdminGetSalesChannelsParams extends extendedFindParamsMixin({
  limit: 20,
  offset: 0,
}) {
  /**
   * ID to filter sales channels by.
   */
  @IsString()
  @IsOptional()
  id?: string

  /**
   * Name to filter sales channels by.
   */
  @IsOptional()
  @IsString()
  name?: string

  /**
   * Description to filter sales channels by.
   */
  @IsOptional()
  @IsString()
  description?: string

  /**
   * Date filters to apply on sales channels' `created_at` field.
   */
  @IsOptional()
  @ValidateNested()
  @Type(() => OperatorMapValidator)
  created_at?: OperatorMap<string>

  /**
   * Filter by location id
   */
  @IsString({ each: true })
  @IsOptional()
  location_id?: string | string[]

  /**
   * Filter by publishable api keys
   */
  @IsString({ each: true })
  @IsOptional()
  publishable_key_id?: string | string[]

  /**
   * Date filters to apply on sales channels' `updated_at` field.
   */
  @IsOptional()
  @ValidateNested()
  @Type(() => OperatorMapValidator)
  updated_at?: OperatorMap<string>

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => AdminGetSalesChannelsParams)
  $and?: AdminGetSalesChannelsParams[]

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => AdminGetSalesChannelsParams)
  $or?: AdminGetSalesChannelsParams[]
}

export class AdminPostSalesChannelsReq {
  @IsString()
  name: string

  @IsString()
  @IsOptional()
  description: string

  @IsBoolean()
  @IsOptional()
  is_disabled?: boolean

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  metadata?: Record<string, unknown>
}

export class AdminPostSalesChannelsSalesChannelReq {
  @IsOptional()
  @IsString()
  name?: string

  @IsOptional()
  @IsString()
  description?: string

  @IsBoolean()
  @IsOptional()
  is_disabled?: boolean

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  metadata?: Record<string, unknown>
}

export class AdminPostSalesChannelsChannelProductsBatchReq {
  @IsArray()
  product_ids: string[]
}
