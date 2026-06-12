import { BaseFilterable } from "../../dal"

export type AuthVerificationDTO = {
  entity_id: string
  auth_identity_id: string
  type: string
  metadata?: Record<string, unknown> | null
  verified_at?: Date | null
  requested_at: Date
}

export type AuthVerificationTokenDTO = {
  id: string
  auth_identity_id?: string
  provider_identity_id?: string
  entity_id: string
  expires_at: Date
  metadata?: Record<string, unknown> | null
  created_at?: Date
  updated_at?: Date
  deleted_at?: Date | null
}

export type RequestAuthVerificationDTO = {
  entity_id: string
  auth_identity_id: string
  type: string
  metadata?: Record<string, unknown> | null
}

export type RequestAuthVerificationResponse = AuthVerificationDTO & {
  token: string
  expires_at: Date
}

export type ConfirmAuthVerificationDTO = { token: string }
export type ConfirmAuthVerificationResponse = AuthVerificationDTO

export interface FilterableAuthVerificationProps
  extends BaseFilterable<FilterableAuthVerificationProps> {
  id?: string[]
  auth_identity_id?: string
  entity_id?: string
  type?: string
}
