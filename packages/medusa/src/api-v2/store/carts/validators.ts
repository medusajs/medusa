import { Type } from "class-transformer"
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator"
import { FindParams } from "../../../types/common"

export class StoreGetCartsCartParams extends FindParams {}

export class Item {
  @IsNotEmpty()
  @IsString()
  variant_id: string

  @IsNotEmpty()
  @IsInt()
  quantity: number
}

export class StorePostCartReq {
  @IsOptional()
  @IsString()
  region_id?: string

  @IsOptional()
  @IsString()
  customer_id?: string

  @IsOptional()
  @IsString()
  email?: string

  @IsOptional()
  @IsString()
  currency_code?: string

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Item)
  items?: Item[]

  @IsString()
  @IsOptional()
  sales_channel_id?: string

  @IsObject()
  @IsOptional()
  metadata?: Record<string, unknown>
}
