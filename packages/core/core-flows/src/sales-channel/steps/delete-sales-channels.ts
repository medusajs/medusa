import { ISalesChannelModuleService } from "@medusajs/types"
import { ModuleRegistrationName } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

type DeleteSalesChannelsInput = string[]

export const deleteSalesChannelsStepId = "delete-sales-channels"
export const deleteSalesChannelsStep = createStep(
  deleteSalesChannelsStepId,
  async (ids: DeleteSalesChannelsInput, { container }) => {
    const service = container.resolve<ISalesChannelModuleService>(
      ModuleRegistrationName.SALES_CHANNEL
    )

    await service.softDeleteSalesChannels(ids)

    return new StepResponse(void 0, ids)
  },
  async (prevSalesChannelIds, { container }) => {
    if (!prevSalesChannelIds?.length) {
      return
    }

    const service = container.resolve<ISalesChannelModuleService>(
      ModuleRegistrationName.SALES_CHANNEL
    )

    await service.restoreSalesChannels(prevSalesChannelIds)
  }
)
