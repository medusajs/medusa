import { Type } from "class-transformer"
import { IsArray, IsOptional, IsString, ValidateNested } from "class-validator"
import { IsType } from "../utils/validators/is-type"

import { DateComparisonOperator, StringComparisonOperator } from "./common"

/**
 * Filters to apply on the retrieved customer groups.
 */
export class FilterableCustomerGroupProps {
  /**
   * IDs to filter customer groups by.
   */
  @IsOptional()
  @ValidateNested()
  @IsType([String, [String], StringComparisonOperator])
  id?: string | string[] | StringComparisonOperator

  /**
   * Search term to search customer groups by their name.
   */
  @IsString()
  @IsOptional()
  q?: string

  /**
   * Names to filter customer groups by.
   */
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  name?: string[]

  /**
   * Date filters to apply on the customer groups' `update_at` date.
   */
  @IsOptional()
  @ValidateNested()
  @Type(() => DateComparisonOperator)
  updated_at?: DateComparisonOperator

  /**
   * Date filters to apply on the customer groups' `created_at` date.
   */
  @IsOptional()
  @ValidateNested()
  @Type(() => DateComparisonOperator)
  created_at?: DateComparisonOperator

  /**
   * Filter customer groups by their associated discount condition's ID.
   */
  @IsString()
  @IsOptional()
  discount_condition_id?: string
}

export class CustomerGroupsBatchCustomer {
  @IsString()
  id: string
}

export class CustomerGroupUpdate {
  name?: string
  metadata?: Record<string, unknown>
}
