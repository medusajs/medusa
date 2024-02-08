import { DateComparisonOperator } from "../common"

export type UserDTO = {
  id: string
  email: string
  first_name?: string | null
  last_name?: string | null
  avatar_url?: string | null
  metadata?: Record<string, unknown> | null
  created_at: Date
  updated_at: Date
  deleted_at?: Date | null
}

export type FilterableUserProps = {
  id?: string | string[]
  email?: string | string[]
  first_name?: string | string[]
  last_name?: string | string[]
}

export type InviteDTO = {
  id: string
  email: string
  accepted: boolean
  token: string
  expires_at: Date
  metadata?: Record<string, unknown> | null
  created_at: Date
  updated_at: Date
  deleted_at?: Date | null
}

export type FilterableInviteProps = {
  id?: string | string[]
  email?: string | string[]
  expires_at?: DateComparisonOperator
}
