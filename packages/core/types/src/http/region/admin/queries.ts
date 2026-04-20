import { BaseFilterable, OperatorMap } from "../../../dal"
import { FindParams, SelectParams } from "../../common"
import { BaseRegionCountryFilters } from "../common"

export interface AdminRegionFilters
  extends FindParams,
    BaseFilterable<AdminRegionFilters> {
  /**
   * Query or keywords to search the region's searchable fields.
   */
  q?: string
  /**
   * Filter by region ID(s).
   */
  id?: string | string[]
  /**
   * Filter by currency code(s).
   */
  currency_code?: string | string[]
  /**
   * Filter by region name(s).
   */
  name?: string | string[]
  /**
   * Apply filters on the region's creation date.
   */
  created_at?: OperatorMap<string>
  /**
   * Apply filters on the region's update date.
   */
  updated_at?: OperatorMap<string>
  /**
   * Apply filters on the region's deletion date.
   */
  deleted_at?: OperatorMap<string>
}
export interface AdminRegionCountryFilters extends BaseRegionCountryFilters {}

export interface AdminGetRegionParams extends SelectParams {}
