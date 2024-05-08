import { LinkModuleUtils, Modules } from "@medusajs/modules-sdk"
import { ContainerRegistrationKeys } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

type StepInput = {
  product_id: string
  sales_channel_ids: string[]
}[]

export const setProductsSalesChannelsStepId = "set-products-sales-channels"
/**
 * Set sales channels associated with a product which includes removing old links as well.
 */
export const setProductsSalesChannelsStep = createStep(
  setProductsSalesChannelsStepId,
  async (input: StepInput, { container }) => {
    if (!input?.length) {
      return new StepResponse([], { createdLinks: [], dismissedLinks: [] })
    }

    const remoteLink = container.resolve(LinkModuleUtils.REMOTE_LINK)
    const remoteQuery = container.resolve(LinkModuleUtils.REMOTE_QUERY)

    const existingLinks = await remoteQuery({
      product_sales_channel: {
        __args: { product_id: input.map((i) => i.product_id) },
        fields: ["sales_channel_id", "product_id"],
      },
    })

    const linksToDismiss = existingLinks.map((link) => ({
      [Modules.PRODUCT]: { product_id: link.product_id },
      [Modules.SALES_CHANNEL]: { sales_channel_id: link.sales_channel_id },
    }))

    await remoteLink.dismiss(linksToDismiss)

    const linksToCreate = input
      .map((i) =>
        i.sales_channel_ids.map((sc) => {
          return {
            [Modules.PRODUCT]: {
              product_id: i.product_id,
            },
            [Modules.SALES_CHANNEL]: {
              sales_channel_id: sc,
            },
          }
        })
      )
      .flat()

    const createdLinks = await remoteLink.create(linksToCreate)

    return new StepResponse(createdLinks, {
      createdLinks: linksToCreate,
      dismissedLinks: linksToDismiss,
    })
  },
  async (links, { container }) => {
    if (!links) {
      return
    }

    const remoteLink = container.resolve(ContainerRegistrationKeys.REMOTE_LINK)

    await remoteLink.dismiss(links.createdLinks)
    await remoteLink.create(links.dismissedLinks)
  }
)
