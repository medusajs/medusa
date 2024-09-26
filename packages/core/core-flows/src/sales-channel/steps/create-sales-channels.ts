import {
  CreateSalesChannelDTO,
  ISalesChannelModuleService,
} from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

export interface CreateSalesChannelsStepInput {
  data: CreateSalesChannelDTO[]
}

export const createSalesChannelsStepId = "create-sales-channels"
/**
 * This step creates one or more sales channels.
 */
export const createSalesChannelsStep = createStep(
  createSalesChannelsStepId,
  async (input: CreateSalesChannelsStepInput, { container }) => {
    const salesChannelService = container.resolve<ISalesChannelModuleService>(
      Modules.SALES_CHANNEL
    )

    const salesChannels = await salesChannelService.createSalesChannels(
      input.data
    )

    return new StepResponse(
      salesChannels,
      salesChannels.map((s) => s.id)
    )
  },
  async (createdIds, { container }) => {
    if (!createdIds) {
      return
    }

    const service = container.resolve<ISalesChannelModuleService>(
      Modules.SALES_CHANNEL
    )

    await service.deleteSalesChannels(createdIds)
  }
)
