import { SalesChannel } from "../models"

export type CreateSalesChannelInput = {
  name: string
  description?: string
  is_disabled?: boolean
}

export type UpdateSalesChannelInput = Partial<CreateSalesChannelInput>

export type ListSalesChannelInput = Partial<SalesChannel> & {
  q?: string
}
