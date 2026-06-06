import { ContainerRegistrationKeys, Modules } from "@zjedene-medusa/framework/utils"
import { createStep, StepResponse } from "@zjedene-medusa/framework/workflows-sdk"

/**
 * The data to detach products from sales channels.
 */
export interface DetachProductsFromSalesChannelsStepInput {
  /**
   * The links to dismiss between products and sales channels.
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

export const detachProductsFromSalesChannelsStepId =
  "detach-products-from-sales-channels-step"
/**
 * This step dismisses links between product and sales channel records.
 * 
 * @example
 * const data = detachProductsFromSalesChannelsStep({
 *   links: [
 *     {
 *       sales_channel_id: "sc_123",
 *       product_id: "prod_123"
 *     }
 *   ]
 * })
 */
export const detachProductsFromSalesChannelsStep = createStep(
  detachProductsFromSalesChannelsStepId,
  async (input: DetachProductsFromSalesChannelsStepInput, { container }) => {
    if (!input.links?.length) {
      return new StepResponse(void 0, [])
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

    await remoteLink.dismiss(links)

    return new StepResponse(void 0, links)
  },
  async (links, { container }) => {
    if (!links?.length) {
      return
    }

    const remoteLink = container.resolve(ContainerRegistrationKeys.LINK)

    await remoteLink.create(links)
  }
)
