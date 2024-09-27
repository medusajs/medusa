import { RemoteLink } from "@medusajs/framework/modules-sdk"
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"

import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

export interface DetachLocationsFromSalesChannelsStepInput {
  links: {
    sales_channel_id: string
    location_id: string
  }[]
}

export const detachLocationsFromSalesChannelsStepId =
  "detach-locations-from-sales-channels"
/**
 * This step dismisses links between location and sales channel records.
 */
export const detachLocationsFromSalesChannelsStep = createStep(
  detachLocationsFromSalesChannelsStepId,
  async (data: DetachLocationsFromSalesChannelsStepInput, { container }) => {
    if (!data.links?.length) {
      return new StepResponse([], [])
    }

    const remoteLink = container.resolve<RemoteLink>(
      ContainerRegistrationKeys.REMOTE_LINK
    )

    const links = data.links.map((link) => {
      return {
        [Modules.SALES_CHANNEL]: {
          sales_channel_id: link.sales_channel_id,
        },
        [Modules.STOCK_LOCATION]: {
          stock_location_id: link.location_id,
        },
      }
    })

    await remoteLink.dismiss(links)
    return new StepResponse(void 0, links)
  },
  async (links, { container }) => {
    if (!links?.length) {
      return
    }

    const remoteLink = container.resolve(ContainerRegistrationKeys.REMOTE_LINK)
    await remoteLink.create(links)
  }
)
