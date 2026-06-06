import { createStep, StepResponse } from "@zjedene-medusa/framework/workflows-sdk"

import { ContainerRegistrationKeys, Modules } from "@zjedene-medusa/framework/utils"

/**
 * The data to associate locations with sales channels.
 */
export interface AssociateLocationsWithSalesChannelsStepInput {
  /**
   * The links to create between locations and sales channels.
   */
  links: {
    /**
     * The ID of the sales channel.
     */
    sales_channel_id: string
    /**
     * The ID of the location.
     */
    location_id: string
  }[]
}

export const associateLocationsWithSalesChannelsStepId =
  "associate-locations-with-sales-channels-step"
/**
 * This step creates links between stock locations and sales channel records.
 * 
 * @example
 * const data = associateLocationsWithSalesChannelsStep({
 *   links: [
 *     {
 *       sales_channel_id: "sc_123",
 *       location_id: "sloc_123"
 *     }
 *   ]
 * })
 */
export const associateLocationsWithSalesChannelsStep = createStep(
  associateLocationsWithSalesChannelsStepId,
  async (data: AssociateLocationsWithSalesChannelsStepInput, { container }) => {
    if (!data.links?.length) {
      return new StepResponse([], [])
    }

    const remoteLink = container.resolve(ContainerRegistrationKeys.LINK)
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

    const remoteLink = container.resolve(ContainerRegistrationKeys.LINK)
    await remoteLink.dismiss(links)
  }
)
