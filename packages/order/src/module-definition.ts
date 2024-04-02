import { Modules } from "@medusajs/modules-sdk"
import { ModuleExports } from "@medusajs/types"
import { ModulesSdkUtils } from "@medusajs/utils"
import * as Models from "@models"
import * as ModuleModels from "@models"
import * as ModuleRepositories from "@repositories"
import * as ModuleServices from "@services"
import { OrderModuleService } from "@services"

const migrationScriptOptions = {
  moduleName: Modules.ORDER,
  models: Models,
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
  moduleName: Modules.ORDER,
  moduleModels: Object.values(Models),
  migrationsPath: __dirname + "/migrations",
})

const service = OrderModuleService
const loaders = [containerLoader, connectionLoader] as any

export const moduleDefinition: ModuleExports = {
  service,
  loaders,
  revertMigration,
  runMigrations,
}
