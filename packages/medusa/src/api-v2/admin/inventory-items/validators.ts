import {
  DateComparisonOperator,
  FindParams,
  NumericalComparisonOperator,
  StringComparisonOperator,
  extendedFindParamsMixin,
} from "../../../types/common"
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator"
import { Transform, Type } from "class-transformer"

import { IsType } from "../../../utils"

export class AdminGetInventoryItemsItemParams extends FindParams {}

/**
 * Parameters used to filter and configure the pagination of the retrieved inventory items.
 */
export class AdminGetInventoryItemsParams extends extendedFindParamsMixin({
  limit: 20,
  offset: 0,
}) {
  /**
   * IDs to filter inventory items by.
   */
  @IsOptional()
  @IsType([String, [String]])
  id?: string | string[]

  /**
   * Search terms to search inventory items' sku, title, and description.
   */
  @IsOptional()
  @IsString()
  q?: string

  /**
   * Location IDs to filter inventory items by.
   */
  @IsOptional()
  @IsType([String, [String]])
  location_id?: string | string[]

  /**
   * SKUs to filter inventory items by.
   */
  @IsOptional()
  @IsType([String, [String]])
  sku?: string | string[]

  /**
   * Origin countries to filter inventory items by.
   */
  @IsOptional()
  @IsType([String, [String]])
  origin_country?: string | string[]

  /**
   * MID codes to filter inventory items by.
   */
  @IsOptional()
  @IsType([String, [String]])
  mid_code?: string | string[]

  /**
   * Materials to filter inventory items by.
   */
  @IsOptional()
  @IsType([String, [String]])
  material?: string | string[]

  /**
   * String filters to apply to inventory items' `hs_code` field.
   */
  @IsOptional()
  @IsType([String, [String], StringComparisonOperator])
  hs_code?: string | string[] | StringComparisonOperator

  /**
   * Number filters to apply to inventory items' `weight` field.
   */
  @IsOptional()
  @IsType([Number, NumericalComparisonOperator])
  weight?: number | NumericalComparisonOperator

  /**
   * Number filters to apply to inventory items' `length` field.
   */
  @IsOptional()
  @IsType([Number, NumericalComparisonOperator])
  length?: number | NumericalComparisonOperator

  /**
   * Number filters to apply to inventory items' `height` field.
   */
  @IsOptional()
  @IsType([Number, NumericalComparisonOperator])
  height?: number | NumericalComparisonOperator

  /**
   * Number filters to apply to inventory items' `width` field.
   */
  @IsOptional()
  @IsType([Number, NumericalComparisonOperator])
  width?: number | NumericalComparisonOperator

  /**
   * Filter inventory items by whether they require shipping.
   */
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === "true")
  requires_shipping?: boolean
}

export class AdminPostInventoryItemsItemLocationLevelsReq {
  @IsString()
  location_id: string

  @IsNumber()
  stocked_quantity: number

  @IsOptional()
  @IsNumber()
  incoming_quantity?: number
}

// eslint-disable-next-line
export class AdminPostInventoryItemsItemLocationLevelsParams extends FindParams {}
