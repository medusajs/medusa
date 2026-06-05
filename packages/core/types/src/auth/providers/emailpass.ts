export interface EmailPassAuthProviderOptions {
  hashConfig?: {
    logN: number
    r: number
    p: number
  }
  require_verification?: boolean
  /**
   * Actor types for which email verification should be skipped even when
   * `require_verification` is enabled. Defaults to `["user"]` since admin
   * users are typically created via invite or CLI and don't need to verify
   * their email.
   */
  disable_verification_for_actor_types?: string[]
}
