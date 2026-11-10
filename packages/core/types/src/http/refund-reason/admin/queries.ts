import { BaseFilterable } from "../../../dal"
import { SelectParams } from "../../common"
import { BaseRefundReasonListParams } from "../common"

export interface AdminRefundReasonListParams
  extends
    BaseRefundReasonListParams,
    BaseFilterable<AdminRefundReasonListParams> {}

export interface AdminRefundReasonParams extends SelectParams {}
