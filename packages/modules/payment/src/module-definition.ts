import { ModuleExports } from "@medusajs/types"

import { PaymentModuleService } from "@services"
import loadProviders from "./loaders/providers"
import loadDefaults from "./loaders/defaults"

const service = PaymentModuleService
const loaders = [loadProviders, loadDefaults] as any

export const moduleDefinition: ModuleExports = {
  service,
  loaders,
}
