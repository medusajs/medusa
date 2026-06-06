import type { ISalesChannelModuleService } from "@zjedene-medusa/framework/types"
import { Modules } from "@zjedene-medusa/framework/utils"
import { StepResponse, createStep } from "@zjedene-medusa/framework/workflows-sdk"

/**
 * The IDs of the sales channels to delete.
 */
export type DeleteSalesChannelsStepInput = string[]

export const deleteSalesChannelsStepId = "delete-sales-channels"
/**
 * This step deletes one or more sales channels.
 */
export const deleteSalesChannelsStep = createStep(
  deleteSalesChannelsStepId,
  async (ids: DeleteSalesChannelsStepInput, { container }) => {
    const service = container.resolve<ISalesChannelModuleService>(
      Modules.SALES_CHANNEL
    )

    await service.softDeleteSalesChannels(ids)

    return new StepResponse(void 0, ids)
  },
  async (prevSalesChannelIds, { container }) => {
    if (!prevSalesChannelIds?.length) {
      return
    }

    const service = container.resolve<ISalesChannelModuleService>(
      Modules.SALES_CHANNEL
    )

    await service.restoreSalesChannels(prevSalesChannelIds)
  }
)
