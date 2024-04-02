import * as StockLocationModels from "@models"
import * as StockLocationRepostiories from "@repositories"
import * as StockLocationServices from "@services"

import { Modules } from "@medusajs/modules-sdk"
import { ModuleExports } from "@medusajs/types"
import { ModulesSdkUtils } from "@medusajs/utils"
import { StockLocationModuleService } from "@services"

const migrationScriptOptions = {
  moduleName: Modules.STOCK_LOCATION,
  models: StockLocationModels,
  pathToMigrations: __dirname + "/migrations",
}

const runMigrations = ModulesSdkUtils.buildMigrationScript(
  migrationScriptOptions
)

const revertMigration = ModulesSdkUtils.buildRevertMigrationScript(
  migrationScriptOptions
)

const containerLoader = ModulesSdkUtils.moduleContainerLoaderFactory({
  moduleModels: StockLocationModels,
  moduleRepositories: StockLocationRepostiories,
  moduleServices: StockLocationServices,
})

const connectionLoader = ModulesSdkUtils.mikroOrmConnectionLoaderFactory({
  moduleName: Modules.STOCK_LOCATION,
  moduleModels: Object.values(StockLocationModels),
  migrationsPath: __dirname + "/migrations",
})

const service = StockLocationModuleService
const loaders = [containerLoader, connectionLoader]

export const moduleDefinition: ModuleExports = {
  service,
  loaders,
  revertMigration,
  runMigrations,
}
