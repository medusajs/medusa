import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import {
  CreateSalesChannelDTO,
  ISalesChannelModuleService,
} from "@medusajs/types"
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

    let [salesChannel] = await salesChannelService.list()

    if (!salesChannel) {
      salesChannel = await salesChannelService.create(input.data)
    }

    return new StepResponse(salesChannel, salesChannel.id)
  },
  async (createdId, { container }) => {
    if (!createdId) {
      return
    }

    const service = container.resolve<ISalesChannelModuleService>(
      ModuleRegistrationName.SALES_CHANNEL
    )

    await service.delete(createdId)
  }
)
