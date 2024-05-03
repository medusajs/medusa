import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { ISalesChannelModuleService } from "@medusajs/types"
import { MedusaError, arrayDifference } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

interface StepInput {
  sales_channel_ids: string[]
}

export const validateSalesChannelsExistStepId = "validate-sales-channels-exist"
export const validateSalesChannelsExistStep = createStep(
  validateSalesChannelsExistStepId,
  async (data: StepInput, { container }) => {
    const salesChannelModuleService =
      container.resolve<ISalesChannelModuleService>(
        ModuleRegistrationName.SALES_CHANNEL
      )

    const salesChannels = await salesChannelModuleService.list(
      { id: data.sales_channel_ids },
      { select: ["id"] }
    )

    const salesChannelIds = salesChannels.map((v) => v.id)

    const notFound = arrayDifference(data.sales_channel_ids, salesChannelIds)

    if (notFound.length) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Sales channels with IDs ${notFound.join(", ")} do not exist`
      )
    }

    return new StepResponse(salesChannelIds)
  }
)
