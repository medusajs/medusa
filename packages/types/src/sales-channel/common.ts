import { BaseFilterable } from "../dal"

/**
 * The sales channel location details.
 */
export interface SalesChannelLocationDTO {
  /**
   * The associated sales channel's ID.
   */
  sales_channel_id: string

  /**
   * The associated location's ID.
   */
  location_id: string

  /**
   * The associated sales channel.
   */
  sales_channel: SalesChannelDTO
}

/**
 * The sales channel details.
 */
export interface SalesChannelDTO {
  /**
   * The ID of the sales channel.
   */
  id: string

  /**
   * The name of the sales channel.
   */
  name: string

  /**
   * The description of the sales channel.
   */
  description: string | null

  /**
   * Whether the sales channel is disabled.
   */
  is_disabled: boolean

  /**
   * Holds custom data in key-value pairs.
   */
  metadata: Record<string, unknown> | null

  /**
   * The locations of the sales channel.
   */
  locations?: SalesChannelLocationDTO[]
}

/**
 * The filters to apply on the retrieved sales channel.
 */
export interface FilterableSalesChannelProps
  extends BaseFilterable<FilterableSalesChannelProps> {
  /**
   * Find sales channels by their name or description through this search term.
   */
  q?: string

  /**
   * The IDs to filter the sales channel by.
   */
  id?: string | string[]

  /**
   * Filter sales channels by their names.
   */
  name?: string | string[]

  /**
   * Filter sales channels by whether they're disabled.
   */
  is_disabled?: boolean
}
