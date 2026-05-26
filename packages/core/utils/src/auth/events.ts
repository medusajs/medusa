/**
 * @category Auth
 * @customNamespace Auth
 */
export const AuthEvents = {
  /**
   * Emitted when an MFA factor is enabled for an auth identity.
   * @since 2.15.5
   */
  MFA_ENABLED: "auth.mfa_enabled",
  /**
   * Emitted when an MFA factor is disabled for an auth identity.
   * @since 2.15.5
   */
  MFA_DISABLED: "auth.mfa_disabled",
  /**
   * Emitted when recovery codes are generated for an auth identity.
   * @since 2.15.5
   */
  MFA_RECOVERY_CODES_GENERATED: "auth.mfa_recovery_codes_generated",
} as const
