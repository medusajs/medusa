import { Context } from "@medusajs/types"
import { SalesChannel } from "@models"

export interface SalesChannelRepositoryService {
  retrieve(id: string): Promise<SalesChannel>
  retrieveByName(context: Context): Promise<SalesChannel>
}
