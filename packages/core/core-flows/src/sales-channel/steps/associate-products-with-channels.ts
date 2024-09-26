import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"

export interface AssociateProductsWithSalesChannelsStepInput {
  links: {
    sales_channel_id: string
    product_id: string
  }[]
}

export const associateProductsWithSalesChannelsStepId =
  "associate-products-with-channels"
/**
 * This step creates links between products and sales channel records.
 */
export const associateProductsWithSalesChannelsStep = createStep(
  associateProductsWithSalesChannelsStepId,
  async (input: AssociateProductsWithSalesChannelsStepInput, { container }) => {
    if (!input.links?.length) {
      return new StepResponse([], [])
    }

    const remoteLink = container.resolve(ContainerRegistrationKeys.REMOTE_LINK)
    const links = input.links.map((link) => {
      return {
        [Modules.PRODUCT]: {
          product_id: link.product_id,
        },
        [Modules.SALES_CHANNEL]: {
          sales_channel_id: link.sales_channel_id,
        },
      }
    })

    const createdLinks = await remoteLink.create(links)
    return new StepResponse(createdLinks, links)
  },
  async (links, { container }) => {
    if (!links) {
      return
    }

    const remoteLink = container.resolve(ContainerRegistrationKeys.REMOTE_LINK)

    await remoteLink.dismiss(links)
  }
)
