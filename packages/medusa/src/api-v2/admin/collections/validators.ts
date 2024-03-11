import { OperatorMap } from "@medusajs/types"
import { Type } from "class-transformer"
import {
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator"
import { FindParams, extendedFindParamsMixin } from "../../../types/common"
import { OperatorMapValidator } from "../../../types/validators/operator-map"

// TODO: Ensure these match the DTOs in the types
export class AdminGetCollectionsCollectionParams extends FindParams {}

/**
 * Parameters used to filter and configure the pagination of the retrieved regions.
 */
export class AdminGetCollectionsParams extends extendedFindParamsMixin({
  limit: 10,
  offset: 0,
}) {
  /**
   * Term to search product collections by their title and handle.
   */
  @IsString()
  @IsOptional()
  q?: string

  /**
   * Title to filter product collections by.
   */
  @IsOptional()
  @IsString()
  title?: string | string[]

  /**
   * Handle to filter product collections by.
   */
  @IsOptional()
  @IsString()
  handle?: string | string[]

  /**
   * Date filters to apply on the product collections' `created_at` date.
   */
  @IsOptional()
  @ValidateNested()
  @Type(() => OperatorMapValidator)
  created_at?: OperatorMap<string>

  /**
   * Date filters to apply on the product collections' `updated_at` date.
   */
  @IsOptional()
  @ValidateNested()
  @Type(() => OperatorMapValidator)
  updated_at?: OperatorMap<string>

  /**
   * Date filters to apply on the product collections' `deleted_at` date.
   */
  @ValidateNested()
  @IsOptional()
  @Type(() => OperatorMapValidator)
  deleted_at?: OperatorMap<string>

  // TODO: To be added in next iteration
  // /**
  //  * Filter product collections by their associated discount condition's ID.
  //  */
  // @IsString()
  // @IsOptional()
  // discount_condition_id?: string

  // Note: These are new in v2
  // Additional filters from BaseFilterable
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => AdminGetCollectionsParams)
  $and?: AdminGetCollectionsParams[]

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => AdminGetCollectionsParams)
  $or?: AdminGetCollectionsParams[]
}

export class AdminPostCollectionsReq {
  @IsString()
  @IsNotEmpty()
  title: string

  @IsString()
  @IsOptional()
  handle?: string

  @IsObject()
  @IsOptional()
  metadata?: Record<string, unknown>
}

export class AdminPostCollectionsCollectionReq {
  @IsString()
  @IsOptional()
  title?: string

  @IsString()
  @IsOptional()
  handle?: string

  @IsObject()
  @IsOptional()
  metadata?: Record<string, unknown>
}
