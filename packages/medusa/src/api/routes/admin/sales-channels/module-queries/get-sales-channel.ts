import { MedusaContainer } from "@medusajs/types"
import { MedusaError } from "medusa-core-utils"

import { listAndCountSalesChannelsModule } from "./list-and-count-sales-channels"
import { SalesChannel } from "../../../../../models"

export async function getSalesChannelSalesChannelModule(
  id: string,
  {
    container,
  }: {
    container: MedusaContainer
  }
): Promise<SalesChannel> {
  const [channels, count] = await listAndCountSalesChannelsModule({
    filters: {
      id: [id],
    },
    container,
  })

  if (count === 0) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Sales Channel with id: ${id} was not found`
    )
  }

  return channels[0]
}
