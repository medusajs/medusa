import { ModuleExports } from "@medusajs/types"
import { ProductModuleService } from "@services"
import loadConnection from "./loaders/connection"
import loadContainer from "./loaders/container"

import { Modules } from "@medusajs/modules-sdk"
import { ModulesSdkUtils } from "@medusajs/utils"
import * as ProductModels from "@models"

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

const service = ProductModuleService
const loaders = [loadContainer, loadConnection] as any

export const moduleDefinition: ModuleExports = {
  service,
  loaders,
  runMigrations,
  revertMigration,
}
