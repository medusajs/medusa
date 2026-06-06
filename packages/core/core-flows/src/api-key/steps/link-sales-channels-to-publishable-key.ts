import type { LinkWorkflowInput } from "@zjedene-medusa/framework/types"
import {
  ContainerRegistrationKeys,
  Modules,
  promiseAll,
} from "@zjedene-medusa/framework/utils"
import { StepResponse, createStep } from "@zjedene-medusa/framework/workflows-sdk"

/**
 * The data to manage the sales channels of a publishable API key.
 *
 * @property id - The ID of the publishable API key.
 * @property add - The sales channel IDs to add to the publishable API key.
 * @property remove - The sales channel IDs to remove from the publishable API key.
 */
export type LinkSalesChannelsToApiKeyStepInput = LinkWorkflowInput

export const linkSalesChannelsToApiKeyStepId = "link-sales-channels-to-api-key"
/**
 * This step manages the sales channels of a publishable API key.
 *
 * @example
 * const data = linkSalesChannelsToApiKeyStep({
 *   id: "apk_123",
 *   add: ["sc_123"],
 *   remove: ["sc_456"]
 * })
 */
export const linkSalesChannelsToApiKeyStep = createStep(
  linkSalesChannelsToApiKeyStepId,
  async (input: LinkSalesChannelsToApiKeyStepInput, { container }) => {
    const remoteLink = container.resolve(ContainerRegistrationKeys.LINK)
    if (!input || (!input.add?.length && !input.remove?.length)) {
      return
    }

    const linksToCreate = (input.add ?? []).map((salesChannelId) => {
      return {
        [Modules.API_KEY]: {
          publishable_key_id: input.id,
        },
        [Modules.SALES_CHANNEL]: {
          sales_channel_id: salesChannelId,
        },
      }
    })

    const linksToDismiss = (input.remove ?? []).map((salesChannelId) => {
      return {
        [Modules.API_KEY]: {
          publishable_key_id: input.id,
        },
        [Modules.SALES_CHANNEL]: {
          sales_channel_id: salesChannelId,
        },
      }
    })

    const promises: Promise<any>[] = []
    if (linksToCreate.length) {
      promises.push(remoteLink.create(linksToCreate))
    }
    if (linksToDismiss.length) {
      promises.push(remoteLink.dismiss(linksToDismiss))
    }
    await promiseAll(promises)

    return new StepResponse(void 0, { linksToCreate, linksToDismiss })
  },
  async (prevData, { container }) => {
    if (!prevData) {
      return
    }

    const remoteLink = container.resolve(ContainerRegistrationKeys.LINK)
    if (prevData.linksToCreate.length) {
      await remoteLink.dismiss(prevData.linksToCreate)
    }

    if (prevData.linksToDismiss.length) {
      await remoteLink.create(prevData.linksToDismiss)
    }
  }
)
