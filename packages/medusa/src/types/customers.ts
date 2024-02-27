import { Transform, Type } from "class-transformer"
import {
  IsBoolean,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator"
import { optionalBooleanMapper } from "../utils/validators/is-boolean"
import { AddressPayload, DateComparisonOperator } from "./common"

/**
 * Filters used to filter retrieved customers.
 */
export class AdminListCustomerSelector {
  /**
   * Search term used to search customers' email, first name, last name.
   */
  @IsString()
  @IsOptional()
  q?: string

  /**
   * Filter customers by whether they have an account.
   */
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => optionalBooleanMapper.get(value))
  has_account?: boolean

  /**
   * Filter customers by the customer's customer groups.
   */
  @IsOptional()
  @IsString({ each: true })
  groups?: string[]

  /**
   * The field to sort the data by. By default, the sort order is ascending. To change the order to descending, prefix the field name with `-`.
   */
  @IsOptional()
  @IsString()
  order?: string

  /**
   * Date filters to apply on the customers' `created_at` date.
   */
  @IsOptional()
  @ValidateNested()
  @Type(() => DateComparisonOperator)
  created_at?: DateComparisonOperator

  /**
   * Date filters to apply on the customers' `updated_at` date.
   */
  @IsOptional()
  @ValidateNested()
  @Type(() => DateComparisonOperator)
  updated_at?: DateComparisonOperator
}

export type CreateCustomerInput = {
  email: string
  password?: string
  password_hash?: string
  has_account?: boolean

  first_name?: string
  last_name?: string
  phone?: string
  metadata?: Record<string, unknown>
}

export type UpdateCustomerInput = {
  password?: string
  metadata?: Record<string, unknown>
  billing_address?: AddressPayload | string
  billing_address_id?: string
  groups?: { id: string }[]

  email?: string
  first_name?: string
  last_name?: string
  phone?: string
}
