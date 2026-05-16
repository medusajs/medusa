import { Module, Modules } from "@medusajs/framework/utils"
import { ShopModuleService } from "./services/shop-module-service"

export default Module(Modules.SHOP, {
  service: ShopModuleService,
})
