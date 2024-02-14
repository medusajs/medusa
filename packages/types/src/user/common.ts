import { DateComparisonOperator } from "../common"
import { BaseFilterable } from "../dal"

export interface UserDTO {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  avatar_url: string | null
  metadata: Record<string, unknown> | null
  created_at: Date
  updated_at: Date
  deleted_at: Date | null
}

export interface FilterableUserProps
  extends BaseFilterable<FilterableUserProps> {
  id?: string | string[]
  email?: string | string[]
  first_name?: string | string[]
  last_name?: string | string[]
}

export interface InviteDTO {
  id: string
  email: string
  accepted: boolean
  token: string
  expires_at: Date
  metadata: Record<string, unknown> | null
  created_at: Date
  updated_at: Date
  deleted_at?: Date | null
}

export interface FilterableInviteProps
  extends BaseFilterable<FilterableInviteProps> {
  id?: string | string[]
  email?: string | string[]
  expires_at?: DateComparisonOperator
}
