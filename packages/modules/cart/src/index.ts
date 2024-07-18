import { CartModuleService } from "./services"
import { Module, Modules } from "@medusajs/utils"

export default Module(Modules.CART, {
  service: CartModuleService,
})
