import { ModuleExports } from "@medusajs/types"

import { PaymentModuleService } from "@services"
import loadProviders from "./loaders/providers"

const moduleDefinition: ModuleExports = {
  service: PaymentModuleService,
  loaders: [loadProviders],
}

export default moduleDefinition

export { PaymentModuleOptions } from "./types"
