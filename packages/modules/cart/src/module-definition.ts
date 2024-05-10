import { Modules } from "@medusajs/modules-sdk"
import { ModuleExports } from "@medusajs/types"
import { ModulesSdkUtils } from "@medusajs/utils"
import * as Models from "@models"
import * as ModuleModels from "@models"
import { CartModuleService } from "./services"
import * as ModuleRepositories from "@repositories"
import * as ModuleServices from "@services"

const migrationScriptOptions = {
  moduleName: Modules.CART,
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
  moduleName: Modules.CART,
  moduleModels: Object.values(ModuleModels),
  migrationsPath: __dirname + "/migrations",
})

const containerLoader = ModulesSdkUtils.moduleContainerLoaderFactory({
  moduleModels: ModuleModels,
  moduleRepositories: ModuleRepositories,
  moduleServices: ModuleServices,
})

const service = CartModuleService
const loaders = [connectionLoader, containerLoader] as any

export const moduleDefinition: ModuleExports = {
  service,
  loaders,
  runMigrations,
  revertMigration,
}
