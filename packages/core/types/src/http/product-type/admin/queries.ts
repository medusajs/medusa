import { BaseFilterable, OperatorMap } from "../../../dal"
import { FindParams, SelectParams } from "../../common"

export interface AdminProductTypeListParams
  extends FindParams,
    BaseFilterable<AdminProductTypeListParams> {
  /**
   * Query or keywords to apply filters on the type's searchable fields.
   */
  q?: string
  /**
   * Filter by product type ID(s).
   */
  id?: string | string[]
  /**
   * Filter by value(s).
   */
  value?: string | string[]
  /**
   * Filter by external ID(s).
   */
  external_id?: string | string[]
  /**
   * Apply filters on the creation date.
   */
  created_at?: OperatorMap<string>
  /**
   * Apply filters on the update date.
   */
  updated_at?: OperatorMap<string>
  /**
   * Apply filters on the deletion date.
   */
  deleted_at?: OperatorMap<string>
}

export interface AdminProductTypeParams extends SelectParams {}
