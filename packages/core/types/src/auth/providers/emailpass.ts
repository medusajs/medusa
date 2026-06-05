/**
 * Configuration options for the Email/Password authentication provider.
 */
export interface EmailPassAuthProviderOptions {
  /**
   * Configuration for password hashing parameters using scrypt.
   */
  hashConfig?: {
    /**
     * CPU/memory cost parameter (logN). Must be greater than 1, a power of 2, and less than 2^(128 * r / 8).
     */
    logN: number
    /**
     * Block size parameter (r).
     */
    r: number
    /**
     * Parallelization parameter (p). Must be a positive integer satisfying p <= ((2^32-1) * hLen) / MFLen.
     */
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
