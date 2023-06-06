import { IsOptional, IsString } from "class-validator"

import { FindParams } from "./common"

export class PriceSelectionParams extends FindParams {
  @IsOptional()
  @IsString()
  cart_id?: string

  @IsOptional()
  @IsString()
  region_id?: string

  @IsOptional()
  @IsString()
  currency_code?: string
}

export class AdminPriceSelectionParams extends PriceSelectionParams {
  @IsOptional()
  @IsString()
  customer_id?: string
}
