import { StepResponse, createStep } from "@medusajs/workflows-sdk"

import { ContainerRegistrationKeys } from "@medusajs/utils"
import { Modules } from "@medusajs/modules-sdk"

interface StepInput {
  links: {
    order_id: string
    fulfillment_id: string
  }[]
}

export const linkOrderFulfillmentStepId = "link-order-fulfillment-step"
export const linkOrderFulfillmentStep = createStep(
  linkOrderFulfillmentStepId,
  async (data: StepInput, { container }) => {
    if (!data.links?.length) {
      return new StepResponse([], [])
    }

    const remoteLink = container.resolve(ContainerRegistrationKeys.REMOTE_LINK)
    const links = data.links.map((link) => {
      return {
        [Modules.ORDER]: {
          order_id: link.order_id,
        },
        [Modules.FULFILLMENT]: {
          fulfillment_id: link.fulfillment_id,
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
