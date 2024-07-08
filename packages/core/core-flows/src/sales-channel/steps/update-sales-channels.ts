import {
  FilterableSalesChannelProps,
  ISalesChannelModuleService,
  UpdateSalesChannelDTO,
} from "@medusajs/types"
import {
  ModuleRegistrationName,
  getSelectsAndRelationsFromObjectArray,
} from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

type UpdateSalesChannelsStepInput = {
  selector: FilterableSalesChannelProps
  update: UpdateSalesChannelDTO
}

export const updateSalesChannelsStepId = "update-sales-channels"
export const updateSalesChannelsStep = createStep(
  updateSalesChannelsStepId,
  async (data: UpdateSalesChannelsStepInput, { container }) => {
    const service = container.resolve<ISalesChannelModuleService>(
      ModuleRegistrationName.SALES_CHANNEL
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
      ModuleRegistrationName.SALES_CHANNEL
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
