import { BaseFilterable } from "../../../dal"
import { FindParams, SelectParams } from "../../common"

export interface AdminStoreListParams
  extends BaseFilterable<AdminStoreListParams>, FindParams {
  /**
   * Query or keywords to search the store's searchable fields.
   */
  q?: string
  /**
   * Filter by store ID(s).
   */
  id?: string | string[]
  /**
   * Filter by store name.
   */
  name?: string | string[]
}

export interface AdminStoreParams extends SelectParams {}
