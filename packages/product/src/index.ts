import loadConnection from "./loaders/connection"
import loadContainer from "./loaders/container"

// import migrations from "./migrations"
// import { revertMigration, runMigrations } from "./migrations/run-migration"
import * as ProductModels from "@models"

import { ModuleExports } from "@medusajs/modules-sdk"
import { GatewayService } from "@services"

const service = GatewayService
const loaders = [loadContainer, loadConnection] as any
const models = Object.values(ProductModels)

const moduleDefinition: ModuleExports = {
  service,
  // migrations,
  loaders,
  models,
  // runMigrations,
  // revertMigration,
}

export default moduleDefinition
export * from "./initialize"
// export { revertMigration, runMigrations } from "./migrations/run-migration"
export * from "./types"
