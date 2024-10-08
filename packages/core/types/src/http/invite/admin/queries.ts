import { BaseFilterable, OperatorMap } from "../../../dal"
import { FindParams } from "../../common"

export interface AdminGetInvitesParams
  extends FindParams,
    BaseFilterable<AdminGetInvitesParams> {
  q?: string
  id?: string | string[]
  email?: string | string[]
  created_at?: OperatorMap<string>
  updated_at?: OperatorMap<string>
  deleted_at?: OperatorMap<string>
}
