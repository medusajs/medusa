import { Modules } from "@medusajs/modules-sdk"
import { LinkWorkflowInput } from "@medusajs/types/src"
import { ContainerRegistrationKeys, promiseAll } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

export const linkSalesChannelsToApiKeyStepId = "link-sales-channels-to-api-key"
export const linkSalesChannelsToApiKeyStep = createStep(
  linkSalesChannelsToApiKeyStepId,
  async (input: LinkWorkflowInput, { container }) => {
    const remoteLink = container.resolve(ContainerRegistrationKeys.REMOTE_LINK)
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

    const remoteLink = container.resolve(ContainerRegistrationKeys.REMOTE_LINK)
    if (prevData.linksToCreate.length) {
      await remoteLink.dismiss(prevData.linksToCreate)
    }

    if (prevData.linksToDismiss.length) {
      await remoteLink.create(prevData.linksToDismiss)
    }
  }
)
