import { OperatorMap } from "@medusajs/types"
import { Type } from "class-transformer"
import {
  IsArray,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator"
import { FindParams, extendedFindParamsMixin } from "../../../types/common"
import { OperatorMapValidator } from "../../../types/validators/operator-map"

export class AdminGetRegionsRegionParams extends FindParams {}

/**
 * Parameters used to filter and configure the pagination of the retrieved regions.
 */
export class AdminGetRegionsParams extends extendedFindParamsMixin({
  limit: 50,
  offset: 0,
}) {
  /**
   * Search parameter for regions.
   */
  @IsString({ each: true })
  @IsOptional()
  id?: string | string[]

  /**
   * Filter by currency code
   */
  @IsString({ each: true })
  @IsOptional()
  code?: string | string[]

  /**
   * Filter by region name
   */
  @IsString({ each: true })
  @IsOptional()
  name?: string | string[]

  /**
   * Date filters to apply on the regions' `created_at` date.
   */
  @IsOptional()
  @ValidateNested()
  @Type(() => OperatorMapValidator)
  created_at?: OperatorMap<string>

  /**
   * Date filters to apply on the regions' `updated_at` date.
   */
  @IsOptional()
  @ValidateNested()
  @Type(() => OperatorMapValidator)
  updated_at?: OperatorMap<string>

  /**
   * Date filters to apply on the regions' `deleted_at` date.
   */
  @ValidateNested()
  @IsOptional()
  @Type(() => OperatorMapValidator)
  deleted_at?: OperatorMap<string>

  // Additional filters from BaseFilterable
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => AdminGetRegionsParams)
  $and?: AdminGetRegionsParams[]

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => AdminGetRegionsParams)
  $or?: AdminGetRegionsParams[]
}

export class AdminPostRegionsReq {
  @IsString()
  name: string

  @IsString()
  currency_code: string

  @IsArray()
  @IsOptional()
  countries?: string[]

  @IsObject()
  @IsOptional()
  metadata?: Record<string, unknown>
}

export class AdminPostRegionsRegionReq {
  @IsString()
  @IsOptional()
  name?: string

  @IsString()
  @IsOptional()
  currency_code?: string

  @IsArray()
  @IsOptional()
  countries?: string[]

  @IsObject()
  @IsOptional()
  metadata?: Record<string, unknown>
}
