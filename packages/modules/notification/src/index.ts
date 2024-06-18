import { ModuleExports } from "@medusajs/types"
import { NotificationModuleService } from "@services"
import loadProviders from "./loaders/providers"

export const moduleDefinition: ModuleExports = {
  service: NotificationModuleService,
  loaders: [loadProviders],
}

export default moduleDefinition
