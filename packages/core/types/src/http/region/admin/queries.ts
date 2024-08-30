import { BaseFilterable, OperatorMap } from "../../../dal";
import { FindParams } from "../../common";
import {
  BaseRegionCountryFilters,
  BaseRegionFilters,
} from "../common"

export interface AdminRegionFilters extends FindParams, BaseFilterable<BaseRegionFilters> {
  q?: string
  id?: string | string[]
  code?: string | string[]
  name?: string | string[]
  created_at?: OperatorMap<string>
  updated_at?: OperatorMap<string>
  deleted_at?: OperatorMap<string>
}
export interface AdminRegionCountryFilters extends BaseRegionCountryFilters {}