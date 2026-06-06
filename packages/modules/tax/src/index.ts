import { TaxModuleService } from "@services"
import loadProviders from "./loaders/providers"
import { Module, Modules } from "@zjedene-medusa/framework/utils"

export default Module(Modules.TAX, {
  service: TaxModuleService,
  loaders: [loadProviders],
})
