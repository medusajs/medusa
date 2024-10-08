import { CartModuleService } from "./services"
import { Module, Modules } from "@medusajs/framework/utils"

export default Module(Modules.CART, {
  service: CartModuleService,
})
