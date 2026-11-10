import { BaseFilterable } from "../../../dal"
import { FindParams } from "../../common"

export interface AdminGetTaxProvidersParams
  extends FindParams, BaseFilterable<AdminGetTaxProvidersParams> {
  /**
   * Filter by tax provider ID(s).
   */
  id?: string | string[]
  /**
   * Whether the tax provider is enabled.
   */
  is_enabled?: boolean
}
