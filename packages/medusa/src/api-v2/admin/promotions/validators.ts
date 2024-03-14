import { PromotionTypeValues } from "@medusajs/types"
import {
  ApplicationMethodAllocation,
  ApplicationMethodTargetType,
  ApplicationMethodType,
  PromotionRuleOperator,
  PromotionType,
} from "@medusajs/utils"
import { Type } from "class-transformer"
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Validate,
  ValidateIf,
  ValidateNested,
} from "class-validator"
import { FindParams, extendedFindParamsMixin } from "../../../types/common"
import { XorConstraint } from "../../../types/validators/xor"
import { AdminPostCampaignsReq } from "../campaigns/validators"

export class AdminGetPromotionsPromotionParams extends FindParams {}

export class AdminGetPromotionsParams extends extendedFindParamsMixin({
  limit: 100,
  offset: 0,
}) {
  @IsString()
  @IsOptional()
  code?: string
}

export class AdminPostPromotionsReq {
  @IsNotEmpty()
  @IsString()
  code: string

  @IsBoolean()
  @IsOptional()
  is_automatic?: boolean

  @IsOptional()
  @IsEnum(PromotionType)
  type?: PromotionTypeValues

  @IsOptional()
  @IsString()
  campaign_id?: string

  @IsOptional()
  @ValidateNested()
  @Type(() => AdminPostCampaignsReq)
  campaign?: AdminPostCampaignsReq

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ApplicationMethodsPostReq)
  application_method: ApplicationMethodsPostReq

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PromotionRule)
  rules?: PromotionRule[]
}

export class PromotionRule {
  @IsEnum(PromotionRuleOperator)
  operator: PromotionRuleOperator

  @IsOptional()
  @IsString()
  description?: string | null

  @IsNotEmpty()
  @IsString()
  attribute: string

  @IsArray()
  @Type(() => String)
  values: string[]
}

export class ApplicationMethodsPostReq {
  @IsOptional()
  @IsString()
  description?: string

  @IsOptional()
  @IsString()
  value?: string

  @IsOptional()
  @IsNumber()
  max_quantity?: number

  @IsOptional()
  @IsEnum(ApplicationMethodType)
  type?: ApplicationMethodType

  @IsOptional()
  @IsEnum(ApplicationMethodTargetType)
  target_type?: ApplicationMethodTargetType

  @IsOptional()
  @IsEnum(ApplicationMethodAllocation)
  allocation?: ApplicationMethodAllocation

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PromotionRule)
  target_rules?: PromotionRule[]

  @ValidateIf((data) => data.type === PromotionType.BUYGET)
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PromotionRule)
  buy_rules?: PromotionRule[]

  @ValidateIf((data) => data.type === PromotionType.BUYGET)
  @IsNotEmpty()
  @IsNumber()
  apply_to_quantity?: number

  @ValidateIf((data) => data.type === PromotionType.BUYGET)
  @IsNotEmpty()
  @IsNumber()
  buy_rules_min_quantity?: number
}

export class ApplicationMethodsMethodPostReq {
  @IsOptional()
  @IsString()
  description?: string

  @IsOptional()
  @IsString()
  value?: string

  @IsOptional()
  @IsNumber()
  max_quantity?: number

  @IsOptional()
  @IsEnum(ApplicationMethodType)
  type?: ApplicationMethodType

  @IsOptional()
  @IsEnum(ApplicationMethodTargetType)
  target_type?: ApplicationMethodTargetType

  @IsOptional()
  @IsEnum(ApplicationMethodAllocation)
  allocation?: ApplicationMethodAllocation

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PromotionRule)
  target_rules?: PromotionRule[]

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PromotionRule)
  buy_rules?: PromotionRule[]

  @IsOptional()
  @IsNumber()
  apply_to_quantity?: number

  @IsOptional()
  @IsNumber()
  buy_rules_min_quantity?: number
}

export class AdminPostPromotionsPromotionReq {
  @IsOptional()
  @IsString()
  code?: string

  @IsOptional()
  @IsBoolean()
  is_automatic?: boolean

  @IsOptional()
  @IsEnum(PromotionType)
  type?: PromotionType

  @IsOptional()
  @Validate(XorConstraint, ["campaign"])
  @IsString()
  campaign_id?: string

  @IsOptional()
  @Validate(XorConstraint, ["campaign_id"])
  @ValidateNested()
  @Type(() => AdminPostCampaignsReq)
  campaign?: AdminPostCampaignsReq

  @IsOptional()
  @ValidateNested()
  @Type(() => ApplicationMethodsMethodPostReq)
  application_method?: ApplicationMethodsMethodPostReq

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PromotionRule)
  rules?: PromotionRule[]
}

export class AdminPostPromotionsPromotionRulesReq {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PromotionRule)
  rules: PromotionRule[]
}
