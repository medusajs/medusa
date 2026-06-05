export interface EmailPassAuthProviderOptions {
  hashConfig?: {
    logN: number
    r: number
    p: number
  }
  /**
   * Array of actor types that require email verification before they can
   * authenticate. When omitted or empty, no actor type requires verification.
   * Developers must explicitly list the actor types that should require
   * verification (e.g. `["customer"]`).
   */
  require_verification?: string[]
}
