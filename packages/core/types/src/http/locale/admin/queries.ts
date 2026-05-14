import { BaseFilterable } from "../../../dal"
import { FindParams, SelectParams } from "../../common"

export interface AdminLocaleParams extends SelectParams {}

export interface AdminLocaleListParams
  extends FindParams,
    BaseFilterable<AdminLocaleListParams> {
  /**
   * Query or keyword to search the locale's searchable fields.
   */
  q?: string
  /**
   * Filter by locale code(s) in BCP 47 format.
   * 
   * @example
   * "en-US"
   */
  code?: string | string[]
}
