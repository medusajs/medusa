import {
  FilterableSalesChannelProps,
  ISalesChannelModuleService,
  UpdateSalesChannelDTO,
} from "@medusajs/framework/types"
import {
  Modules,
  getSelectsAndRelationsFromObjectArray,
} from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

export type UpdateSalesChannelsStepInput = {
  selector: FilterableSalesChannelProps
  update: UpdateSalesChannelDTO
}

export const updateSalesChannelsStepId = "update-sales-channels"
/**
 * This step updates sales channels matching the specified filters.
 */
export const updateSalesChannelsStep = createStep(
  updateSalesChannelsStepId,
  async (data: UpdateSalesChannelsStepInput, { container }) => {
    const service = container.resolve<ISalesChannelModuleService>(
      Modules.SALES_CHANNEL
    )

    const { selects, relations } = getSelectsAndRelationsFromObjectArray([
      data.update,
    ])

    const prevData = await service.listSalesChannels(data.selector, {
      select: selects,
      relations,
    })

    const channels = await service.updateSalesChannels(
      data.selector,
      data.update
    )

    return new StepResponse(channels, prevData)
  },
  async (prevData, { container }) => {
    if (!prevData?.length) {
      return
    }

    const service = container.resolve<ISalesChannelModuleService>(
      Modules.SALES_CHANNEL
    )

    await service.upsertSalesChannels(
      prevData.map((r) => ({
        id: r.id,
        name: r.name,
        description: r.description,
        is_disabled: r.is_disabled,
        metadata: r.metadata,
      }))
    )
  }
)
