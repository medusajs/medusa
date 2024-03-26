import { Modules } from "@medusajs/modules-sdk"
import { ContainerRegistrationKeys } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

interface StepInput {
  links: {
    sales_channel_id: string
    product_ids: string[]
  }[]
}

export const detachProductsFromSalesChannelsStepId =
  "detach-products-from-sales-channels-step"
export const detachProductsFromSalesChannelsStep = createStep(
  detachProductsFromSalesChannelsStepId,
  async (input: StepInput, { container }) => {
    const remoteLink = container.resolve(ContainerRegistrationKeys.REMOTE_LINK)

    const links = input.links
      .map((link) => {
        return link.product_ids.map((id) => {
          return {
            [Modules.PRODUCT]: {
              product_id: id,
            },
            [Modules.SALES_CHANNEL]: {
              sales_channel_id: link.sales_channel_id,
            },
          }
        })
      })
      .flat()

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
