import { BaseFilterable } from "../../../dal"
import { FindParams, SelectParams } from "../../common"

export interface AdminCurrencyParams extends SelectParams {}

export interface AdminCurrencyListParams
  extends FindParams,
    BaseFilterable<AdminCurrencyListParams> {
  /**
   * Query or keyword to search the currency's searchable fields.
   */
  q?: string
  /**
   * Filter by currency code(s).
   */
  code?: string | string[]
}
