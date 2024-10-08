import { BaseFilterable, OperatorMap } from "../../../dal"
import { FindParams, SelectParams } from "../../common"

export interface AdminTaxRegionListParams
  extends FindParams,
    BaseFilterable<AdminTaxRegionListParams> {
  id?: string | string[]
  q?: string
  parent_id?: string | string[] | OperatorMap<string | string[]>
  country_code?: string | string[] | OperatorMap<string | string[]>
  province_code?: string | string[] | OperatorMap<string | string[]>
  created_at?: string | OperatorMap<string>
  updated_at?: string | OperatorMap<string>
  deleted_at?: string | OperatorMap<string>
  created_by?: string | OperatorMap<string>
}

export interface AdminTaxRegionParams extends SelectParams {}
