import { Type } from "class-transformer"
import {
  IsBoolean,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator"
import { FindParams } from "../../../types/common"

export class AdminGetTaxRatesTaxRateParams extends FindParams {}

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

export class AdminPostTaxRatesTaxRateRulesBatchSetReq {
  @ValidateNested({ each: true })
  @Type(() => CreateTaxRateRule)
  rules: CreateTaxRateRule[]
}
