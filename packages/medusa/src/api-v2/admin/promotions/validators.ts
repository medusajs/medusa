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
  ValidateNested,
} from "class-validator"
import { FindParams, extendedFindParamsMixin } from "../../../types/common"
import { AdminPostCampaignsCampaignReq } from "../campaigns/validators"

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
  is_automatic: boolean

  @IsOptional()
  @IsEnum(PromotionType)
  type: PromotionType

  @IsOptional()
  @IsString()
  campaign_id: string

  @IsOptional()
  @ValidateNested()
  @Type(() => AdminPostCampaignsCampaignReq)
  campaign: AdminPostCampaignsCampaignReq

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ApplicationMethod)
  application_method: ApplicationMethod

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PromotionRule)
  rules: PromotionRule[]
}

export class PromotionRule {
  @IsOptional()
  @IsEnum(PromotionRuleOperator)
  operator: PromotionRuleOperator

  @IsOptional()
  @IsString()
  description: string | null

  @IsNotEmpty()
  @IsString()
  attribute: string

  @IsArray()
  @Type(() => String)
  values: string[]
}

export class ApplicationMethod {
  @IsOptional()
  @IsString()
  description: string

  @IsOptional()
  @IsString()
  value: string

  @IsOptional()
  @IsNumber()
  max_quantity: number

  @IsOptional()
  @IsEnum(ApplicationMethodType)
  type: ApplicationMethodType

  @IsOptional()
  @IsEnum(ApplicationMethodTargetType)
  target_type: ApplicationMethodTargetType

  @IsOptional()
  @IsEnum(ApplicationMethodAllocation)
  allocation?: ApplicationMethodAllocation

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PromotionRule)
  target_rules: PromotionRule[]
}

export class AdminPostPromotionsPromotionReq {
  @IsOptional()
  @IsString()
  code: string

  @IsBoolean()
  @IsOptional()
  is_automatic: boolean

  @IsOptional()
  @IsEnum(PromotionType)
  type: PromotionType

  @IsOptional()
  @IsString()
  campaign_id: string

  @IsOptional()
  @ValidateNested()
  @Type(() => AdminPostCampaignsCampaignReq)
  campaign: AdminPostCampaignsCampaignReq

  @IsOptional()
  @ValidateNested()
  @Type(() => ApplicationMethod)
  application_method: ApplicationMethod

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PromotionRule)
  rules: PromotionRule[]
}
