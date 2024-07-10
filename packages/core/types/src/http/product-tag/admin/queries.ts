import { BaseFilterable, OperatorMap } from "../../../dal"
import { SelectParams } from "../../common"
import { BaseProductTagListParams } from "../common"

export interface AdminProductTagListParams
  extends BaseProductTagListParams,
    BaseFilterable<AdminProductTagListParams> {
  deleted_at?: OperatorMap<string>
}

export interface AdminProductTagParams extends SelectParams {}
