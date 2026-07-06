export interface AdminCreateSalesChannel {
  /**
   * The sales channel's name.
   */
  name: string
  /**
   * The sales channel's description.
   */
  description?: string
  /**
   * Whether the sales channel is disabled.
   *
   * @defaultValue `false`
   */
  is_disabled?: boolean
  /**
   * Custom key-value pairs that can be added to the sales channel.
   */
  metadata?: Record<string, unknown> | null
}

export interface AdminUpdateSalesChannel {
  /**
   * The sales channel's name.
   */
  name?: string
  /**
   * The sales channel's description.
   */
  description?: string | null
  /**
   * Whether the sales channel is disabled.
   */
  is_disabled?: boolean
  /**
   * Custom key-value pairs that can be added to the sales channel.
   */
  metadata?: Record<string, unknown> | null
}

export interface AdminUpdateSalesChannelProducts {
  /**
   * The IDs of the products to add to the sales channel.
   */
  add?: string[]
  /**
   * The IDs of the products to remove from the sales channel.
   */
  remove?: string[]
}
