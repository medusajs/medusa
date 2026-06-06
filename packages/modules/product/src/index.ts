import { Module, Modules } from "@zjedene-medusa/framework/utils"
import { ProductModuleService } from "@services"

export default Module(Modules.PRODUCT, {
  service: ProductModuleService,
})
