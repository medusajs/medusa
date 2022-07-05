import { Request } from "express"
import { SalesChannel } from "../models/sales-channel"

export type CreateSalesChannelInput = {
  name: string
  description?: string
  is_disabled?: boolean
}

export type UpdateSalesChannelInput = Partial<CreateSalesChannelInput>

export type SalesChannelRequest = Request & { sales_channel: SalesChannel }
