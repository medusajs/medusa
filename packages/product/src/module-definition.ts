import * as ProductModels from "@models"

import { ModuleExports } from "@medusajs/types"
import { ProductModuleService } from "@services"
import loadConnection from "./loaders/connection"
import loadContainer from "./loaders/container"

const service = ProductModuleService
const loaders = [loadContainer, loadConnection] as any
const models = Object.values(ProductModels)

export const moduleDefinition: ModuleExports = {
  service,
  loaders,
  models,
}
