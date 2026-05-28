import { BaseFilterable } from "../../dal"

export type AuthVerification = {
  actor_type?: string | null
  provider: string
  entity_id: string
  expires_at?: Date | string
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

export type CreateAuthVerificationTokenDTO = {
  auth_identity_id: string
  provider_identity_id: string
  entity_id: string
  expires_at: Date
  metadata?: Record<string, unknown> | null
}

export type CreateAuthVerificationTokenResponse = {
  token: string
  verification_token: AuthVerificationTokenDTO
}

export type RequestAuthVerificationDTO = {
  actor_type?: string | null
  provider: string
  entity_id: string
  ttl_seconds?: number
  metadata?: Record<string, unknown> | null
}

export type RequestAuthVerificationResponse = {
  token: string
  verification: AuthVerification & {
    auth_identity_id: string
    provider_identity_id: string
    metadata?: Record<string, unknown> | null
  }
}

export type ConfirmAuthVerificationDTO = {
  token: string
  provider?: string
}

export type ConfirmAuthVerificationResponse = {
  verified: true
  auth_identity_id: string
  provider_identity_id: string
  entity_id: string
}

export interface FilterableAuthVerificationTokenProps
  extends BaseFilterable<FilterableAuthVerificationTokenProps> {
  id?: string[]
  auth_identity_id?: string
  provider_identity_id?: string
  entity_id?: string
  token_hash?: string
}
