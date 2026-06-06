import {
  CreateSalesChannelDTO,
  ISalesChannelModuleService,
} from "@zjedene-medusa/framework/types"
import { Modules } from "@zjedene-medusa/framework/utils"
import { StepResponse, createStep } from "@zjedene-medusa/framework/workflows-sdk"

/**
 * The data to create a default sales channel.
 */
export interface CreateDefaultSalesChannelStepInput {
  /**
   * The default sales channel data.
   */
  data: CreateSalesChannelDTO
}

export const createDefaultSalesChannelStepId = "create-default-sales-channel"
/**
 * This step creates a default sales channel if none exist in the application. 
 * This is useful when creating seed scripts.
 * 
 * @example
 * const data = createDefaultSalesChannelStep({
 *   data: {
 *     name: "Webshop",
 *   }
 * })
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
