import { ModuleExports } from "@medusajs/types"
import { RegionModuleService } from "@services"

import loadConnection from "./loaders/connection"
import loadContainer from "./loaders/container"
import loadDefaults from "./loaders/defaults"

const service = RegionModuleService
const loaders = [loadContainer, loadConnection, loadDefaults] as any

export const moduleDefinition: ModuleExports = {
  service,
  loaders,
}
