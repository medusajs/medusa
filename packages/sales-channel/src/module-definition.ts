import { ModuleExports } from "@medusajs/types"
import { SalesChannelModuleService } from "@services"

import loadConnection from "./loaders/connection"
import loadContainer from "./loaders/container"

const service = SalesChannelModuleService
const loaders = [loadContainer, loadConnection] as any

export const moduleDefinition: ModuleExports = {
  service,
  loaders,
}
