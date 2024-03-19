import { PriceListStatus, PriceListType } from "@medusajs/types"
import { Transform, Type } from "class-transformer"
import {
  IsArray,
  IsEnum,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  ValidateIf,
  ValidateNested,
} from "class-validator"
import { FindParams } from "../../../types/common"
import { transformOptionalDate } from "../../../utils/validators/date-transform"

export class AdminGetPriceListsParams extends FindParams {}
export class AdminGetPriceListsPriceListParams extends FindParams {}

export class AdminPostPriceListsReq {
  @IsString()
  title: string

  @IsString()
  description: string

  @IsOptional()
  @Transform(transformOptionalDate)
  starts_at?: string

  @IsOptional()
  @Transform(transformOptionalDate)
  ends_at?: string

  @IsOptional()
  @IsEnum(PriceListStatus)
  status?: PriceListStatus

  @IsEnum(PriceListType)
  type: PriceListType

  @IsArray()
  @Type(() => AdminPriceListPricesCreateReq)
  @ValidateNested({ each: true })
  prices: AdminPriceListPricesCreateReq[]

  @IsOptional()
  @IsObject()
  rules?: Record<string, string[]>
}

export class AdminPriceListPricesCreateReq {
  @IsString()
  currency_code: string

  @IsInt()
  amount: number

  @IsString()
  variant_id: string

  @IsOptional()
  @IsInt()
  min_quantity?: number

  @IsOptional()
  @IsInt()
  max_quantity?: number

  @IsOptional()
  @IsObject()
  rules?: Record<string, string>
}

export class AdminPostPriceListsPriceListReq {
  @IsString()
  @IsOptional()
  title?: string

  @IsString()
  @IsOptional()
  description?: string

  @IsOptional()
  @Transform(transformOptionalDate)
  starts_at?: string

  @IsOptional()
  @Transform(transformOptionalDate)
  ends_at?: string

  @IsOptional()
  @IsEnum(PriceListStatus)
  status?: PriceListStatus

  @IsOptional()
  @IsEnum(PriceListType)
  type?: PriceListType

  @IsOptional()
  @IsArray()
  prices: AdminPriceListPricesCreateReq[]

  @IsOptional()
  @IsObject()
  rules?: Record<string, string[]>
}

export class AdminPostPriceListsPriceListPricesBatchAddReq {
  @IsOptional()
  @IsArray()
  prices: AdminPriceListPricesCreateReq[]
}

export class AdminPostPriceListsPriceListPricesBatchRemoveReq {
  @IsArray()
  @IsString({ each: true })
  ids: string[]
}

export class AdminPriceListPricesUpdateReq {
  @IsOptional()
  @IsString()
  id: string

  @IsOptional()
  @ValidateIf((object) => !object.id)
  @IsString()
  currency_code?: string

  @IsOptional()
  @ValidateIf((object) => !object.id)
  @IsInt()
  amount?: number

  @IsOptional()
  @ValidateIf((object) => !object.id)
  @IsString()
  variant_id: string

  @IsOptional()
  @IsInt()
  min_quantity?: number

  @IsOptional()
  @IsInt()
  max_quantity?: number

  @IsOptional()
  @IsObject()
  rules?: Record<string, string>
}
