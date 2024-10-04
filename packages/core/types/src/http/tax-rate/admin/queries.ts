import { BaseFilterable, OperatorMap } from "../../../dal"
import { FindParams } from "../../common"

export interface AdminTaxRateListParams
  extends FindParams,
    BaseFilterable<AdminTaxRateListParams> {
  q?: string
  tax_region_id?: string | string[] | OperatorMap<string | string[]>
  is_default?: "true" | "false"
  service_zone_id?: string
  shipping_profile_id?: string
  provider_id?: string
  shipping_option_type_id?: string
  created_at?: OperatorMap<string>
  updated_at?: OperatorMap<string>
  deleted_at?: OperatorMap<string>
}
