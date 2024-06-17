import { ModuleExports } from "@medusajs/types"
import { FulfillmentModuleService } from "@services"
import loadProviders from "./loaders/providers"

const service = FulfillmentModuleService
const loaders = [loadProviders]

export const moduleDefinition: ModuleExports = {
  service,
  loaders,
}
export default moduleDefinition

// Module options types
export { FulfillmentModuleOptions } from "./types"
