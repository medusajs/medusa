import { ModuleExports } from "@medusajs/types"
import * as ModuleServices from "@services"
import { FulfillmentModuleService } from "@services"
import { Modules } from "@medusajs/modules-sdk"
import * as ModuleModels from "@models"
import { ModulesSdkUtils } from "@medusajs/utils"
import * as ModuleRepositories from "@repositories"
import loadProviders from "./loaders/providers"

const migrationScriptOptions = {
  moduleName: Modules.FULFILLMENT,
  models: ModuleModels,
  pathToMigrations: __dirname + "/migrations",
}

const runMigrations = ModulesSdkUtils.buildMigrationScript(
  migrationScriptOptions
)

const revertMigration = ModulesSdkUtils.buildRevertMigrationScript(
  migrationScriptOptions
)

const containerLoader = ModulesSdkUtils.moduleContainerLoaderFactory({
  moduleModels: ModuleModels,
  moduleRepositories: ModuleRepositories,
  moduleServices: ModuleServices,
})

const connectionLoader = ModulesSdkUtils.mikroOrmConnectionLoaderFactory({
  moduleName: Modules.FULFILLMENT,
  moduleModels: Object.values(ModuleModels),
  migrationsPath: __dirname + "/migrations",
})

const service = FulfillmentModuleService
const loaders = [containerLoader, connectionLoader, loadProviders]

export const moduleDefinition: ModuleExports = {
  service,
  loaders,
  revertMigration,
  runMigrations,
}
