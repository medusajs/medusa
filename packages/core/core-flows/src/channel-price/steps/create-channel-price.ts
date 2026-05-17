import { IChannelPriceModuleService } from "@medusajs/framework/types"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"
import { Modules } from "@medusajs/framework/utils"

export const createChannelPriceStep = createStep(
  "create-channel-price",
  async (
    input: {
      sales_material_id: string
      price_type: string
      amount: number
      [key: string]: unknown
    },
    { container }
  ) => {
    const channelPriceModule = container.resolve<IChannelPriceModuleService>(
      Modules.CHANNEL_PRICE
    )
    const channelPrice = await channelPriceModule.createChannelPrices(input)
    return new StepResponse(channelPrice, channelPrice.id)
  },
  async (channelPriceId, { container }) => {
    if (!channelPriceId) return
    const channelPriceModule = container.resolve<IChannelPriceModuleService>(
      Modules.CHANNEL_PRICE
    )
    await channelPriceModule.deleteChannelPrices(channelPriceId)
  }
)
