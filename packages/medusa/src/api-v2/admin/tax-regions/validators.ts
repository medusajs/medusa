import { OperatorMap } from "@medusajs/types"
import { Type } from "class-transformer"
import {
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator"
import { extendedFindParamsMixin, FindParams } from "../../../types/common"
import { OperatorMapValidator } from "../../../types/validators/operator-map"

export class AdminGetTaxRegionsTaxRegionParams extends FindParams {}

export class AdminGetTaxRegionsParams extends extendedFindParamsMixin({
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
   * Filter by country code.
   */
  @IsString({ each: true })
  @IsOptional()
  country_code?: string | string[]

  /**
   * Filter by province code
   */
  @IsString({ each: true })
  @IsOptional()
  province_code?: string | string[]

  /**
   * Filter by id of parent Tax Region.
   */
  @IsString({ each: true })
  @IsOptional()
  parent_id?: string | string[]

  /**
   * Filter by who created the Tax Region.
   */
  @IsString({ each: true })
  @IsOptional()
  created_by?: string | string[]

  /**
   * Date filters to apply on the Tax Regions' `created_at` date.
   */
  @IsOptional()
  @ValidateNested()
  @Type(() => OperatorMapValidator)
  created_at?: OperatorMap<string>

  /**
   * Date filters to apply on the Tax Regions' `updated_at` date.
   */
  @IsOptional()
  @ValidateNested()
  @Type(() => OperatorMapValidator)
  updated_at?: OperatorMap<string>

  /**
   * Date filters to apply on the Tax Regions' `deleted_at` date.
   */
  @ValidateNested()
  @IsOptional()
  @Type(() => OperatorMapValidator)
  deleted_at?: OperatorMap<string>

  // Additional filters from BaseFilterable
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => AdminGetTaxRegionsParams)
  $and?: AdminGetTaxRegionsParams[]

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => AdminGetTaxRegionsParams)
  $or?: AdminGetTaxRegionsParams[]
}

class CreateDefaultTaxRate {
  @IsOptional()
  @IsNumber()
  rate?: number | null

  @IsOptional()
  @IsString()
  code?: string | null

  @IsString()
  name: string

  @IsObject()
  @IsOptional()
  metadata?: Record<string, unknown>
}

export class AdminPostTaxRegionsReq {
  @IsString()
  country_code: string

  @IsString()
  @IsOptional()
  province_code?: string

  @IsString()
  @IsOptional()
  parent_id?: string

  @ValidateNested()
  @IsOptional()
  @Type(() => CreateDefaultTaxRate)
  default_tax_rate?: CreateDefaultTaxRate

  @IsObject()
  @IsOptional()
  metadata?: Record<string, unknown>
}
