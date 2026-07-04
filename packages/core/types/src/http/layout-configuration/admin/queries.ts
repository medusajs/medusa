import { BaseFilterable } from "../../../dal"
import { FindParams } from "../../common"

export interface AdminGetLayoutConfigurationsParams
  extends FindParams,
    BaseFilterable<AdminGetLayoutConfigurationsParams> {
  /**
   * IDs to filter layout configurations by.
   */
  id?: string | string[]
  /**
   * Zone(s) to filter by, e.g. "product.details".
   */
  zone?: string | string[]
  /**
   * User ID to filter by.
   */
  user_id?: string | string[] | null
  /**
   * Filter by system default status.
   */
  is_system_default?: boolean
}
