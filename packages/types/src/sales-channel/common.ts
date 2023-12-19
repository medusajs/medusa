import { BaseFilterable } from "../dal"

export interface SalesChannelLocationDTO {
  sales_channel_id: string
  location_id: string
  sales_channel: SalesChannelDTO
}

export interface SalesChannelDTO {
  id: string
  description: string | null
  is_disabled: boolean
  metadata: Record<string, unknown> | null
  locations?: SalesChannelLocationDTO[]
}

/**
 * @interface
 *
 * Filters to apply on sales channel lists.
 */
export interface FilterableSalesChannelProps
  extends BaseFilterable<FilterableSalesChannelProps> {
  id?: string[]
  name?: string[]
  is_disabled?: boolean
}
