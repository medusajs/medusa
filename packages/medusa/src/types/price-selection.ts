import { IsOptional, IsString } from "class-validator"

export class PriceSelectionParams {
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
