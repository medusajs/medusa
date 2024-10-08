import { OperatorMap } from "../../../dal"
import { BaseCollectionListParams, BaseCollectionParams } from "../common"

export interface AdminCollectionListParams extends BaseCollectionListParams {
  deleted_at?: OperatorMap<string>
}
export interface AdminCollectionParams extends BaseCollectionParams {}
