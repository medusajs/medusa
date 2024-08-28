import { ApiKeyType } from "@medusajs/utils"
import { BaseFilterable, OperatorMap } from "../../../dal"
import { FindParams } from "../../common"

export interface AdminGetApiKeysParams
  extends FindParams,
    BaseFilterable<AdminGetApiKeysParams> {
  q?: string
  id?: string | string[]
  title?: string | string[]
  token?: string | string[]
  type?: ApiKeyType
  created_at?: OperatorMap<string>
  updated_at?: OperatorMap<string>
  deleted_at?: OperatorMap<string>
  revoked_at?: OperatorMap<string>
  $and?: AdminGetApiKeysParams[]
  $or?: AdminGetApiKeysParams[]
}
