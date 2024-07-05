import { ModuleExports } from "@medusajs/types"
import * as ModuleServices from "@services"
import { CurrencyModuleService } from "@services"
import { Modules } from "@medusajs/modules-sdk"
import * as Models from "@models"
import * as ModuleModels from "@models"
import { ModulesSdkUtils } from "@medusajs/utils"
import * as ModuleRepositories from "@repositories"
import initialDataLoader from "./loaders/initial-data"

const migrationScriptOptions = {
  moduleName: Modules.CURRENCY,
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
  moduleName: Modules.CURRENCY,
  moduleModels: Object.values(Models),
  migrationsPath: __dirname + "/migrations",
})

const service = CurrencyModuleService
const loaders = [containerLoader, connectionLoader, initialDataLoader] as any

export const moduleDefinition: ModuleExports = {
  service,
  loaders,
  revertMigration,
  runMigrations,
}
