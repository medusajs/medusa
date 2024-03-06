import { Type } from "class-transformer"
import {
  IsArray,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator"
import { FindParams, extendedFindParamsMixin } from "../../../types/common"

export class AdminGetStoresStoreParams extends FindParams {}
/**
 * Parameters used to filter and configure the pagination of the retrieved api keys.
 */
export class AdminGetStoresParams extends extendedFindParamsMixin({
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
  @Type(() => AdminGetStoresParams)
  $and?: AdminGetStoresParams[]

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => AdminGetStoresParams)
  $or?: AdminGetStoresParams[]
}

export class AdminPostStoresStoreReq {
  @IsOptional()
  @IsString()
  name?: string

  @IsOptional()
  @IsArray()
  supported_currency_codes?: string[]

  @IsOptional()
  @IsString()
  default_sales_channel_id?: string

  @IsOptional()
  @IsString()
  default_region_id?: string

  @IsOptional()
  @IsString()
  default_location_id?: string

  @IsObject()
  @IsOptional()
  metadata?: Record<string, unknown>
}

export class AdminDeleteStoresStoreReq {}
