export interface AdminCreateShippingProfile {
  /**
   * The name of the shipping profile.
   */
  name: string
  /**
   * The type of the shipping profile.
   */
  type: string
  /**
   * Custom key-value pairs that can be added to the shipping profile.
   */
  metadata?: Record<string, unknown> | null
}

export interface AdminUpdateShippingProfile {
  /**
   * The name of the shipping profile.
   */
  name?: string
  /**
   * The type of the shipping profile.
   */
  type?: string
  /**
   * Custom key-value pairs that can be added to the shipping profile.
   */
  metadata?: Record<string, unknown> | null
}
