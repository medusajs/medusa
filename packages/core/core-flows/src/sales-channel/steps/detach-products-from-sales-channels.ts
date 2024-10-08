import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"

export interface DetachProductsFromSalesChannelsStepInput {
  links: {
    sales_channel_id: string
    product_id: string
  }[]
}

export const detachProductsFromSalesChannelsStepId =
  "detach-products-from-sales-channels-step"
/**
 * This step dismisses links between product and sales channel records.
 */
export const detachProductsFromSalesChannelsStep = createStep(
  detachProductsFromSalesChannelsStepId,
  async (input: DetachProductsFromSalesChannelsStepInput, { container }) => {
    if (!input.links?.length) {
      return new StepResponse(void 0, [])
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
