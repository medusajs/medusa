import { BaseFilterable, OperatorMap } from "../../../dal"
import { FindParams, SelectParams } from "../../common"

export interface AdminTaxRegionListParams
  extends FindParams,
    BaseFilterable<AdminTaxRegionListParams> {
  /**
   * Filter by tax region ID(s).
   */
  id?: string | string[]
  /**
   * Query or keywords to search the tax region's searchable fields.
   */
  q?: string
  /**
   * Filter by the tax region's parent ID(s) to retrieve its children.
   */
  parent_id?: string | string[] | OperatorMap<string | string[]>
  /**
   * Filter by the tax region's country code(s).
   */
  country_code?: string | string[] | OperatorMap<string | string[]>
  /**
   * Filter by the tax region's lower-case [ISO 3166-2](https://en.wikipedia.org/wiki/ISO_3166-2) province or state code(s).
   */
  province_code?: string | string[] | OperatorMap<string | string[]>
  /**
   * Filter by the date the tax region was created.
   */
  created_at?: string | OperatorMap<string>
  /**
   * Filter by the date the tax region was updated.
   */
  updated_at?: string | OperatorMap<string>
  /**
   * Filter by the date the tax region was deleted.
   */
  deleted_at?: string | OperatorMap<string>
  /**
   * Filter by the ID of the user who created the tax region to
   * retrieve tax regions created by a specific user.
   */
  created_by?: string | string[]
}

export interface AdminTaxRegionParams extends SelectParams {}
