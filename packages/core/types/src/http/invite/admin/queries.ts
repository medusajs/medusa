import { BaseFilterable, OperatorMap } from "../../../dal"

export interface AdminGetInvitesParams extends BaseFilterable<AdminGetInvitesParams> {
  q?: string
  id?: string | string[]
  email?: string | string[]
  created_at?: OperatorMap<string>
  updated_at?: OperatorMap<string>
  deleted_at?: OperatorMap<string>
}