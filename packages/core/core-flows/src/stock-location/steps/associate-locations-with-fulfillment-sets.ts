import { ContainerRegistrationKeys, Modules } from "@zjedene-medusa/framework/utils"
import { createStep, StepResponse } from "@zjedene-medusa/framework/workflows-sdk"

/**
 * The data to associate fulfillment sets with locations.
 */
export interface AssociateFulfillmentSetsWithLocationStepInput {
  /**
   * The data to associate fulfillment sets with locations.
   */
  input: {
    /**
     * The ID of the location to associate the fulfillment sets with.
     */
    location_id: string
    /**
     * The IDs of the fulfillment sets to associate with the location.
     */
    fulfillment_set_ids: string[]
  }[]
}

export const associateFulfillmentSetsWithLocationStepId =
  "associate-fulfillment-sets-with-location-step"
/**
 * This step creates links between location and fulfillment set records.
 */
export const associateFulfillmentSetsWithLocationStep = createStep(
  associateFulfillmentSetsWithLocationStepId,
  async (
    data: AssociateFulfillmentSetsWithLocationStepInput,
    { container }
  ) => {
    if (!data.input.length) {
      return new StepResponse([], [])
    }

    const remoteLink = container.resolve(ContainerRegistrationKeys.LINK)

    const links = data.input
      .map((link) => {
        return link.fulfillment_set_ids.map((id) => {
          return {
            [Modules.STOCK_LOCATION]: {
              stock_location_id: link.location_id,
            },
            [Modules.FULFILLMENT]: {
              fulfillment_set_id: id,
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

    const remoteLink = container.resolve(ContainerRegistrationKeys.LINK)

    await remoteLink.dismiss(links)
  }
)
