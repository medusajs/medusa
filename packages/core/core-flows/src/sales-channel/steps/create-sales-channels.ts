import {
  CreateSalesChannelDTO,
  ISalesChannelModuleService,
} from "@zjedene-medusa/framework/types"
import { Modules } from "@zjedene-medusa/framework/utils"
import { StepResponse, createStep } from "@zjedene-medusa/framework/workflows-sdk"

/**
 * The data to create sales channels.
 */
export interface CreateSalesChannelsStepInput {
  /**
   * The sales channels to create.
   */
  data: CreateSalesChannelDTO[]
}

export const createSalesChannelsStepId = "create-sales-channels"
/**
 * This step creates one or more sales channels.
 * 
 * @example
 * const data = createSalesChannelsStep({
 *   data: [{
 *     name: "Webshop",
 *   }]
 * })
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
