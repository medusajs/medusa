import "./types"
import { PaymentModuleService } from "@services"
import loadProviders from "./loaders/providers"
import { Module, Modules } from "@zjedene-medusa/framework/utils"

export default Module(Modules.PAYMENT, {
  service: PaymentModuleService,
  loaders: [loadProviders],
})

export { PaymentModuleOptions } from "./types"
