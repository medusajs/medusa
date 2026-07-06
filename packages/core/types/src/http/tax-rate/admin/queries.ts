import { BaseFilterable, OperatorMap } from "../../../dal"
import { FindParams, SelectParams } from "../../common"

export interface AdminTaxRateListParams
  extends FindParams,
    BaseFilterable<AdminTaxRateListParams> {
  /**
   * Query or keywords to search the tax rate's searchable fields.
   */
  q?: string
  /**
   * Filter by tax region ID(s).
   */
  tax_region_id?: string | string[] | OperatorMap<string | string[]>
  /**
   * Filter by whether the tax rate is the default tax rate in its tax region.
   */
  is_default?: "true" | "false"
  /**
   * Filter by the date the tax rate was created.
   */
  created_at?: OperatorMap<string>
  /**
   * Filter by the date the tax rate was updated.
   */
  updated_at?: OperatorMap<string>
  /**
   * Filter by the date the tax rate was deleted.
   */
  deleted_at?: OperatorMap<string>
}

export interface AdminGetTaxRateParams extends SelectParams {}
