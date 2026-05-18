import { BaseFilterable } from "../../dal"
import { AuthIdentityDTO } from "./auth-identity"

/**
 * The supported MFA providers.
 */
export type AuthMfaProvider = "totp" | (string & {})

/**
 * The supported MFA challenge methods.
 */
export type AuthMfaChallengeMethod = AuthMfaProvider | "recovery_code"

/**
 * The MFA configuration status.
 */
export type AuthMfaStatus = "pending" | "enabled" | "disabled"

/**
 * The MFA configuration details.
 */
export type AuthMfaDTO = {
  id: string
  auth_identity_id?: string
  auth_identity?: AuthIdentityDTO
  provider: AuthMfaProvider
  status: AuthMfaStatus
  metadata?: Record<string, unknown> | null
}

/**
 * The MFA selector properties for querying MFA configurations.
 *
 * @since 2.15.3
 */
export type AuthMfaSelector = {
  id: string
  auth_identity_id?: string
}

/**
 * The MFA recovery code details.
 */
export type AuthMfaRecoveryCodeDTO = {
  id: string
  auth_identity_id?: string
  auth_identity?: AuthIdentityDTO
}

/**
 * The MFA challenge details.
 */
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

/**
 * The data to start MFA setup.
 */
export type AuthMfaStartDTO = {
  auth_identity_id: string
  provider: AuthMfaProvider
  label?: string | null
  issuer?: string
  metadata?: Record<string, unknown> | null
}

/**
 * The response from starting MFA setup.
 */
export type AuthMfaStartResponse = {
  mfa: AuthMfaDTO
  secret?: string
  otpauth_url?: string
}

/**
 * The data to verify MFA setup.
 */
export type AuthMfaVerifyDTO = {
  id: string
  code: string
}

/**
 * The data to create an MFA challenge.
 */
export type CreateAuthMfaChallengeDTO = {
  auth_identity_id: string
  actor_type?: string | null
  auth_provider?: string | null
  metadata?: Record<string, unknown> | null
}

/**
 * The data to verify an MFA challenge.
 */
export type VerifyAuthMfaChallengeDTO = {
  id: string
  method: AuthMfaChallengeMethod
  code: string
}

/**
 * The data to disable MFA.
 */
export type DisableAuthMfaDTO = {
  id: string
  method?: AuthMfaChallengeMethod
  code?: string
}

/**
 * The data to generate MFA recovery codes.
 */
export type GenerateAuthMfaRecoveryCodesDTO = {
  auth_identity_id: string
  count?: number
}

/**
 * The response from generating MFA recovery codes.
 */
export type GenerateAuthMfaRecoveryCodesResponse = {
  codes: string[]
}

/**
 * The data to use an MFA recovery code.
 */
export type UseAuthMfaRecoveryCodeDTO = {
  auth_identity_id: string
  code: string
}

/**
 * The filterable properties for MFA configurations.
 */
export interface FilterableAuthMfaProps
  extends BaseFilterable<FilterableAuthMfaProps> {
  id?: string[]
  auth_identity_id?: string
  provider?: AuthMfaProvider
  status?: AuthMfaStatus | AuthMfaStatus[]
}
