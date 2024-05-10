import { Modules } from "@medusajs/modules-sdk"
import { ModuleExports } from "@medusajs/types"
import { ModulesSdkUtils } from "@medusajs/utils"
import * as ModuleServices from "@services"
import { CustomerModuleService } from "@services"
import * as ModuleModels from "@models"
import * as ModuleRepositories from "@repositories"

const migrationScriptOptions = {
  moduleName: Modules.CUSTOMER,
  models: ModuleModels,
  pathToMigrations: __dirname + "/migrations",
}

export const revertMigration = ModulesSdkUtils.buildRevertMigrationScript(
  migrationScriptOptions
)

export const runMigrations = ModulesSdkUtils.buildMigrationScript(
  migrationScriptOptions
)

const connectionLoader = ModulesSdkUtils.mikroOrmConnectionLoaderFactory({
  moduleName: Modules.CUSTOMER,
  moduleModels: Object.values(ModuleModels),
  migrationsPath: __dirname + "/migrations",
})

const containerLoader = ModulesSdkUtils.moduleContainerLoaderFactory({
  moduleModels: ModuleModels,
  moduleRepositories: ModuleRepositories,
  moduleServices: ModuleServices,
})

const service = CustomerModuleService
const loaders = [connectionLoader, containerLoader] as any

export const moduleDefinition: ModuleExports = {
  service,
  loaders,
  runMigrations,
  revertMigration,
}
