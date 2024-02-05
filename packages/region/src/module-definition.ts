import { ModuleExports } from "@medusajs/types"
import { RegionModuleService } from "@services"

import loadConnection from "./loaders/connection"
import loadContainer from "./loaders/container"

const service = RegionModuleService
const loaders = [loadContainer, loadConnection] as any

export const moduleDefinition: ModuleExports = {
  service,
  loaders,
}
