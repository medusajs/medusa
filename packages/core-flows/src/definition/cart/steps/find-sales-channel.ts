import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { ISalesChannelModuleService, SalesChannelDTO } from "@medusajs/types"
import { MedusaError } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

interface StepInput {
  salesChannelId?: string | null
}

export const findSalesChannelStepId = "find-sales-channel"
export const findSalesChannelStep = createStep(
  findSalesChannelStepId,
  async (data: StepInput, { container }) => {
    const salesChannelService = container.resolve<ISalesChannelModuleService>(
      ModuleRegistrationName.SALES_CHANNEL
    )

    if (data.salesChannelId === null) {
      return new StepResponse(null)
    }

    let salesChannel: SalesChannelDTO | undefined
    if (data.salesChannelId) {
      salesChannel = await salesChannelService.retrieve(data.salesChannelId)
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
