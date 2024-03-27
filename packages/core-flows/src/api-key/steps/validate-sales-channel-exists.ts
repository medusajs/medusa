import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { ISalesChannelModuleService } from "@medusajs/types"
import { MedusaError } from "@medusajs/utils"
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

    const scIdsInDb = new Set(salesChannels.map((v) => v.id))

    const notFound = new Set(
      [...data.sales_channel_ids].filter((x) => !scIdsInDb.has(x))
    )

    if (notFound.size) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Sales channels with IDs ${[...notFound].join(", ")} do not exist`
      )
    }

    return new StepResponse(Array.from(salesChannels.map((v) => v.id)))
  }
)
