import { BaseFilterable } from "../../../dal"
import { FindParams, SelectParams } from "../../common"

export interface AdminGetCampaignsParams
  extends FindParams,
    BaseFilterable<AdminGetCampaignsParams> {
  q?: string
  campaign_identifier?: string
  budget?: {
    currency_code?: string
  }
  $and?: AdminGetCampaignsParams[]
  $or?: AdminGetCampaignsParams[]
}

export interface AdminGetCampaignParams extends SelectParams {}
