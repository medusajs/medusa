import { Module, Modules } from "@medusajs/utils"
import { SalesChannelModuleService } from "@services"

export default Module(Modules.SALES_CHANNEL, {
  service: SalesChannelModuleService,
})
