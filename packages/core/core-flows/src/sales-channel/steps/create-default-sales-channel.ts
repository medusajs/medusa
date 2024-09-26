import {
  CreateSalesChannelDTO,
  ISalesChannelModuleService,
} from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

export interface CreateDefaultSalesChannelStepInput {
  data: CreateSalesChannelDTO
}

export const createDefaultSalesChannelStepId = "create-default-sales-channel"
/**
 * This step creates a default sales channel.
 */
export const createDefaultSalesChannelStep = createStep(
  createDefaultSalesChannelStepId,
  async (input: CreateDefaultSalesChannelStepInput, { container }) => {
    const salesChannelService = container.resolve<ISalesChannelModuleService>(
      Modules.SALES_CHANNEL
    )

    if (!salesChannelService) {
      return new StepResponse(void 0)
    }

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
      Modules.SALES_CHANNEL
    )

    await service.deleteSalesChannels(data.id)
  }
)
