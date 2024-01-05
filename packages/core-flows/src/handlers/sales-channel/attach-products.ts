import { createStep } from "@medusajs/workflows-sdk"
import { Modules } from "@medusajs/modules-sdk"
import { promiseAll } from "@medusajs/utils"

type Input = { salesChannelId: string; productIds: string[] }

export const attachProductsToSalesChannelStep = createStep<Input, void, Input>(
  "attach-products-to-sales-channel",
  async (data, { container }) => {
    const { salesChannelId, productIds } = data
    const remoteLink = container.resolve("remoteLink")
    const links: any[] = []

    productIds.forEach((id) =>
      links.push({
        [Modules.PRODUCT]: {
          product_id: id,
        },
        [Modules.SALES_CHANNEL]: {
          sales_channel_id: salesChannelId,
        },
      })
    )
    await remoteLink.create(links)
  },
  async (data, { container }) => {
    if (!data) return

    const { salesChannelId, productIds } = data
    const remoteLink = container.resolve("remoteLink")

    await promiseAll(
      productIds.map((id) =>
        remoteLink.dismiss({
          [Modules.PRODUCT]: {
            product_id: id,
          },
          [Modules.SALES_CHANNEL]: {
            sales_channel_id: salesChannelId,
          },
        })
      )
    )
  }
)
