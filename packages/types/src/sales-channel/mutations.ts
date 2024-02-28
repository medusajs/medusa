/**
 * The sales channel to be created.
 */
export interface CreateSalesChannelDTO {
  /**
   * The name of the sales channel.
   */
  name: string

  /**
   * The description of the sales channel.
   */
  description?: string

  /**
   * Whether the sales channel is disabled.
   */
  is_disabled?: boolean
}

/**
 * The attributes to update in the sales channel.
 */
export interface UpdateSalesChannelDTO {
  /**
   * The ID of the sales channel.
   */
  id: string

  /**
   * The name of the sales channel.
   */
  name?: string

  /**
   * The description of the sales channel.
   */
  description?: string

  /**
   * Whether the sales channel is disabled.
   */
  is_disabled?: boolean
}
