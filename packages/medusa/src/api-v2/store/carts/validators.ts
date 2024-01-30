import { CreateLineItemDTO } from "@medusajs/types"
import {
  IsArray,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator"
import { z } from "zod"
import { FindParams } from "../../../types/common"

export class StoreGetCartsCartParams extends FindParams {}

const Address = z
  .object({
    first_name: z.string().optional(),
    last_name: z.string().optional(),
    company: z.string().optional(),
    address_1: z.string().optional(),
    address_2: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    postal_code: z.string().optional(),
    country_code: z.string().optional(),
    phone: z.string().optional(),
  })
  .strict()

export const StorePostCartReqZod = z
  .object({
    region_id: z.string().optional(),
    customer_id: z.string().optional(),
    email: z.string().optional(),
    currency_code: z.string().optional(),
    shipping_address: Address.optional(),
    billing_address: Address.optional(),
    items: z.array(z.unknown()).optional(),
    sales_channel_id: z.string().optional(),
    metadata: z.record(z.unknown()).optional(),
  })
  .strict()

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
  @IsObject()
  shipping_address?: Record<string, unknown>

  @IsOptional()
  @IsObject()
  billing_address?: Record<string, unknown>

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  items?: CreateLineItemDTO[]

  @IsString()
  @IsOptional()
  sales_channel_id?: string

  @IsObject()
  @IsOptional()
  metadata?: Record<string, unknown>
}
