import { Modules } from "@medusajs/modules-sdk"
import { ContainerRegistrationKeys } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

interface StepInput {
  links: {
    sales_channel_id: string
    product_ids: string[]
  }[]
}

export const associateProductsWithSalesChannelsStepId =
  "associate-products-with-channels"
export const associateProductsWithSalesChannelsStep = createStep(
  associateProductsWithSalesChannelsStepId,
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
