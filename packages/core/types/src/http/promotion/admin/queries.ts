import { BaseFilterable, OperatorMap } from "../../../dal";
import { FindParams } from "../../common";

export interface AdminGetPromotionsParams extends 
  FindParams, BaseFilterable<AdminGetPromotionsParams>  {
    q?: string
    code?: string | string[]
    campaign_id?: string | string[]
    application_method?: {
      currency_code?: string | string[]
    }
    created_at?: OperatorMap<string>
    updated_at?: OperatorMap<string>
    deleted_at?: OperatorMap<string>
}