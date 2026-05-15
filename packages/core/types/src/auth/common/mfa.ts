import { BaseFilterable } from "../../dal"
import { AuthIdentityDTO } from "./auth-identity"

/**
 * Supported MFA providers. Defaults to TOTP but allows string extensions.
 * 
 * @since 2.15.3
 */
export type AuthMfaProvider = "totp" | (string & {})

/**
 * Methods available for MFA challenges, including providers and recovery codes.
 * 
 * @since 2.15.3
 */
export type AuthMfaChallengeMethod = AuthMfaProvider | "recovery_code"

/**
 * Status of an MFA setup for an authentication identity.
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
   * The MFA configuration's ID.
   */
  id: string
  /**
   * The ID of the authentication identity this MFA belongs to.
   */
  auth_identity_id?: string
  /**
   * The authentication identity this MFA belongs to.
   * 
   * @expandable
   */
  auth_identity?: AuthIdentityDTO
  /**
   * The MFA provider used.
   */
  provider: AuthMfaProvider
  /**
   * The status of this MFA configuration.
   */
  status: AuthMfaStatus
  /**
   * Additional metadata for the MFA configuration.
   */
  metadata?: Record<string, unknown> | null
}

/**
 * MFA recovery code for emergency authentication bypassing.
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
 * An active MFA challenge requiring user verification.
 * 
 * @since 2.15.3
 */
export type AuthMfaChallengeDTO = {
  /**
   * The MFA challenge's ID.
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
 * Data required to start MFA setup for an authentication identity.
 * 
 * @since 2.15.3
 */
export type AuthMfaStartDTO = {
  /**
   * The ID of the authentication identity to set up MFA for.
   */
  auth_identity_id: string
  /**
   * The MFA provider to use.
   */
  provider: AuthMfaProvider
  /**
   * Optional label for the MFA configuration.
   */
  label?: string | null
  /**
   * The issuer name for TOTP apps.
   */
  issuer?: string
  /**
   * Additional metadata for the MFA setup.
   */
  metadata?: Record<string, unknown> | null
}

/**
 * Response data when starting MFA setup.
 * 
 * @since 2.15.3
 */
export type AuthMfaStartResponse = {
  /**
   * The created MFA configuration.
   */
  mfa: AuthMfaDTO
  /**
   * The secret key for manual TOTP app setup.
   */
  secret?: string
  /**
   * The QR code URL for easy TOTP app setup.
   */
  otpauth_url?: string
}

/**
 * Data required to verify and enable an MFA configuration.
 * 
 * @since 2.15.3
 */
export type AuthMfaVerifyDTO = {
  /**
   * The ID of the MFA configuration to verify.
   */
  id: string
  /**
   * The verification code from the MFA provider.
   */
  code: string
}

/**
 * Data required to create a new MFA challenge.
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
 * Data required to verify an MFA challenge.
 * 
 * @since 2.15.3
 */
export type VerifyAuthMfaChallengeDTO = {
  /**
   * The ID of the MFA challenge to verify.
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
 * Data required to disable an MFA configuration.
 * 
 * @since 2.15.3
 */
export type DisableAuthMfaDTO = {
  /**
   * The ID of the MFA configuration to disable.
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
 * Data required to generate MFA recovery codes.
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
 * Response containing generated MFA recovery codes.
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
 * Data required to use an MFA recovery code.
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
 * Filters available when retrieving MFA configurations.
 * 
 * @since 2.15.3
 */
export interface FilterableAuthMfaProps
  extends BaseFilterable<FilterableAuthMfaProps> {
  /**
   * Filter by MFA configuration IDs.
   */
  id?: string[]
  /**
   * Filter by authentication identity ID.
   */
  auth_identity_id?: string
  /**
   * Filter by MFA provider.
   */
  provider?: AuthMfaProvider
  /**
   * Filter by MFA status.
   */
  status?: AuthMfaStatus | AuthMfaStatus[]
}
