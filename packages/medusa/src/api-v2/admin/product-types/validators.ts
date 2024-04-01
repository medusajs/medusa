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

export class AdminGetProductTypesProductTypeParams extends FindParams {}

/**
 * Parameters used to filter and configure the pagination of the retrieved product types.
 */
export class AdminGetProductTypesParams extends extendedFindParamsMixin({
  limit: 10,
  offset: 0,
}) {
  /**
   * Term to search product product types by their title and handle.
   */
  @IsString()
  @IsOptional()
  q?: string

  /**
   * Id to filter product product types by.
   */
  @IsOptional()
  @IsString()
  id?: string | string[]

  /**
   * Title to filter product product types by.
   */
  @IsOptional()
  @IsString()
  value?: string | string[] | OperatorMap<string>

  /**
   * Handle to filter product product types by.
   */
  @IsOptional()
  @IsString()
  handle?: string | string[]

  /**
   * Date filters to apply on the product product types' `created_at` date.
   */
  @IsOptional()
  @ValidateNested()
  @Type(() => OperatorMapValidator)
  created_at?: OperatorMap<string>

  /**
   * Date filters to apply on the product product types' `updated_at` date.
   */
  @IsOptional()
  @ValidateNested()
  @Type(() => OperatorMapValidator)
  updated_at?: OperatorMap<string>

  /**
   * Date filters to apply on the product product types' `deleted_at` date.
   */
  @ValidateNested()
  @IsOptional()
  @Type(() => OperatorMapValidator)
  deleted_at?: OperatorMap<string>

  // TODO: To be added in next iteration
  // /**
  //  * Filter product types by their associated discount condition's ID.
  //  */
  // @IsString()
  // @IsOptional()
  // discount_condition_id?: string

  // Note: These are new in v2
  // Additional filters from BaseFilterable
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => AdminGetProductTypesParams)
  $and?: AdminGetProductTypesParams[]

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => AdminGetProductTypesParams)
  $or?: AdminGetProductTypesParams[]
}

export class AdminPostProductTypesReq {
  @IsString()
  @IsNotEmpty()
  value: string

  @IsObject()
  @IsOptional()
  metadata?: Record<string, unknown>
}

export class AdminPostProductTypesProductTypeReq {
  @IsString()
  @IsOptional()
  value?: string

  @IsObject()
  @IsOptional()
  metadata?: Record<string, unknown>
}
