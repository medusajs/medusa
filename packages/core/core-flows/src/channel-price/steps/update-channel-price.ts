import { IChannelPriceModuleService } from "@medusajs/framework/types"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"
import { Modules } from "@medusajs/framework/utils"

export const updateChannelPriceStep = createStep(
  "update-channel-price",
  async (input: { id: string; [key: string]: unknown }, { container }) => {
    const channelPriceModule = container.resolve<IChannelPriceModuleService>(
      Modules.CHANNEL_PRICE
    )
    const channelPrice = await channelPriceModule.updateChannelPrices(
      input.id,
      input
    )
    return new StepResponse(channelPrice, channelPrice)
  },
  async (originalChannelPrice, { container }) => {
    if (!originalChannelPrice) return
    const channelPriceModule = container.resolve<IChannelPriceModuleService>(
      Modules.CHANNEL_PRICE
    )
    await channelPriceModule.updateChannelPrices(
      originalChannelPrice.id,
      originalChannelPrice
    )
  }
)
