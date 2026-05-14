import { BaseFilterable } from "../../dal"
import { AuthIdentityDTO } from "./auth-identity"

export type AuthMfaProvider = "totp" | (string & {})

export type AuthMfaChallengeMethod = AuthMfaProvider | "recovery_code"

export type AuthMfaStatus = "pending" | "enabled" | "disabled"

export type AuthMfaDTO = {
  id: string
  auth_identity_id?: string
  auth_identity?: AuthIdentityDTO
  provider: AuthMfaProvider
  status: AuthMfaStatus
  metadata?: Record<string, unknown> | null
}

export type AuthMfaRecoveryCodeDTO = {
  id: string
  auth_identity_id?: string
  auth_identity?: AuthIdentityDTO
}

export type AuthMfaChallengeDTO = {
  id: string
  auth_identity_id?: string
  auth_identity?: AuthIdentityDTO
  actor_type?: string | null
  auth_provider?: string | null
  methods: AuthMfaChallengeMethod[]
  expires_at: Date
  attempts: number
  max_attempts: number
  completed_at?: Date | null
  metadata?: Record<string, unknown> | null
}

export type AuthMfaStartDTO = {
  auth_identity_id: string
  provider: AuthMfaProvider
  label?: string | null
  issuer?: string
  metadata?: Record<string, unknown> | null
}

export type AuthMfaStartResponse = {
  mfa: AuthMfaDTO
  secret?: string
  otpauth_url?: string
}

export type AuthMfaVerifyDTO = {
  id: string
  code: string
}

export type CreateAuthMfaChallengeDTO = {
  auth_identity_id: string
  actor_type?: string | null
  auth_provider?: string | null
  metadata?: Record<string, unknown> | null
}

export type VerifyAuthMfaChallengeDTO = {
  id: string
  method: AuthMfaChallengeMethod
  code: string
}

export type DisableAuthMfaDTO = {
  id: string
  method?: AuthMfaChallengeMethod
  code?: string
}

export type GenerateAuthMfaRecoveryCodesDTO = {
  auth_identity_id: string
  count?: number
}

export type GenerateAuthMfaRecoveryCodesResponse = {
  codes: string[]
}

export type UseAuthMfaRecoveryCodeDTO = {
  auth_identity_id: string
  code: string
}

export interface FilterableAuthMfaProps
  extends BaseFilterable<FilterableAuthMfaProps> {
  id?: string[]
  auth_identity_id?: string
  provider?: AuthMfaProvider
  status?: AuthMfaStatus | AuthMfaStatus[]
}
