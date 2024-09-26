import { IndexModuleService } from "@services"
import { Module, Modules } from "@medusajs/framework/utils"
import containerLoader from "./loaders/index"

export default Module(Modules.INDEX, {
  service: IndexModuleService,
  loaders: [containerLoader],
})
