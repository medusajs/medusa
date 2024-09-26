import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"

import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

export interface AssociateLocationsWithSalesChannelsStepInput {
  links: {
    sales_channel_id: string
    location_id: string
  }[]
}

export const associateLocationsWithSalesChannelsStepId =
  "associate-locations-with-sales-channels-step"
/**
 * This step creates links between locations and sales channel records.
 */
export const associateLocationsWithSalesChannelsStep = createStep(
  associateLocationsWithSalesChannelsStepId,
  async (data: AssociateLocationsWithSalesChannelsStepInput, { container }) => {
    if (!data.links?.length) {
      return new StepResponse([], [])
    }

    const remoteLink = container.resolve(ContainerRegistrationKeys.REMOTE_LINK)
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

    const createdLinks = await remoteLink.create(links)
    return new StepResponse(createdLinks, links)
  },
  async (links, { container }) => {
    if (!links?.length) {
      return
    }

    const remoteLink = container.resolve(ContainerRegistrationKeys.REMOTE_LINK)
    await remoteLink.dismiss(links)
  }
)
