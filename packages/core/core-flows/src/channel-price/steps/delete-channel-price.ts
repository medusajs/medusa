import { IChannelPriceModuleService } from "@medusajs/framework/types"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"
import { Modules } from "@medusajs/framework/utils"

export const deleteChannelPriceStep = createStep(
  "delete-channel-price",
  async (input: { id: string }, { container }) => {
    const channelPriceModule = container.resolve<IChannelPriceModuleService>(
      Modules.CHANNEL_PRICE
    )
    const channelPrice = await channelPriceModule.retrieveChannelPrice(input.id)
    await channelPriceModule.deleteChannelPrices(input.id)
    return new StepResponse(void 0, channelPrice)
  },
  async (channelPrice, { container }) => {
    if (!channelPrice) return
    const channelPriceModule = container.resolve<IChannelPriceModuleService>(
      Modules.CHANNEL_PRICE
    )
    await channelPriceModule.createChannelPrices(channelPrice)
  }
)
