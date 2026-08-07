import "./types"

import { Module, Modules } from "@medusajs/framework/utils"
import { SearchModuleService } from "@services"
import providersLoader from "./loaders/providers"

export default Module(Modules.SEARCH, {
  service: SearchModuleService,
  loaders: [providersLoader],
})
