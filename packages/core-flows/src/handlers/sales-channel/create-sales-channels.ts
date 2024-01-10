import { createStep, StepResponse } from "@medusajs/workflows-sdk"
import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import {
  CreateSalesChannelDTO,
  ISalesChannelModuleService,
} from "@medusajs/types"

export const createSalesChannelsStep = createStep(
  "create-sales-channels",
  async (data: CreateSalesChannelDTO[], { container }) => {
    const salesChannelService: ISalesChannelModuleService = container.resolve(
      ModuleRegistrationName.SALES_CHANNEL
    )

    const createdChannels = await salesChannelService!.create(data)
    return new StepResponse(
      createdChannels,
      createdChannels.map((channel) => channel.id)
    )
  },
  async (createdChannelsIds, { container }) => {
    if (!createdChannelsIds?.length) return

    const salesChannelService: ISalesChannelModuleService = container.resolve(
      ModuleRegistrationName.SALES_CHANNEL
    )

    await salesChannelService!.delete(createdChannelsIds)
  }
)
