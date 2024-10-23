export interface AdminCreateCustomerGroup {
  /**
   * The customer group's name.
   */
  name: string
  /**
   * Key-value pairs of custom data.
   */
  metadata?: Record<string, unknown> | null
}

export interface AdminUpdateCustomerGroup {
  /**
   * The customer group's name.
   */
  name?: string
  /**
   * Key-value pairs of custom data.
   */
  metadata?: Record<string, unknown> | null
}
