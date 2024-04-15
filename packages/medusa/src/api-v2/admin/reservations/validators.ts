import { FindParams, extendedFindParamsMixin } from "../../../types/common"
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator"

import { IsType } from "../../../utils"
import { OperatorMap } from "@medusajs/types"
import { OperatorMapValidator } from "../../../types/validators/operator-map"
import { Type } from "class-transformer"

// TODO: naming
export class AdminGetReservationsReservationParams extends FindParams {}

/**
 * Parameters used to filter and configure the pagination of the retrieved reservations.
 */
export class AdminGetReservationsParams extends extendedFindParamsMixin({
  limit: 20,
  offset: 0,
}) {
  /**
   * Location IDs to filter reservations by.
   */
  @IsOptional()
  @IsType([String, [String]])
  location_id?: string | string[]

  /**
   * Inventory item IDs to filter reservations by.
   */
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  inventory_item_id?: string[]

  /**
   * Line item IDs to filter reservations by.
   */
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  line_item_id?: string[]

  /**
   * "Create by" user IDs to filter reservations by.
   */
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  created_by?: string[]

  /**
   * Numerical filters to apply on the reservations' `quantity` field.
   */
  @IsOptional()
  @ValidateNested()
  @Type(() => OperatorMapValidator)
  quantity?: OperatorMap<number>

  /**
   * Date filters to apply on the reservations' `created_at` field.
   */
  @IsOptional()
  @ValidateNested()
  @Type(() => OperatorMapValidator)
  created_at?: OperatorMap<Date>

  /**
   * Date filters to apply on the reservations' `updated_at` field.
   */
  @IsOptional()
  @ValidateNested()
  @Type(() => OperatorMapValidator)
  updated_at?: OperatorMap<Date>

  /**
   * String filters to apply on the reservations' `description` field.
   */
  @IsOptional()
  @IsType([OperatorMapValidator, String])
  description?: string | OperatorMap<string>
}

export class AdminPostReservationsReq {
  @IsString()
  @IsOptional()
  line_item_id?: string

  @IsString()
  location_id: string

  @IsString()
  inventory_item_id: string

  @IsNumber()
  quantity: number

  @IsString()
  @IsOptional()
  description?: string

  @IsObject()
  @IsOptional()
  metadata?: Record<string, unknown>
}

export class AdminPostReservationsReservationReq {
  @IsNumber()
  @IsOptional()
  quantity?: number

  @IsString()
  @IsOptional()
  location_id?: string

  @IsString()
  @IsOptional()
  description?: string

  @IsObject()
  @IsOptional()
  metadata?: Record<string, unknown>
}
