import { IsOptional, IsString } from "class-validator"
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
