import { IsDate, IsNotEmpty, IsOptional, IsString } from "class-validator"
import { FindParams, extendedFindParamsMixin } from "../../../types/common"

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

export class AdminPostCampaignsCampaignReq {
  @IsNotEmpty()
  @IsString()
  name: string

  @IsOptional()
  @IsNotEmpty()
  campaign_identifier: string

  @IsOptional()
  @IsString()
  description: string

  @IsOptional()
  @IsString()
  currency: string

  @IsOptional()
  @IsDate()
  starts_at: Date

  @IsOptional()
  @IsDate()
  ends_at: Date
}
