import { BaseFilterable, OperatorMap } from "../../../dal"
import { SelectParams } from "../../common"
import { BaseReturnReasonListParams } from "../common"

export interface AdminReturnReasonListParams
  extends
    BaseReturnReasonListParams,
    BaseFilterable<AdminReturnReasonListParams> {
  /**
   * Apply filters on the return reason's deletion date.
   */
  deleted_at?: OperatorMap<string>
}

export interface AdminReturnReasonParams extends SelectParams {}
