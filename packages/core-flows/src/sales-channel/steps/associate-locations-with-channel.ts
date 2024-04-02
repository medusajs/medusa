import { StepResponse, createStep } from "@medusajs/workflows-sdk"

import { ContainerRegistrationKeys } from "@medusajs/utils"
import { Modules } from "@medusajs/modules-sdk"

interface StepInput {
  links: {
    sales_channel_id: string
    location_ids: string[]
  }[]
}

export const associateLocationsWithChannelStepId =
  "associate-locations-with-channel-step"
export const associateLocationsWithChannelStep = createStep(
  associateLocationsWithChannelStepId,
  async (data: StepInput, { container }) => {
    if (!data.links.length) {
      return new StepResponse([], [])
    }

    const remoteLink = container.resolve(ContainerRegistrationKeys.REMOTE_LINK)

    const links = data.links
      .map((link) => {
        return link.location_ids.map((id) => {
          return {
            [Modules.SALES_CHANNEL]: {
              sales_channel_id: link.sales_channel_id,
            },
            [Modules.STOCK_LOCATION]: {
              stock_location_id: id,
            },
          }
        })
      })
      .flat()

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
