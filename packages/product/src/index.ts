import loadConnection from "./loaders/connection"
import loadContainer from "./loaders/container"

import migrations from "./migrations"
import { revertMigration, runMigrations } from "./migrations/run-migration"
import * as ProductModels from "./model"
import ProductService from "./services/product"

import { ModuleExports } from "@medusajs/modules-sdk"

const service = ProductService
const loaders = [loadContainer, loadConnection]
const models = Object.values(ProductModels)

const moduleDefinition: ModuleExports = {
  service,
  migrations,
  loaders,
  models,
  runMigrations,
  revertMigration,
}

export default moduleDefinition
export * from "./initialize"
export { revertMigration, runMigrations } from "./migrations/run-migration"
export * from "./types"
