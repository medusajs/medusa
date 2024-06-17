import { ModuleExports } from "@medusajs/types"
import { NotificationModuleService } from "@services"
import loadProviders from "./loaders/providers"

const service = NotificationModuleService
const loaders = [loadProviders]

export const moduleDefinition: ModuleExports = {
  service,
  loaders,
}
