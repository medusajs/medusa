import {
  CreateSalesChannelDTO,
  ISalesChannelModuleService,
} from "@medusajs/types"
import { ModuleRegistrationName } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

interface StepInput {
  data: CreateSalesChannelDTO
}

export const createDefaultSalesChannelStepId = "create-default-sales-channel"
export const createDefaultSalesChannelStep = createStep(
  createDefaultSalesChannelStepId,
  async (input: StepInput, { container }) => {
    const salesChannelService = container.resolve<ISalesChannelModuleService>(
      ModuleRegistrationName.SALES_CHANNEL
    )

    let shouldDelete = false
    let [salesChannel] = await salesChannelService.listSalesChannels(
      {},
      { take: 1 }
    )

    if (!salesChannel) {
      salesChannel = await salesChannelService.createSalesChannels(input.data)

      shouldDelete = true
    }

    return new StepResponse(salesChannel, { id: salesChannel.id, shouldDelete })
  },
  async (data, { container }) => {
    if (!data?.id || !data.shouldDelete) {
      return
    }

    const service = container.resolve<ISalesChannelModuleService>(
      ModuleRegistrationName.SALES_CHANNEL
    )

    await service.deleteSalesChannels(data.id)
  }
)
