import { ModuleExports } from "@medusajs/types"
import { RegionModuleService } from "./services"

import { Modules } from "@medusajs/modules-sdk"
import { ModulesSdkUtils } from "@medusajs/utils"
import loadDefaults from "./loaders/defaults"
import * as ModuleModels from "@models"
import * as ModuleRepositories from "@repositories"
import * as ModuleServices from "@services"

const migrationScriptOptions = {
  moduleName: Modules.REGION,
  models: ModuleModels,
  pathToMigrations: __dirname + "/migrations",
}

export const runMigrations = ModulesSdkUtils.buildMigrationScript(
  migrationScriptOptions
)
export const revertMigration = ModulesSdkUtils.buildRevertMigrationScript(
  migrationScriptOptions
)

const connectionLoader = ModulesSdkUtils.mikroOrmConnectionLoaderFactory({
  moduleName: Modules.REGION,
  moduleModels: Object.values(ModuleModels),
  migrationsPath: __dirname + "/migrations",
})

const containerLoader = ModulesSdkUtils.moduleContainerLoaderFactory({
  moduleModels: ModuleModels,
  moduleRepositories: ModuleRepositories,
  moduleServices: ModuleServices,
})

const service = RegionModuleService
const loaders = [connectionLoader, containerLoader, loadDefaults] as any

export const moduleDefinition: ModuleExports = {
  service,
  loaders,
  runMigrations,
  revertMigration,
}
