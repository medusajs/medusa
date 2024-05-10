import { ModuleExports } from "@medusajs/types"
import * as ModuleServices from "@services"
import { ProductModuleService } from "@services"

import { Modules } from "@medusajs/modules-sdk"
import { ModulesSdkUtils } from "@medusajs/utils"
import * as ProductModels from "@models"
import * as ModuleModels from "@models"
import * as ModuleRepositories from "@repositories"

const migrationScriptOptions = {
  moduleName: Modules.PRODUCT,
  models: ProductModels,
  pathToMigrations: __dirname + "/migrations",
}

export const runMigrations = ModulesSdkUtils.buildMigrationScript(
  migrationScriptOptions
)
export const revertMigration = ModulesSdkUtils.buildRevertMigrationScript(
  migrationScriptOptions
)

const connectionLoader = ModulesSdkUtils.mikroOrmConnectionLoaderFactory({
  moduleName: Modules.PRODUCT,
  moduleModels: Object.values(ModuleModels),
  migrationsPath: __dirname + "/migrations",
})

const containerLoader = ModulesSdkUtils.moduleContainerLoaderFactory({
  moduleModels: ModuleModels,
  moduleRepositories: ModuleRepositories,
  moduleServices: ModuleServices,
})

const service = ProductModuleService
const loaders = [containerLoader, connectionLoader] as any

export const moduleDefinition: ModuleExports = {
  service,
  loaders,
  runMigrations,
  revertMigration,
}
