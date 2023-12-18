import { Context } from "@medusajs/types"
import { SalesChannel } from "@models"

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

export interface SalesChannelRepositoryService {
  retrieve(id: string): Promise<SalesChannel>
  retrieveByName(context: Context): Promise<SalesChannel>
}
