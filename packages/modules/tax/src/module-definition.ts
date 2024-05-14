import { ModuleExports } from "@medusajs/types"
import { TaxModuleService } from "@services"
import loadProviders from "./loaders/providers"

const service = TaxModuleService
const loaders = [loadProviders]

export const moduleDefinition: ModuleExports = {
  service,
  loaders,
}
