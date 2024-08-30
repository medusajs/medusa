import { BaseFilterable, OperatorMap } from "../../../dal"
import { FindParams, SelectParams } from "../../common"

export interface AdminGetPromotionParams extends SelectParams {}

export interface AdminGetPromotionsParams
  extends FindParams,
    BaseFilterable<AdminGetPromotionsParams> {
  q?: string
  code?: string | string[]
  campaign_id?: string | string[]
  application_method?: {
    currency_code?: string | string[]
  }
  created_at?: OperatorMap<string>
  updated_at?: OperatorMap<string>
  deleted_at?: OperatorMap<string>
  $and?: AdminGetPromotionsParams[]
  $or?: AdminGetPromotionsParams[]
}

export interface AdminGetPromotionRuleParams {
  promotion_type?: string
  application_method_type?: string
}

export interface AdminGetPromotionRuleTypeParams extends SelectParams {
  promotion_type?: string
  application_method_type?: string
}

export interface AdminGetPromotionsRuleValueParams extends FindParams {
  q?: string
  value?: string | string[]
}
