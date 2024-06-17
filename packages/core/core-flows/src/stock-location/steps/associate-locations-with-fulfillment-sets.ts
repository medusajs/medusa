import { Modules } from "@medusajs/modules-sdk"
import { ContainerRegistrationKeys } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

interface StepInput {
  input: {
    location_id: string
    fulfillment_set_ids: string[]
  }[]
}

export const associateFulfillmentSetsWithLocationStepId =
  "associate-fulfillment-sets-with-location-step"
export const associateFulfillmentSetsWithLocationStep = createStep(
  associateFulfillmentSetsWithLocationStepId,
  async (data: StepInput, { container }) => {
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
