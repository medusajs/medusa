import { IsOptional, IsString } from "class-validator"

import { FindParams } from "./common"

/**
 * The context to apply on retrieved prices.
 */
export class PriceSelectionParams extends FindParams {
  /**
   * Retrieve prices for a cart ID.
   */
  @IsOptional()
  @IsString()
  cart_id?: string

  /**
   * Retrieve prices for a region ID.
   */
  @IsOptional()
  @IsString()
  region_id?: string

  /**
   * Retrieve prices for a currency code.
   */
  @IsOptional()
  @IsString()
  currency_code?: string
}

/**
 * The context to apply on retrieved prices by a user admin.
 */
export class AdminPriceSelectionParams extends PriceSelectionParams {
  /**
   * Retrieve prices for a customer ID.
   */
  @IsOptional()
  @IsString()
  customer_id?: string
}
