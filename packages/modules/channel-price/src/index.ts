// packages/modules/channel-price/src/index.ts
import { Module, Modules } from "@medusajs/framework/utils"
import { ChannelPriceModuleService } from "./services/channel-price-module-service"

export default Module(Modules.CHANNEL_PRICE, {
  service: ChannelPriceModuleService,
})
