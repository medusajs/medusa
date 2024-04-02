import { Modules, RemoteLink } from "@medusajs/modules-sdk"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

import { ContainerRegistrationKeys } from "@medusajs/utils"

export const removeLocationsFromSalesChannelStepId =
  "remove-locations-from-sales-channel"
export const removeLocationsFromSalesChannelStep = createStep(
  removeLocationsFromSalesChannelStepId,
  async (
    data: {
      sales_channel_id: string
      location_ids: string[]
    }[],
    { container }
  ) => {
    const remoteLink = container.resolve<RemoteLink>(
      ContainerRegistrationKeys.REMOTE_LINK
    )

    const linkModule = remoteLink.getLinkModule(
      Modules.SALES_CHANNEL,
      "sales_channel_id",
      Modules.STOCK_LOCATION,
      "stock_location_id"
    )

    if (!linkModule) {
      return new StepResponse([], [])
    }

    const links = data
      .map((d) =>
        d.location_ids.map((locId) => ({
          sales_channel_id: d.sales_channel_id,
          stock_location_id: locId,
        }))
      )
      .flat()

    await linkModule.softDelete(links)

    return new StepResponse(void 0, links)
  },
  async (links, { container }) => {
    if (!links?.length) {
      return
    }

    const remoteLink = container.resolve<RemoteLink>(
      ContainerRegistrationKeys.REMOTE_LINK
    )

    const linkModule = remoteLink.getLinkModule(
      Modules.SALES_CHANNEL,
      "sales_channel_id",
      Modules.STOCK_LOCATION,
      "stock_location_id"
    )

    if (!linkModule) {
      return
    }

    await linkModule.restore(links)
  }
)
