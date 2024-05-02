import { MikroOrmBaseRepository, ModulesSdkUtils } from "@medusajs/utils"
import { Modules } from "@medusajs/modules-sdk"
import { ModuleExports } from "@medusajs/types"
import * as Models from "@models"
import * as ModuleModels from "@models"
import * as ModuleServices from "@services"
import { TaxModuleService } from "@services"
import loadProviders from "./loaders/providers"

const migrationScriptOptions = {
  moduleName: Modules.TAX,
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
  moduleRepositories: { BaseRepository: MikroOrmBaseRepository },
  moduleServices: ModuleServices,
})

const connectionLoader = ModulesSdkUtils.mikroOrmConnectionLoaderFactory({
  moduleName: Modules.TAX,
  moduleModels: Object.values(Models),
  migrationsPath: __dirname + "/migrations",
})

const service = TaxModuleService
const loaders = [containerLoader, connectionLoader, loadProviders] as any

export const moduleDefinition: ModuleExports = {
  service,
  loaders,
  revertMigration,
  runMigrations,
}
