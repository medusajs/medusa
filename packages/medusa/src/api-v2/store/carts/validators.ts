import { Type } from "class-transformer"
import {
  IsArray,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator"
import { AddressPayload, FindParams } from "../../../types/common"
import { IsType } from "../../../utils"

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

export class StorePostCartsCartReq {
  @IsOptional()
  @IsString()
  region_id?: string

  @IsEmail()
  @IsOptional()
  email?: string

  @IsOptional()
  @IsType([AddressPayload, String])
  billing_address?: AddressPayload | string

  @IsOptional()
  @IsType([AddressPayload, String])
  shipping_address?: AddressPayload | string

  @IsEmail()
  @IsOptional()
  sales_channel_id?: string

  @IsObject()
  @IsOptional()
  metadata?: Record<string, unknown>

  // @IsOptional()
  // @IsArray()
  // @ValidateNested({ each: true })
  // @Type(() => GiftCard)
  // gift_cards?: GiftCard[]

  // @IsOptional()
  // @IsArray()
  // @ValidateNested({ each: true })
  // @Type(() => Discount)
  // discounts?: Discount[]
}
