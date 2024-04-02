import { Modules } from "@medusajs/modules-sdk"
import { ContainerRegistrationKeys } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

interface StepInput {
  links: {
    api_key_id: string
    sales_channel_ids: string[]
  }[]
}

export const associateApiKeysWithSalesChannelsStepId =
  "associate-sales-channels-with-api-keys"
export const associateApiKeysWithSalesChannelsStep = createStep(
  associateApiKeysWithSalesChannelsStepId,
  async (input: StepInput, { container }) => {
    const remoteLink = container.resolve(ContainerRegistrationKeys.REMOTE_LINK)

    if (!input.links) {
      return
    }

    const links = input.links
      .map((link) => {
        return link.sales_channel_ids.map((id) => {
          return {
            [Modules.API_KEY]: {
              publishable_key_id: link.api_key_id,
            },
            [Modules.SALES_CHANNEL]: {
              sales_channel_id: id,
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
