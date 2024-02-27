import { FindParams, extendedFindParamsMixin } from "../../../types/common"
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator"
import { Transform, Type } from "class-transformer"

import { CampaignBudgetType } from "@medusajs/utils"
import { transformOptionalDate } from "../../../utils/validators/date-transform"

export class AdminGetCampaignsCampaignParams extends FindParams {}

export class AdminGetCampaignsParams extends extendedFindParamsMixin({
  limit: 100,
  offset: 0,
}) {
  @IsString()
  @IsOptional()
  campaign_identifier?: string

  @IsString()
  @IsOptional()
  currency?: string
}

export class AdminPostCampaignsReq {
  @IsNotEmpty()
  @IsString()
  name: string

  @IsOptional()
  @IsNotEmpty()
  campaign_identifier?: string

  @IsOptional()
  @IsString()
  description?: string

  @IsOptional()
  @IsString()
  currency?: string

  @IsOptional()
  @ValidateNested()
  @Type(() => CampaignBudget)
  budget?: CampaignBudget

  @IsOptional()
  @IsDateString()
  starts_at?: string

  @IsOptional()
  @IsDateString()
  ends_at?: string

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => IdObject)
  promotions?: IdObject[]
}

export class IdObject {
  @IsString()
  @IsNotEmpty()
  id: string
}

export class CampaignBudget {
  @IsOptional()
  @IsEnum(CampaignBudgetType)
  type?: CampaignBudgetType

  @IsOptional()
  @IsNumber()
  limit?: number
}

export class AdminPostCampaignsCampaignReq {
  @IsOptional()
  @IsString()
  name?: string

  @IsOptional()
  @IsNotEmpty()
  campaign_identifier?: string

  @IsOptional()
  @IsString()
  description?: string

  @IsOptional()
  @IsString()
  currency?: string

  @IsOptional()
  @ValidateNested()
  @Type(() => CampaignBudget)
  budget?: CampaignBudget

  @IsOptional()
  @IsDateString()
  starts_at?: string

  @IsOptional()
  @IsDateString()
  ends_at?: string

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => IdObject)
  promotions?: IdObject[]
}
