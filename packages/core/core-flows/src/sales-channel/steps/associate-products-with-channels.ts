import { ContainerRegistrationKeys, Modules } from "@zjedene-medusa/framework/utils"
import { createStep, StepResponse } from "@zjedene-medusa/framework/workflows-sdk"

/**
 * The data to associate products with sales channels.
 */
export interface AssociateProductsWithSalesChannelsStepInput {
  /**
   * The links to create between products and sales channels.
   */
  links: {
    /**
     * The ID of the sales channel.
     */
    sales_channel_id: string
    /**
     * The ID of the product.
     */
    product_id: string
  }[]
}

export const associateProductsWithSalesChannelsStepId =
  "associate-products-with-channels"
/**
 * This step creates links between products and sales channel records.
 * 
 * @example
 * const data = associateProductsWithSalesChannelsStep({
 *   links: [
 *     {
 *       sales_channel_id: "sc_123",
 *       product_id: "prod_123"
 *     }
 *   ]
 * })
 */
export const associateProductsWithSalesChannelsStep = createStep(
  associateProductsWithSalesChannelsStepId,
  async (input: AssociateProductsWithSalesChannelsStepInput, { container }) => {
    if (!input.links?.length) {
      return new StepResponse([], [])
    }

    const remoteLink = container.resolve(ContainerRegistrationKeys.LINK)
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

    const remoteLink = container.resolve(ContainerRegistrationKeys.LINK)

    await remoteLink.dismiss(links)
  }
)
