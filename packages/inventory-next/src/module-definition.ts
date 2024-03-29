import * as InventoryModels from "@models"
import * as InventoryRepositories from "@repositories"
import * as InventoryServices from "@services"

import InventoryService from "./services/inventory"
import { ModuleExports } from "@medusajs/types"
import { Modules } from "@medusajs/modules-sdk"
import { ModulesSdkUtils } from "@medusajs/utils"

const migrationScriptOptions = {
  moduleName: Modules.INVENTORY,
  models: InventoryModels,
  pathToMigrations: __dirname + "/migrations",
}

const runMigrations = ModulesSdkUtils.buildMigrationScript(
  migrationScriptOptions
)

const revertMigration = ModulesSdkUtils.buildRevertMigrationScript(
  migrationScriptOptions
)

const containerLoader = ModulesSdkUtils.moduleContainerLoaderFactory({
  moduleModels: InventoryModels,
  moduleRepositories: InventoryRepositories,
  moduleServices: InventoryServices,
})

const connectionLoader = ModulesSdkUtils.mikroOrmConnectionLoaderFactory({
  moduleName: Modules.INVENTORY,
  moduleModels: Object.values(InventoryModels),
  migrationsPath: __dirname + "/migrations",
})

const service = InventoryService
const loaders = [containerLoader, connectionLoader]

export const moduleDefinition: ModuleExports = {
  service,
  loaders,
  revertMigration,
  runMigrations,
}
