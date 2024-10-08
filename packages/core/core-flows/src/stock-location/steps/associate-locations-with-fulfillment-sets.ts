import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"

export interface AssociateFulfillmentSetsWithLocationStepInput {
  input: {
    location_id: string
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

    const remoteLink = container.resolve(ContainerRegistrationKeys.REMOTE_LINK)

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

    const remoteLink = container.resolve(ContainerRegistrationKeys.REMOTE_LINK)

    await remoteLink.dismiss(links)
  }
)
