import { Type } from "class-transformer"
import {
  IsBoolean,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator"
import z from "zod"
import { createFindParams, createOperatorMap } from "../../utils/validators"

export const AdminGetTaxRateParams = createFindParams({
  limit: 20,
  offset: 0,
})

export const AdminGetTaxRatesParams = createFindParams({
  limit: 20,
  offset: 0,
}).merge(
  z.object({
    q: z.string().optional(),
    tax_region_id: z
      .union([z.string(), z.array(z.string()), createOperatorMap()])
      .optional(),
    is_default: z.union([z.literal("true"), z.literal("false")]).optional(),
    created_at: createOperatorMap().optional(),
    updated_at: createOperatorMap().optional(),
    deleted_at: createOperatorMap().optional(),
    $and: z.lazy(() => AdminGetTaxRatesParams.array()).optional(),
    $or: z.lazy(() => AdminGetTaxRatesParams.array()).optional(),
  })
)

class CreateTaxRateRule {
  @IsString()
  reference: string

  @IsString()
  reference_id: string
}

export class AdminPostTaxRatesReq {
  @IsOptional()
  @IsNumber()
  rate?: number | null

  @IsOptional()
  @IsString()
  code?: string | null

  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => CreateTaxRateRule)
  rules?: CreateTaxRateRule[]

  @IsString()
  name: string

  @IsBoolean()
  @IsOptional()
  is_default?: boolean

  @IsBoolean()
  @IsOptional()
  is_combinable?: boolean

  @IsString()
  tax_region_id: string

  @IsObject()
  @IsOptional()
  metadata?: Record<string, unknown>
}

export class AdminPostTaxRatesTaxRateReq {
  @IsOptional()
  @IsNumber()
  rate?: number | null

  @IsOptional()
  @IsString()
  code?: string | null

  @IsString()
  @IsOptional()
  name?: string

  @ValidateNested({ each: true })
  @Type(() => CreateTaxRateRule)
  rules: CreateTaxRateRule[]

  @IsBoolean()
  @IsOptional()
  is_default?: boolean

  @IsBoolean()
  @IsOptional()
  is_combinable?: boolean

  @IsObject()
  @IsOptional()
  metadata?: Record<string, unknown>
}

export class AdminPostTaxRatesTaxRateRulesReq extends CreateTaxRateRule {}
