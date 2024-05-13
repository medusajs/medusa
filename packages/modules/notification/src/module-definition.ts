import { ModuleExports } from "@medusajs/types"
import * as ModuleServices from "@services"
import { NotificationModuleService } from "@services"
import { Modules } from "@medusajs/modules-sdk"
import * as ModuleModels from "@models"
import { ModulesSdkUtils } from "@medusajs/utils"
import * as ModuleRepositories from "@repositories"
import loadProviders from "./loaders/providers"

const migrationScriptOptions = {
  moduleName: Modules.NOTIFICATION,
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
  moduleName: Modules.NOTIFICATION,
  moduleModels: Object.values(ModuleModels),
  migrationsPath: __dirname + "/migrations",
})

const service = NotificationModuleService
const loaders = [containerLoader, connectionLoader, loadProviders]

export const moduleDefinition: ModuleExports = {
  service,
  loaders,
  revertMigration,
  runMigrations,
}
