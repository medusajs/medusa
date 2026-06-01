import { BaseFilterable } from "../../dal"
import { AuthIdentityDTO } from "./auth-identity"

/**
 * Supported multi-factor authentication (MFA) providers. Defaults to time-based one-time password (TOTP) but allows string extensions.
 *
 * @since 2.15.3
 */
export type AuthMfaProvider = "totp" | (string & {})

/**
 * Methods available for multi-factor authentication (MFA) challenges, including providers and recovery codes.
 *
 * @since 2.15.3
 */
export type AuthMfaChallengeMethod = AuthMfaProvider | "recovery_code"

/**
 * Status of a multi-factor authentication (MFA) setup for an authentication identity.
 *
 * @since 2.15.3
 */
export type AuthMfaStatus = "pending" | "enabled" | "disabled"

/**
 * Multi-factor authentication configuration for an authentication identity.
 *
 * @since 2.15.3
 */
export type AuthMfaDTO = {
  /**
   * The multi-factor authentication (MFA) configuration's ID.
   */
  id: string
  /**
   * The ID of the authentication identity this multi-factor authentication (MFA) belongs to.
   */
  auth_identity_id?: string
  /**
   * The authentication identity this multi-factor authentication (MFA) belongs to.
   *
   * @expandable
   */
  auth_identity?: AuthIdentityDTO
  /**
   * The multi-factor authentication (MFA) provider used.
   */
  provider: AuthMfaProvider
  /**
   * The status of this multi-factor authentication (MFA) configuration.
   */
  status: AuthMfaStatus
  /**
   * Additional metadata for the multi-factor authentication (MFA) configuration.
   */
  metadata?: Record<string, unknown> | null
}

/**
 * Filter for selecting multi-factor authentication (MFA) configurations.
 */
export type AuthMfaSelector = {
  /**
   * The ID of the multi-factor authentication (MFA) configuration.
   */
  id: string
  /**
   * The ID of the authentication identity this multi-factor authentication (MFA) belongs to.
   */
  auth_identity_id?: string
}

/**
 * Multi-factor authentication (MFA) recovery code for emergency authentication bypassing.
 *
 * @since 2.15.3
 */
export type AuthMfaRecoveryCodeDTO = {
  /**
   * The recovery code's ID.
   */
  id: string
  /**
   * The ID of the authentication identity this recovery code belongs to.
   */
  auth_identity_id?: string
  /**
   * The authentication identity this recovery code belongs to.
   *
   * @expandable
   */
  auth_identity?: AuthIdentityDTO
}

/**
 * An active multi-factor authentication (MFA) challenge requiring user verification.
 *
 * @since 2.15.3
 */
export type AuthMfaChallengeDTO = {
  /**
   * The multi-factor authentication (MFA) challenge's ID.
   */
  id: string
  /**
   * The ID of the authentication identity being challenged.
   */
  auth_identity_id?: string
  /**
   * The authentication identity being challenged.
   *
   * @expandable
   */
  auth_identity?: AuthIdentityDTO
  /**
   * The type of actor initiating the challenge.
   */
  actor_type?: string | null
  /**
   * The authentication provider handling the challenge.
   */
  auth_provider?: string | null
  /**
   * Available methods for completing this challenge.
   */
  methods: AuthMfaChallengeMethod[]
  /**
   * When the challenge expires.
   */
  expires_at: Date
  /**
   * Number of verification attempts made.
   */
  attempts: number
  /**
   * Maximum verification attempts allowed.
   */
  max_attempts: number
  /**
   * When the challenge was completed.
   */
  completed_at?: Date | null
  /**
   * Additional metadata for the challenge.
   */
  metadata?: Record<string, unknown> | null
}

/**
 * Data required to start multi-factor authentication (MFA) setup for an authentication identity.
 *
 * @since 2.15.3
 */
export type AuthMfaStartDTO = {
  /**
   * The ID of the authentication identity to set up multi-factor authentication (MFA) for.
   */
  auth_identity_id: string
  /**
   * The multi-factor authentication (MFA) provider to use.
   */
  provider: AuthMfaProvider
  /**
   * Optional label for the multi-factor authentication (MFA) configuration.
   */
  label?: string | null
  /**
   * The issuer name for time-based one-time password (TOTP) apps.
   */
  issuer?: string
  /**
   * Additional metadata for the multi-factor authentication (MFA) setup.
   */
  metadata?: Record<string, unknown> | null
}

/**
 * Response data when starting multi-factor authentication (MFA) setup.
 *
 * @since 2.15.3
 */
export type AuthMfaStartResponse = {
  /**
   * The created multi-factor authentication (MFA) configuration.
   */
  mfa: AuthMfaDTO
  /**
   * The secret key for manual time-based one-time password (TOTP) app setup.
   */
  secret?: string
  /**
   * The QR code URL for easy time-based one-time password (TOTP) app setup.
   */
  otpauth_url?: string
}

/**
 * Data required to verify and enable a multi-factor authentication (MFA) configuration.
 *
 * @since 2.15.3
 */
export type AuthMfaVerifyDTO = {
  /**
   * The ID of the multi-factor authentication (MFA) configuration to verify.
   */
  id: string
  /**
   * The ID of the authentication identity this multi-factor authentication (MFA) belongs to.
   */
  auth_identity_id?: string
  /**
   * The verification code from the multi-factor authentication (MFA) provider.
   */
  code: string
}

/**
 * Data required to create a new multi-factor authentication (MFA) challenge.
 *
 * @since 2.15.3
 */
export type CreateAuthMfaChallengeDTO = {
  /**
   * The ID of the authentication identity to challenge.
   */
  auth_identity_id: string
  /**
   * The type of actor requesting the challenge.
   */
  actor_type?: string | null
  /**
   * The authentication provider handling the challenge.
   */
  auth_provider?: string | null
  /**
   * Additional metadata for the challenge.
   */
  metadata?: Record<string, unknown> | null
}

/**
 * Data required to verify a multi-factor authentication (MFA) challenge.
 *
 * @since 2.15.3
 */
export type VerifyAuthMfaChallengeDTO = {
  /**
   * The ID of the multi-factor authentication (MFA) challenge to verify.
   */
  id: string
  /**
   * The method being used to complete the challenge.
   */
  method: AuthMfaChallengeMethod
  /**
   * The verification code for the chosen method.
   */
  code: string
}

/**
 * Data required to disable a multi-factor authentication (MFA) configuration.
 *
 * @since 2.15.3
 */
export type DisableAuthMfaDTO = {
  /**
   * The ID of the multi-factor authentication (MFA) configuration to disable.
   */
  id: string
  /**
   * Optional method for additional verification.
   */
  method?: AuthMfaChallengeMethod
  /**
   * Optional verification code for the method.
   */
  code?: string
}

/**
 * Data required to generate multi-factor authentication (MFA) recovery codes.
 *
 * @since 2.15.3
 */
export type GenerateAuthMfaRecoveryCodesDTO = {
  /**
   * The ID of the authentication identity to generate codes for.
   */
  auth_identity_id: string
  /**
   * Number of recovery codes to generate. Defaults to implementation-specific value.
   */
  count?: number
}

/**
 * Response containing generated multi-factor authentication (MFA) recovery codes.
 *
 * @since 2.15.3
 */
export type GenerateAuthMfaRecoveryCodesResponse = {
  /**
   * The generated recovery codes for emergency access.
   */
  codes: string[]
}

/**
 * Data required to use a multi-factor authentication (MFA) recovery code.
 *
 * @since 2.15.3
 */
export type UseAuthMfaRecoveryCodeDTO = {
  /**
   * The ID of the authentication identity using the recovery code.
   */
  auth_identity_id: string
  /**
   * The recovery code to consume.
   */
  code: string
}

/**
 * Filters available when retrieving multi-factor authentication (MFA) configurations.
 *
 * @since 2.15.3
 */
export interface FilterableAuthMfaProps
  extends BaseFilterable<FilterableAuthMfaProps> {
  /**
   * Filter by multi-factor authentication (MFA) configuration IDs.
   */
  id?: string[]
  /**
   * Filter by authentication identity ID.
   */
  auth_identity_id?: string
  /**
   * Filter by multi-factor authentication (MFA) provider.
   */
  provider?: AuthMfaProvider
  /**
   * Filter by multi-factor authentication (MFA) status.
   */
  status?: AuthMfaStatus | AuthMfaStatus[]
}
