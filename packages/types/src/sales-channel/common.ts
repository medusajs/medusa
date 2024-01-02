import { BaseFilterable } from "../dal"

export interface SalesChannelLocationDTO {
  sales_channel_id: string
  location_id: string
  sales_channel: SalesChannelDTO
}

export interface SalesChannelDTO {
  id: string
  name: string
  description: string | null
  is_disabled: boolean
  metadata: Record<string, unknown> | null
  locations?: SalesChannelLocationDTO[]
}

export type CreateSalesChannelDTO = {
  name: string
  description: string
  is_disabled?: boolean
}

export type UpdateSalesChannelDTO = {
  id: string
  name?: string
  description?: string
  is_disabled?: boolean
}

export interface FilterableSalesChannelProps
  extends BaseFilterable<FilterableSalesChannelProps> {
  id?: string[]
  name?: string[]
  is_disabled?: boolean
}
