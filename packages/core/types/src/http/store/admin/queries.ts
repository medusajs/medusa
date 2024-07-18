import { BaseFilterable } from "../../../dal"
import { FindParams, SelectParams } from "../../common"

export interface AdminStoreListParams
  extends BaseFilterable<AdminStoreListParams>,
    FindParams {
  q?: string
  id?: string | string[]
  name?: string | string[]
}

export interface AdminStoreParams extends SelectParams {}
