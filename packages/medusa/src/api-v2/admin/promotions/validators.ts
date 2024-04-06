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
  ArrayNotEmpty,
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
import {
  DateComparisonOperator,
  FindParams,
  extendedFindParamsMixin,
} from "../../../types/common"
import { XorConstraint } from "../../../types/validators/xor"
import { AdminPostCampaignsReq } from "../campaigns/validators"

export class AdminGetPromotionsPromotionParams extends FindParams {}

export class AdminGetPromotionsRuleValueParams extends extendedFindParamsMixin({
  limit: 100,
  offset: 0,
}) {
  /**
   * Search terms to search fields.
   */
  @IsString()
  @IsOptional()
  q?: string
}

export class AdminGetPromotionsParams extends extendedFindParamsMixin({
  limit: 100,
  offset: 0,
}) {
  @IsString()
  @IsOptional()
  code?: string

  /**
   * Search terms to search promotions' code fields.
   */
  @IsString()
  @IsOptional()
  q?: string

  /**
   * Date filters to apply on the promotions' `created_at` date.
   */
  @IsOptional()
  @ValidateNested()
  @Type(() => DateComparisonOperator)
  created_at?: DateComparisonOperator

  /**
   * Date filters to apply on the promotions' `updated_at` date.
   */
  @IsOptional()
  @ValidateNested()
  @Type(() => DateComparisonOperator)
  updated_at?: DateComparisonOperator
}

export class AdminPostCreatePromotionRule {
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

export class AdminPostPromotionsReq {
  @IsNotEmpty()
  @IsString()
  code: string

  @IsBoolean()
  @IsOptional()
  is_automatic?: boolean

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
  @Type(() => AdminPostApplicationMethodsReq)
  application_method: AdminPostApplicationMethodsReq

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AdminPostCreatePromotionRule)
  rules?: AdminPostCreatePromotionRule[]
}

export class AdminPostApplicationMethodsReq {
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

  @IsEnum(ApplicationMethodTargetType)
  target_type?: ApplicationMethodTargetType

  @IsOptional()
  @IsEnum(ApplicationMethodAllocation)
  allocation?: ApplicationMethodAllocation

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AdminPostCreatePromotionRule)
  target_rules?: AdminPostCreatePromotionRule[]

  @ValidateIf((data) => data.type === PromotionType.BUYGET)
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AdminPostCreatePromotionRule)
  buy_rules?: AdminPostCreatePromotionRule[]

  @ValidateIf((data) => data.type === PromotionType.BUYGET)
  @IsNotEmpty()
  @IsNumber()
  apply_to_quantity?: number

  @ValidateIf((data) => data.type === PromotionType.BUYGET)
  @IsNotEmpty()
  @IsNumber()
  buy_rules_min_quantity?: number
}

export class AdminPostApplicationMethodsMethodReq {
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
  @Type(() => AdminPostCreatePromotionRule)
  target_rules?: AdminPostCreatePromotionRule[]

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AdminPostCreatePromotionRule)
  buy_rules?: AdminPostCreatePromotionRule[]

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
  @Type(() => AdminPostApplicationMethodsMethodReq)
  application_method?: AdminPostApplicationMethodsMethodReq

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AdminPostCreatePromotionRule)
  rules?: AdminPostCreatePromotionRule[]
}

export class AdminPostBatchAddRules {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AdminPostCreatePromotionRule)
  rules: AdminPostCreatePromotionRule[]
}

export class AdminPostBatchRemoveRules {
  @ArrayNotEmpty()
  @IsString({ each: true })
  rule_ids: string[]
}

export class AdminPostBatchUpdateRules {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AdminPostUpdatePromotionRule)
  rules: AdminPostUpdatePromotionRule[]
}

export class AdminPostUpdatePromotionRule {
  @IsNotEmpty()
  @IsString()
  id: string

  @IsOptional()
  @IsEnum(PromotionRuleOperator)
  operator?: PromotionRuleOperator

  @IsOptional()
  @IsString()
  description?: string | null

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  attribute?: string

  @IsOptional()
  @IsArray()
  @Type(() => String)
  values?: string[]
}
