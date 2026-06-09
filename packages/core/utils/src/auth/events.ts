/**
 * @category Auth
 * @customNamespace Auth
 */
export const AuthEvents = {
  /**
   * Emitted when an MFA factor is enabled for an auth identity.
   * @since 2.15.5
   *
   * @eventPayload
   * ```ts
   * {
   *   auth_identity_id, // The ID of the auth identity for which the MFA factor was enabled.
   *   mfa_id, // The ID of the MFA factor that was enabled.
   *   provider, // The provider of the MFA factor that was enabled.
   * }
   * ```
   */
  MFA_ENABLED: "auth.mfa_enabled",
  /**
   * Emitted when an MFA factor is disabled for an auth identity.
   * @since 2.15.5
   *
   * @eventPayload
   * ```ts
   * {
   *   auth_identity_id, // The ID of the auth identity for which the MFA factor was disabled.
   *   mfa_id, // The ID of the MFA factor that was disabled.
   *   provider, // The provider of the MFA factor that was disabled.
   * }
   * ```
   */
  MFA_DISABLED: "auth.mfa_disabled",
  /**
   * Emitted when recovery codes are generated for an auth identity.
   * @since 2.15.5
   *
   * @eventPayload
   * ```ts
   * {
   *   auth_identity_id, // The ID of the auth identity for which the recovery codes were generated.
   *   count, // (number) The number of recovery codes that were generated.
   * }
   * ```
   */
  MFA_RECOVERY_CODES_GENERATED: "auth.mfa_recovery_codes_generated",
} as const
