import * as Models from "@models"
import * as ModuleModels from "@models"

import * as ModuleServices from "@services"
import { UserModuleService } from "@services"
import { ModuleExports } from "@medusajs/types"
import { Modules } from "@medusajs/modules-sdk"
import { ModulesSdkUtils } from "@medusajs/utils"
import * as ModuleRepositories from "@repositories"

const migrationScriptOptions = {
  moduleName: Modules.USER,
  models: Models,
  pathToMigrations: __dirname + "/migrations",
}

export const runMigrations = ModulesSdkUtils.buildMigrationScript(
  migrationScriptOptions
)
export const revertMigration = ModulesSdkUtils.buildRevertMigrationScript(
  migrationScriptOptions
)

const connectionLoader = ModulesSdkUtils.mikroOrmConnectionLoaderFactory({
  moduleName: Modules.USER,
  moduleModels: Object.values(ModuleModels),
  migrationsPath: __dirname + "/migrations",
})

const containerLoader = ModulesSdkUtils.moduleContainerLoaderFactory({
  moduleModels: ModuleModels,
  moduleRepositories: ModuleRepositories,
  moduleServices: ModuleServices,
})

const service = UserModuleService
const loaders = [connectionLoader, containerLoader] as any

export const moduleDefinition: ModuleExports = {
  service,
  loaders,
  runMigrations,
  revertMigration,
}
