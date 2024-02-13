import { OperatorMap } from "@medusajs/types"
import { Type } from "class-transformer"
import { IsOptional, IsString, ValidateNested } from "class-validator"
import { FindParams, extendedFindParamsMixin } from "../../../types/common"
import { OperatorMapValidator } from "../../../types/validators/operator-map"

export class StoreRegionsRegionParams extends FindParams {}

/**
 * Parameters used to filter and configure the pagination of the retrieved regions.
 */
export class StoreGetRegionsParams extends extendedFindParamsMixin({
  limit: 50,
  offset: 0,
}) {
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

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => StoreGetRegionsParams)
  $and?: StoreGetRegionsParams[]

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => StoreGetRegionsParams)
  $or?: StoreGetRegionsParams[]
}
