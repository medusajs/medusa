import { OperatorMap } from "../../../dal"
import { FindParams, SelectParams } from "../../common"

export interface AdminUserListParams extends FindParams {
  q?: string
  id?: string | string[]
  email?: string | null
  first_name?: string | null
  last_name?: string | null
  created_at?: OperatorMap<string>
  updated_at?: OperatorMap<string>
  deleted_at?: OperatorMap<string>
}

export interface AdminUserParams extends SelectParams {}
