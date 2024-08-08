import { BaseFilterable, OperatorMap } from "../../../dal"
import { SelectParams } from "../../common"
import { BaseReturnReasonListParams } from "../common"

export interface AdminReturnReasonListParams
  extends BaseReturnReasonListParams,
    BaseFilterable<AdminReturnReasonListParams> {
  deleted_at?: OperatorMap<string>
}

export interface AdminReturnReasonParams extends SelectParams {}
