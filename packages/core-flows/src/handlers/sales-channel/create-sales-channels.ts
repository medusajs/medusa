import { createStep, StepResponse } from "@medusajs/workflows-sdk"
import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import {
  CreateSalesChannelDTO,
  ISalesChannelModuleService,
  SalesChannelDTO,
} from "@medusajs/types"

export const createSalesChannelsStep = createStep<
  CreateSalesChannelDTO[],
  SalesChannelDTO[],
  string[]
>(
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
    const salesChannelService: ISalesChannelModuleService = container.resolve(
      ModuleRegistrationName.SALES_CHANNEL
    )

    if (createdChannelsIds?.length) {
      await salesChannelService!.delete(createdChannelsIds)
    }
  }
)
