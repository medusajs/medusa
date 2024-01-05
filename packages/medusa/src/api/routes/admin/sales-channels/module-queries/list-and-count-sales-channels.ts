import { FilterablePriceListProps, MedusaContainer } from "@medusajs/types"

import { FindConfig } from "../../../../../types/common"
import { SalesChannel } from "../../../../../models"

export async function listAndCountSalesChannelsModule({
  filters,
  listConfig = { skip: 0 },
  container,
}: {
  container: MedusaContainer
  filters?: FilterablePriceListProps
  listConfig?: FindConfig<SalesChannel>
}): Promise<[SalesChannel[], number]> {
  const remoteQuery = container.resolve("remoteQuery")

  const query = {
    sales_channel: {
      __args: { filters, ...listConfig },
      // ...defaultAdminSalesChannelRemoteQueryObject,
    },
  }

  const {
    rows: salesChannels,
    metadata: { count },
  } = await remoteQuery(query)

  if (!count) {
    return [[], 0]
  }

  return [salesChannels, count]
}
