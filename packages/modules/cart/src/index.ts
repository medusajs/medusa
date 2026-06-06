import { Module, Modules } from "@zjedene-medusa/framework/utils"
import { CartModuleService } from "./services"

export default Module(Modules.CART, {
  service: CartModuleService,
})
