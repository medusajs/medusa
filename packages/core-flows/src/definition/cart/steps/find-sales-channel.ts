import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { ISalesChannelModuleService, SalesChannelDTO } from "@medusajs/types"
import { MedusaError } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

interface StepInput {
  salesChannelId?: string
  publishableApiKeyScopes?: {
    salesChannelIds?: string[]
  }
}

export const findSalesChannelStepId = "find-sales-channel"
export const findSalesChannelStep = createStep(
  findSalesChannelStepId,
  async (data: StepInput, { container }) => {
    const salesChannelService = container.resolve<ISalesChannelModuleService>(
      ModuleRegistrationName.SALES_CHANNEL
    )

    let { salesChannelId, publishableApiKeyScopes } = data

    // TODO: Revisit when API key module is implemented
    if (salesChannelId && publishableApiKeyScopes?.salesChannelIds?.length) {
      if (publishableApiKeyScopes.salesChannelIds.length > 1) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "The passed publishable API key has multiple associated sales channels."
        )
      }

      salesChannelId = publishableApiKeyScopes.salesChannelIds[0]
    }

    let salesChannel: SalesChannelDTO | undefined
    if (salesChannelId) {
      salesChannel = await salesChannelService.retrieve(salesChannelId)
    } else {
      // TODO: Find default sales channel from store
    }

    if (salesChannel?.is_disabled) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Unable to assign cart to disabled Sales Channel: ${salesChannel.name}`
      )
    }

    return new StepResponse(salesChannel)
  }
)
