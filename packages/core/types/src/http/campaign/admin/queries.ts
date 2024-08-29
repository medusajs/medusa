
import { BaseFilterable, OperatorMap } from "../../../dal"
import { FindParams } from "../../common"

export interface AdminGetCampaignParams
  extends FindParams,
    BaseFilterable<AdminGetCampaignParams> {
  q?: string
  campaign_identifier?: string
  budget?: {
    currency_code?: string
  }
  $and?: AdminGetCampaignParams[]
  $or?: AdminGetCampaignParams[]
}
