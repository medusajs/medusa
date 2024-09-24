import { BaseFilterable, OperatorMap } from "../../../dal"
import { FindParams } from "../../common"
import { BaseRegionCountryFilters } from "../common"

export interface AdminRegionFilters
  extends FindParams,
    BaseFilterable<AdminRegionFilters> {
  q?: string
  id?: string | string[]
  currency_code?: string | string[]
  name?: string | string[]
  created_at?: OperatorMap<string>
  updated_at?: OperatorMap<string>
  deleted_at?: OperatorMap<string>
}
export interface AdminRegionCountryFilters extends BaseRegionCountryFilters {}
