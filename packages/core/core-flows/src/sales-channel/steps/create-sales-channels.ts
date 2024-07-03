import {
  CreateSalesChannelDTO,
  ISalesChannelModuleService,
} from "@medusajs/types"
import { ModuleRegistrationName } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

interface StepInput {
  data: CreateSalesChannelDTO[]
}

export const createSalesChannelsStepId = "create-sales-channels"
export const createSalesChannelsStep = createStep(
  createSalesChannelsStepId,
  async (input: StepInput, { container }) => {
    const salesChannelService = container.resolve<ISalesChannelModuleService>(
      ModuleRegistrationName.SALES_CHANNEL
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
      ModuleRegistrationName.SALES_CHANNEL
    )

    await service.deleteSalesChannels(createdIds)
  }
)
