import { BaseFilterable, OperatorMap } from "../../../dal"
import { PriceListStatus } from "../../../pricing"
import { FindParams, SelectParams } from "../../common"

export interface AdminPriceListListParams
  extends FindParams,
    BaseFilterable<AdminPriceListListParams> {
  /**
   * Query or keyword to filter the price list's searchable fields.
   */
  q?: string
  /**
   * Filter by price list ID(s).
   */
  id?: string | string[]
  /**
   * Apply filters on the price list's start date.
   */
  starts_at?: OperatorMap<string>
  /**
   * Apply filters on the price list's end date.
   */
  ends_at?: OperatorMap<string>
  /**
   * Filter by statuses.
   */
  status?: PriceListStatus[]
  /**
   * Filter by the number of rules.
   */
  rules_count?: number[]
}

export interface AdminPriceListParams extends SelectParams {}

export interface AdminPriceListPriceListParams
  extends FindParams,
    BaseFilterable<AdminPriceListPriceListParams> {}
