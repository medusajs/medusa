import { Modules } from "@medusajs/modules-sdk"
import { ContainerRegistrationKeys } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

type StepInput = {
  ids: string[]
}

export const getProductSalesChannelLinkStepId = "get-product-sales-channel-link"
export const getProductSalesChannelLinkStep = createStep(
  getProductSalesChannelLinkStepId,
  async (data: StepInput, { container }) => {
    if (!data.ids.length) {
      return new StepResponse([])
    }

    const remoteLink = container.resolve(ContainerRegistrationKeys.REMOTE_LINK)

    const linkService = remoteLink.getLinkModule(
      Modules.PRODUCT,
      "product_id",
      Modules.SALES_CHANNEL,
      "sales_channel_id"
    )

    const existingItems = (await linkService.list(
      { product_id: data.ids },
      { select: ["product_id", "sales_channel_id"] }
    )) as { product_id: string; sales_channel_id: string }[]

    return new StepResponse(existingItems)
  }
)
