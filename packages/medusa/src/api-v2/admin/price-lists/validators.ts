import { PriceListStatus, PriceListType } from "@medusajs/types"
import { Transform, Type } from "class-transformer"
import {
  IsArray,
  IsEnum,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator"
import { z } from "zod"
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

export type AdminCreatePriceListPriceType = z.infer<
  typeof AdminCreatePriceListPrice
>
export const AdminCreatePriceListPrice = z.object({
  currency_code: z.string(),
  amount: z.number(),
  variant_id: z.string(),
  min_quantity: z.number().optional(),
  max_quantity: z.number().optional(),
  rules: z.object({}).optional(),
})

export const AdminUpdatePriceListPrice = z.object({
  id: z.string(),
  currency_code: z.string().optional(),
  amount: z.number().optional(),
  variant_id: z.string(),
  min_quantity: z.number().optional(),
  max_quantity: z.number().optional(),
  rules: z.object({}).optional(),
})

export const AdminBatchPriceListPrices = z.object({
  create: z.array(AdminCreatePriceListPrice).optional(),
  update: z.array(AdminUpdatePriceListPrice).optional(),
  delete: z.array(z.string()).optional(),
})
